import React, { useState, useEffect } from 'react';
import { handleQuark } from '@/utils/quarkId/connectQuark';
import { Button } from './button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from 'react-qr-code';

function ConnectQuarkId() {
    const [qrValue, setQrValue] = useState('placeholder');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [invitationId, setInvitationId] = useState<string | null>(null);

    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                console.log('WebSocket connection opened');
                if (invitationId) {
                    ws.send(JSON.stringify({ invitationId }));
                }
            };

            ws.onmessage = (event: MessageEvent) => {
                const messageData = JSON.parse(event.data);
                console.log('Message from server: ', messageData);

                if (messageData.data && messageData.data.invitationId === invitationId) {
                    console.log('The invitationId matches:', invitationId);
                    // Additional logic can be added here
                }
            };

            ws.onerror = (event: Event) => {
                console.error('WebSocket error: ', event);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };
        }
    }, [ws, invitationId]);

    const generateQRCode = async () => {
        try {
            const data = await handleQuark();
            if (data && data.oobContentData) {
                setQrValue(data.oobContentData);

                const id = data.invitationId;
                setInvitationId(id); // Save the invitationId
                const wsUrl = `wss://api.stamp.network/ws/${id}`;
                const websocket = new WebSocket(wsUrl);
                setWs(websocket);
            } else {
                setQrValue('error');
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            setQrValue('error');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={generateQRCode}>
                    Connect QuarkId
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Connect QuarkId</DialogTitle>
                    <DialogDescription>
                        Scan the QR and follow the steps on screen.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 flex-col gap-y-2">
                    <div className="h-auto my mx-auto w-full">
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={qrValue}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ConnectQuarkId;
