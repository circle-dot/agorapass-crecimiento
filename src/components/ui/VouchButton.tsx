import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from './button';
import { handleVouch } from '@/utils/handleAttestation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import ConnectQuarkId from './ConnectQuarkId';

interface VouchButtonCustomProps {
    recipient: string;
    className?: string;
    authStatus: boolean;
}

const HandleNoQuarkId: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>QuarkId not connected</DialogTitle>
                <DialogDescription>
                    <div className='flex flex-col justify-center items-center my-2 gap-y-2'>
                        Please connect your QuarkId to vouch for people!
                        <ConnectQuarkId />
                    </div>
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button>Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

const VouchButtonCustom: React.FC<VouchButtonCustomProps> = ({ recipient, className, authStatus }) => {
    const { getAccessToken, user } = usePrivy();
    const { wallets } = useWallets();
    const [showDialog, setShowDialog] = useState(false);

    const handleClick = async () => {
        const result = await handleVouch(recipient, authStatus, user, wallets, getAccessToken);
        if (result === 404) {
            setShowDialog(true); // Show the dialog if QuarkId is not connected
        }
    };

    const handleCloseDialog = () => setShowDialog(false);

    return (
        <>
            {authStatus && (
                <Button
                    onClick={handleClick}
                    className={`inline-flex w-full hover:animate-shimmer items-center justify-center rounded-md border border-gray-300 bg-[linear-gradient(110deg,#ffffff,45%,#f0f0f0,55%,#ffffff)] bg-[length:200%_100%] px-6 font-medium text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 ${className}`}
                >
                    Vouch
                </Button>
            )}
            {showDialog && <HandleNoQuarkId onClose={handleCloseDialog} />}
        </>
    );
};

export default VouchButtonCustom;
