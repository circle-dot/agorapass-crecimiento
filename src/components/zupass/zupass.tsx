import { ZuAuthArgs, zuAuthPopup } from "@pcd/zuauth";
import { TicketTypeName } from "./types";
import { whitelistedTickets } from "./zupass-config";
import crypto from "crypto";

async function login() {
    // Define or retrieve your nonce here
    const nonce = crypto.randomBytes(16).toString("hex");
    // const bigIntNonce = BigInt("0x" + nonce);
    // const watermark = bigIntNonce.toString();

    const watermark = (await (await fetch("/api/zupass/watermark")).json())
        .watermark;
    // Ensure the tickets are formatted correctly
    const config = Object.entries(whitelistedTickets).flatMap(
        ([ticketType, tickets]) =>
            tickets
                .map((ticket) => {
                    if (ticket.eventId && ticket.productId) {
                        return {
                            pcdType: ticket.pcdType,
                            ticketType: ticketType as TicketTypeName,
                            eventId: ticket.eventId,
                            productId: ticket.productId,
                            eventName: ticket.eventName || "",
                            productName: ticket.productName || "",
                            publicKey: ticket.publicKey
                        };
                    }
                    console.error("Invalid ticket format:", ticket);
                    return null;
                })
                .filter(
                    (ticket): ticket is NonNullable<typeof ticket> => ticket !== null
                )
    );

    const args: ZuAuthArgs = {
        fieldsToReveal: {
            revealAttendeeEmail: true,
            revealAttendeeName: true,
            revealEventId: true,
            revealProductId: true,
            revealAttendeeSemaphoreId: true
        },
        returnUrl: window.location.origin,
        watermark,
        config,
        proofTitle: "Sign-In with Zupass",
        proofDescription: "**Use Zupass to login to Agora City**",
        multi: true
    };

    const result = await zuAuthPopup(args);
    console.log("🚀 ~ login ~ result:", result);

    // if (result && result.type === "multi-pcd" && Array.isArray(result.pcds)) {
    //     // Prepare the PCDs to send to your endpoint
    //     const pcds = result.pcds.map((pcd) => ({
    //         type: pcd.type,
    //         pcd: JSON.parse(pcd.pcd), // Parse the JSON if necessary
    //     }));

    //     //sending PCDs and nonce to your endpoint
    //     const endpoint = "/api/auth/authenticate";
    //     const response = await fetch(endpoint, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ nonce, pcds }),
    //     });

    //     if (!response.ok) {
    //         throw new Error(`Failed to send PCDs to endpoint: ${response.status}`);
    //     }

    //     console.log("PCDs and nonce sent successfully:", response.status);
    // } else {
    //     console.error("Invalid or missing PCDs in the result from zuAuthPopup");
    // }
}

export function useZupass(): {
    login: () => Promise<void>;
} {
    return { login };
}
