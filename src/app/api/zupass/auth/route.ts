import { NextRequest, NextResponse } from 'next/server';
import { supportedEvents, whitelistedTickets, matchTicketToType } from '@/components/zupass/zupass-config';
import { isEqualEdDSAPublicKey } from '@pcd/eddsa-pcd';
import {
    ZKEdDSAEventTicketPCD,
    ZKEdDSAEventTicketPCDPackage
} from '@pcd/zk-eddsa-event-ticket-pcd';

const nullifiers = new Set<string>();

type TicketType = keyof typeof whitelistedTickets;

export const POST = async (req: NextRequest) => {
    try {
        const { pcds, nonce } = await req.json();

        if (!Array.isArray(pcds) || pcds.length === 0) {
            return NextResponse.json({ message: "No PCDs specified or invalid input format." }, { status: 400 });
        }

        const validPcds: ZKEdDSAEventTicketPCD[] = [];
        const responses: { error: string; status: number }[] = [];

        if (!nonce) {
            return NextResponse.json({ message: "No nonce provided" }, { status: 401 });
        }

        const bigIntNonce = BigInt("0x" + nonce);

        for (const { type, pcd: inputPCD } of pcds) {
            if (type !== "zk-eddsa-event-ticket-pcd") {
                responses.push({ error: `Invalid PCD type: ${type}`, status: 400 });
                continue;
            }

            try {
                const pcd = await ZKEdDSAEventTicketPCDPackage.deserialize(inputPCD);

                const groups: string[] = [];

                // Extract the desired fields and collect ticket types
                const eventId = pcd.claim.partialTicket.eventId;
                const productId = pcd.claim.partialTicket.productId;

                if (!eventId || !productId) {
                    throw new Error("No product or event selected.");
                }

                const ticketType = matchTicketToType(eventId, productId);
                if (!ticketType) {
                    throw new Error("Unable to determine ticket type.");
                }
                groups.push(ticketType);

                const payload = {
                    nonce: nonce,
                    email: pcd.claim.partialTicket.attendeeEmail,
                    external_id: pcd.claim.partialTicket.attendeeSemaphoreId,
                    add_groups: groups.join(",")
                };

                console.log('Payload:', payload); // Log payload for verification

                if (pcd.claim.nullifierHash) {
                    nullifiers.add(pcd.claim.nullifierHash);
                } else {
                    throw new Error("Nullifier hash is undefined.");
                }

                validPcds.push(pcd);
            } catch (error) {
                console.error('Error processing PCD:', error);
                responses.push({ error: "Error processing PCD", status: 500 });
            }
        }

        if (validPcds.length > 0) {
            for (let pcd of validPcds) {
                let isValid = false;

                for (let type of Object.keys(whitelistedTickets) as TicketType[]) {
                    const tickets = whitelistedTickets[type];

                    if (tickets) {
                        for (let ticket of tickets) {
                            const publicKey = ticket.publicKey;

                            if (isEqualEdDSAPublicKey(publicKey, pcd.claim.signer)) {
                                isValid = true;
                                break;
                            }
                        }
                    }

                    if (isValid) {
                        break;
                    }
                }

                if (!isValid) {
                    console.error(`[ERROR] PCD is not signed by Zupass`);
                    responses.push({ error: "PCD is not signed by Zupass", status: 401 });
                }
            }

            // Ensure 'payload' is available in the scope
            const payload = {
                nonce: nonce,
                email: validPcds[0].claim.partialTicket.attendeeEmail,
                external_id: validPcds[0].claim.partialTicket.attendeeSemaphoreId,
                add_groups: validPcds.filter(pcd => pcd.claim.partialTicket.eventId && pcd.claim.partialTicket.productId)
                    .map(pcd => matchTicketToType(pcd.claim.partialTicket.eventId!, pcd.claim.partialTicket.productId!)).join(",")
            };

            const finalResponse = {
                attendeeEmail: validPcds[0].claim.partialTicket.attendeeEmail,
                payload: payload,
                status: 200
            };

            console.log('Final Response:', finalResponse); // Log final response for verification

            return NextResponse.json(finalResponse, { status: 200 });
        } else {
            return NextResponse.json({ message: "No valid PCDs found" }, { status: 400 });
        }
    } catch (error: any) {
        console.error(`[ERROR] ${error.message}`);
        return NextResponse.json(`Unknown error: ${error.message}`, { status: 500 });
    }
};
