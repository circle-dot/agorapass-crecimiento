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
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { handleVouchQuarkId } from '@/utils/quarkId/handleAttestation';
import ShinyButton from './ShinyButton';
import { LoaderCircle } from 'lucide-react'; // Import the spinner icon

function ConnectQuarkId() {
    const { getAccessToken, user } = usePrivy();
    const { wallets } = useWallets();
    const [qrValue, setQrValue] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [invitationId, setInvitationId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false); // State for status check loading
    const [statusData, setStatusData] = useState<any>(null);

    useEffect(() => {
        const setupWebSocket = async () => {
            if (ws) {
                const token = await getAccessToken();

                ws.onopen = () => {
                    console.log('WebSocket connection opened');
                    if (invitationId) {
                        ws.send(JSON.stringify({ invitationId }));
                    }
                };

                ws.onmessage = async (event: MessageEvent) => {
                    const messageData = JSON.parse(event.data);
                    console.log('Message from server: ', messageData);

                    if (messageData.data && messageData.data.invitationId === invitationId) {
                        console.log('The invitationId matches:', invitationId);
                        const holderDID = messageData.data.rawData.holderDID;
                        const email = messageData.data.rawData.verifiableCredentials[0].credentialSubject.email;
                        const proofValue = messageData.data.rawData.verifiableCredentials[0].proof.proofValue;
                        const ticketType = messageData.data.rawData.verifiableCredentials[0].credentialSubject.category;
                        const payload = {
                            holderDID,
                            email,
                            proofValue,
                            ticketType
                        };
                        await handleVouchQuarkId(user, wallets, token, payload);
                        setIsOpen(false); // Close the modal after handling VouchQuarkId
                    }
                };

                ws.onerror = (event: Event) => {
                    console.error('WebSocket error: ', event);
                };

                ws.onclose = () => {
                    console.log('WebSocket connection closed');
                };
            }
        };

        setupWebSocket();
    }, [ws, invitationId, getAccessToken, user, wallets]);

    const generateQRCode = async () => {
        setIsLoading(true);
        setQrValue('');
        setIsOpen(true);

        try {
            const data = await handleQuark();
            if (data && data.oobContentData) {
                setQrValue(data.oobContentData);

                const id = data.invitationId;
                setInvitationId(id);
                const wsUrl = `wss://api.stamp.network/ws/${id}`;
                const websocket = new WebSocket(wsUrl);
                setWs(websocket);
            } else {
                setQrValue('error');
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            setQrValue('error');
        } finally {
            setIsLoading(false);
        }
    };

    const checkStatus = async () => {
        if (!invitationId) return;

        setStatusLoading(true); // Start status check loading

        try {
            const response = await fetch('/api/quarkid/pendingQuark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invitationId: invitationId }),
            });

            const result = await response.json();
            if (response.ok && result.existingQuarkId) {
                setStatusData(result.existingQuarkId);
                const { proofValue, holderDID, ticketType, invitationId, email } = result.existingQuarkId;
                const payload = {
                    holderDID,
                    email,
                    proofValue,
                    ticketType
                };
                await handleVouchQuarkId(user, wallets, await getAccessToken(), payload);
                setIsOpen(false); // Close the dialog after handling VouchQuarkId
            } else {
                console.log('No existing QuarkId found');
                setStatusData(null);
            }
        } catch (error) {
            console.error('Error checking status:', error);
        } finally {
            setStatusLoading(false); // Stop status check loading
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="h-auto my mx-auto w-full">
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={qrValue || 'placeholder'}
                                viewBox={`0 0 256 256`}
                            />
                            {qrValue && (
                                <div className='lg:hidden flex flex-col pt-2 gap-y-1.5 items-center justify-center'>
                                    <b className='font-bold'>In mobile?</b>
                                    <a href={qrValue}>
                                        <ShinyButton className='bg-primarydark '>
                                            Click here to connect QuarkId
                                        </ShinyButton>
                                    </a>
                                    <p>Once you do it, click below</p>
                                    <Button 
                                        className='bg-accentdarker hover:bg-accentdarker' 
                                        variant='outline' 
                                        onClick={checkStatus}
                                        disabled={statusLoading} // Disable the button while loading
                                    >
                                        {statusLoading ? (
                                            <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> // Spinner icon
                                        ) : (
                                            'Check the status!'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
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
