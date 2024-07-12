import React from 'react';
import {
    StarIcon,
    TwitterLogoIcon
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types/user';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import redAvatar from '@/../../public/agora-red.png'
import noirAvatar from '@/../../public/agora-noir.png'
import regularAvatar from '@/../../public/agora.png'
import { ThumbsUp } from 'lucide-react';
function truncateWallet(walletAddress: string) {
    // Keep the first 6 characters and the last 4 characters
    return walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);
}

function truncateName(name: string) {
    const maxLength = 30; // Maximum characters to display before truncating
    if (name.length <= maxLength) {
        return name;
    } else {
        return name.slice(0, maxLength) + '…';
    }
}

const UserCard: React.FC<{ user: User }> = ({ user }) => {
    const { name, walletAddress, bio, twitter, rankScore, attestationReceived } = user;

    // Determine the display name: use name if available, otherwise use wallet address
    const displayName = truncateName(name) || truncateWallet(walletAddress);
    const fullName = name || walletAddress;
    // Determine the bio: use provided bio, otherwise default to "No bio provided"
    const displayBio = bio || "No bio provided";
    const getAvatar = () => {
        const score = rankScore ?? 0; // Default to 0 if rankScore is null or undefined
        if (score < 50) return redAvatar.src;
        if (score >= 100) return noirAvatar.src;
        return regularAvatar.src;
    };
    return (
        <Card>
            <CardContent className="flex flex-col justify-between h-full">
                <div className="space-y-1">
                    <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                        <div className="space-y-1">
                            <CardTitle className='flex flex-row items-center gap-4'>
                                <Avatar>
                                    <AvatarImage src={getAvatar()} />
                                    <AvatarFallback>{name ? name.charAt(0) : 'U'}</AvatarFallback>
                                </Avatar>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>{displayName}</TooltipTrigger>
                                        <TooltipContent>
                                            {fullName}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardTitle>
                            <CardDescription>
                                {displayBio}
                            </CardDescription>
                        </div>
                        <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="secondary" className="px-3 shadow-none w-full">
                                        <StarIcon className="mr-2 h-4 w-4" />
                                        Vouch
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Vouch them <StarIcon className="ml-2 h-4 w-4" />!</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                </div>
                <div className="flex space-x-4 text-sm text-muted-foreground justify-between mt-auto">
                    <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Trusted by {attestationReceived}
                    </div>
                    {twitter && (
                        <div className="flex items-center">
                            <a target="_blank" href={twitter}><TwitterLogoIcon className="mr-1 h-4 w-4 fill-sky-400 text-sky-400" /></a>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
export default UserCard;
