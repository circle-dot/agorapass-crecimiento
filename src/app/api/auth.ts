import { generateSignature } from "@/utils/generateSignature";
import { supportedEvents, whitelistedTickets } from "@/components/zupass/zupass-config";
import { isEqualEdDSAPublicKey } from "@pcd/eddsa-pcd";
import {
    ZKEdDSAEventTicketPCD,
    ZKEdDSAEventTicketPCDPackage,
} from "@pcd/zk-eddsa-event-ticket-pcd";
import { NextRequest, NextResponse } from "next/server";

const nullifiers = new Set<string>();

type TicketType = keyof typeof whitelistedTickets;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const pcds = await request.json();

        if (!Array.isArray(pcds) || pcds.length === 0) {
            return NextResponse.json({ message: "No PCDs specified or invalid input format." }, { status: 400 });
        }

        const validPcds: ZKEdDSAEventTicketPCD[] = [];
        const responses: { error: string; status: number }[] = [];
        const nonce = "your_predefined_nonce"; // Replace with actual nonce retrieval if needed
        const bigIntNonce = BigInt("0x" + nonce);

        for (const { type, pcd: inputPCD } of pcds) {
            if (type !== "zk-eddsa-event-ticket-pcd") {
                responses.push({ error: `Invalid PCD type: ${type}`, status: 400 });
                continue;
            }

            const pcd = await ZKEdDSAEventTicketPCDPackage.deserialize(inputPCD);

            if (!inputPCD || !pcd) {
                responses.push({
                    error: "Invalid PCD format or deserialization error",
                    status: 400,
                });
                continue;
            }

            if (!(await ZKEdDSAEventTicketPCDPackage.verify(pcd))) {
                responses.push({ error: "ZK ticket PCD is not valid", status: 401 });
                continue;
            }

            if (pcd.claim.watermark.toString() !== bigIntNonce.toString()) {
                responses.push({ error: "PCD watermark doesn't match", status: 401 });
                continue;
            }

            if (!pcd.claim.nullifierHash) {
                responses.push({
                    error: "PCD ticket nullifier has not been defined",
                    status: 401,
                });
                continue;
            }

            if (pcd.claim.partialTicket.eventId) {
                const eventId = pcd.claim.partialTicket.eventId;
                if (!supportedEvents.includes(eventId)) {
                    responses.push({
                        error: `PCD ticket is not for a supported event: ${eventId}`,
                        status: 400,
                    });
                    continue;
                }
            } else {
                let eventError = false;
                for (const eventId of pcd.claim.validEventIds ?? []) {
                    if (!supportedEvents.includes(eventId)) {
                        responses.push({
                            error: `PCD ticket is not restricted to supported events: ${eventId}`,
                            status: 400,
                        });
                        eventError = true;
                        break;
                    }
                }
                if (eventError) continue;
            }

            nullifiers.add(pcd.claim.nullifierHash);
            validPcds.push(pcd);
        }

        if (validPcds.length > 0) {
            const { encodedPayload, signature, ticketType } = await generateSignature(validPcds, nonce);

            if (!encodedPayload || !signature) {
                return NextResponse.json({ message: "Signature couldn't be generated" }, { status: 500 });
            }

            for (let pcd of validPcds) {
                let isValid = false;

                for (let type of ticketType as TicketType[]) {
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

            const finalResponse = {
                attendeeEmail: validPcds[0].claim.partialTicket.attendeeEmail,
                encodedPayload,
                sig: signature,
                status: 200,
            };

            return NextResponse.json(finalResponse, { status: 200 });
        } else {
            return NextResponse.json({ message: "No valid PCDs found" }, { status: 400 });
        }
    } catch (error: any) {
        console.error(`[ERROR] ${error.message}`);
        return NextResponse.json(`Unknown error: ${error.message}`, { status: 500 });
    }
}
