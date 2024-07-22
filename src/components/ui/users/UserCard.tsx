import React from 'react';
import {
    TwitterLogoIcon
} from "@radix-ui/react-icons";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types/user';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { getAvatar } from './getAvatarImg';
import { ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import VouchButtonCustom from '@/components/ui/VouchButton';

function truncateWallet(wallet: string) {
    return wallet.slice(0, 6) + '...' + wallet.slice(-4);
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
    const { name, wallet, bio, twitter, avatarType, rankScore } = user;

    const displayName = truncateName(name) || truncateWallet(wallet);
    const fullName = name || wallet;
    const displayBio = bio || "No bio provided";
    const avatar = getAvatar(wallet, avatarType);

    return (
        <Card>
            <CardContent className="flex flex-col justify-between h-full">
                <div className="space-y-1">
                    <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                        <div className="space-y-1">
                            <CardTitle className='flex flex-row items-center gap-4'>
                                <Avatar>
                                    {typeof avatar === 'string' ? (
                                        <AvatarImage src={avatar} alt="Avatar Image" />
                                    ) : (
                                        avatar
                                    )}
                                </Avatar>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={'/agora/address/' + wallet}>{displayName}</Link>
                                        </TooltipTrigger>
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
                            <VouchButtonCustom recipient={wallet} />
                        </div>
                    </CardHeader>
                </div>
                <div className="flex space-x-4 text-sm text-muted-foreground justify-between mt-auto">
                    <div className="flex items-center">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Rank Score {rankScore}
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
