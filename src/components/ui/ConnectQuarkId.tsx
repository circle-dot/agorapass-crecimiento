import React, { useState, useEffect, useRef } from 'react';
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
    const [invitationId, setInvitationId] = useState(null);
    const websocketRef = useRef(null);

    // Function to handle WebSocket messages
    const handleWebSocketMessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.invitationId === invitationId) {
            console.log("Matching invitationId received:", message);
            // Handle the data received from the WebSocket
        } else {
            console.log("invitationId does not match");
        }
    };

    const connectWebSocket = (id) => {
        const wsUrl = `ws://placeholder:8000/ws/${id}`;
        websocketRef.current = new WebSocket(wsUrl);

        websocketRef.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        websocketRef.current.onmessage = handleWebSocketMessage;

        websocketRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };

    const generateQRCode = async () => {
        const data = await handleQuark();
        if (data && data.oobContentData && data.invitationId) {
            setQrValue(data.oobContentData);
            setInvitationId(data.invitationId);
            connectWebSocket(data.invitationId);  // Connect to WebSocket with the received invitationId
        } else {
            // Handle case where no deeplink is returned
            setQrValue('error');
        }
    };

    useEffect(() => {
        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();  // Close WebSocket connection when component unmounts
            }
        };
    }, []);

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
