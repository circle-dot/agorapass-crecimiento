import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";
import { copyToClipboard } from "@/utils/copyToClipboard";
import QRCode from "react-qr-code";
import WarpcastLogo from '@/../../public/warpcast.webp';
import Image from "next/image";
import TelegramLogo from '@/../../public/Telegram_logo.svg';

export default function ShareProfile({ address }: string | any) {
    const ProfileUrl = process.env.NEXT_PUBLIC_BASE_URL + "/address/" + address;

    const handleCopy = () => {
        copyToClipboard(ProfileUrl);
    };

    const handleShareToWarpcast = () => {
        const warpcastUrl = `https://warpcast.com/~/compose?embeds[]=${ProfileUrl}`;
        window.open(warpcastUrl, "_blank");
    };

    const handleShareToTelegram = () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(ProfileUrl)}&text=Check out this profile:`;
        window.open(telegramUrl, "_blank");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Share <Share2 className="w-3 h-3 ml-1" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share your profile</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to see your profile.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 flex-col gap-y-2">
                    <div className="h-auto my mx-auto w-full">
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={ProfileUrl}
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input id="link" defaultValue={ProfileUrl} readOnly />
                        </div>
                        <Button onClick={handleCopy} size="sm" className="px-3">
                            <span className="sr-only">Copy</span>
                            <CopyIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button onClick={handleShareToWarpcast} variant="outline" className="mt-2">
                        Share on Warpcast <Image src={WarpcastLogo} alt='User with Farcaster' className='mx-1 h-6 w-6 ' />
                    </Button>
                    <Button onClick={handleShareToTelegram} variant="outline" className="mt-2">
                        Share on Telegram <Image src={TelegramLogo} alt='Telegram' className='mx-1 h-6 w-6 ' />
                    </Button>
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
