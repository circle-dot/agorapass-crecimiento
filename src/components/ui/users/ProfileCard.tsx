import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getAvatar } from './getAvatarImg';
import { motion } from "framer-motion";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { DateTime } from "luxon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MetaMaskAvatar } from 'react-metamask-avatar';
import blockies from 'ethereum-blockies';
import { copyToClipboard } from '@/utils/copyToClipboard';
import Image from 'next/image';
import { Twitter } from 'lucide-react';
import FarcasterLogo from '@/../../public/purple-white.svg'
import { usePrivy } from '@privy-io/react-auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import LinkedButton from './LinkedButton';
import UnlinkAccounts from './UnlinkAccounts';

const MySwal = withReactContent(Swal);

export const FormSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    bio: z.string().max(160, { message: "Bio must not be longer than 160 characters." }).optional(),
    avatarType: z.enum(['metamask', 'blockies']).default('metamask'),
});

interface ProfileCardProps {
    data: any;  // Replace `any` with the actual type if available
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
}

export function ProfileCard({ data, onSubmit }: ProfileCardProps) {
    const { ready, authenticated, user, linkTwitter, linkFarcaster, unlinkTwitter, unlinkFarcaster } = usePrivy();
    const { email, wallet, rankScore, vouchesAvailables, createdAt, vouchReset, name, bio, avatarType, displayFarcaster, displayTwitter } = data || {};
    const icon = blockies.create({ seed: wallet, size: 8, scale: 4 }).toDataURL();
    const [remainingTime, setRemainingTime] = useState('00:00:00');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const formattedDate = DateTime.fromISO(createdAt).toLocaleString(DateTime.DATE_FULL);
    const vouchResetDate = DateTime.fromISO(vouchReset);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { username: name || "", bio: bio || "", avatarType: avatarType || "metamask" },
    });

    useEffect(() => {
        form.reset({ username: name || "", bio: bio || "", avatarType: avatarType || "metamask" });
    }, [name, bio, avatarType, form]);

    useEffect(() => {
        const updateRemainingTime = () => {
            const now = DateTime.now();
            const remainingDuration = vouchResetDate.diff(now, ['days', 'hours', 'minutes', 'seconds']);

            if (remainingDuration.as('milliseconds') <= 0) {
                setRemainingTime('00:00:00');
            } else {
                // Extract values with default to 0 if undefined
                const { days = 0, hours = 0, minutes = 0, seconds = 0 } = remainingDuration.shiftTo('days', 'hours', 'minutes', 'seconds').toObject();

                // Format remaining time
                const formattedTime = days > 0
                    ? `${String(Math.floor(days)).padStart(2, '0')}d ${String(Math.floor(hours)).padStart(2, '0')}h ${String(Math.floor(minutes)).padStart(2, '0')}m ${String(Math.floor(seconds)).padStart(2, '0')}s`
                    : `${String(Math.floor(hours)).padStart(2, '0')}:${String(Math.floor(minutes)).padStart(2, '0')}:${String(Math.floor(seconds)).padStart(2, '0')}`;

                setRemainingTime(formattedTime);
            }
        };
        updateRemainingTime();
        const intervalId = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(intervalId);
    }, [vouchResetDate]);

    const handleFormSubmit = (data: z.infer<typeof FormSchema>) => {
        onSubmit(data);
        setIsDialogOpen(false);
    };

    // Check if data is available before rendering the avatar
    if (!wallet || !avatarType) {
        return <div>Loading...</div>;
    }

    const avatar = getAvatar(wallet, avatarType);

    const handleCopy = () => {
        copyToClipboard(wallet);
    };

    const handleLinkTwitterClick = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You are about to link your X account. This will redirect you to X.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, link it!'
        }).then((result) => {
            if (result.isConfirmed) {
                linkTwitter();
            }
        });
    };


    return (
        <Card className="shadow-lg">
            <CardHeader className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                >
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                        {typeof avatar === 'string' ? (
                            <AvatarImage src={avatar} alt="Avatar Image" />
                        ) : (
                            avatar
                        )}
                        {/* <AvatarFallback className="flex items-center justify-center">{email?.charAt(0)}</AvatarFallback> */}
                    </Avatar>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center space-y-2"
                >
                    <p className="text-lg font-medium">{name ? name : email}</p>
                    <div className='flex items-center justify-around flex-row p-1 gap-1 w-full '>
                        <LinkedButton
                            isLinked={!!user?.twitter}
                            displayColumn="twitter"
                            linkUrl={`https://x.com/${user?.twitter?.username}`}
                            onClick={handleLinkTwitterClick}
                            text="Link Twitter"
                            linkedText="Linked with Twitter"
                            icon={<Twitter className='w-6 h-6 ml-1' />}
                            className='text-gray-500'
                            linkedColor='text-[#1DA1F2]'
                            username={user?.twitter?.username || ''}
                            isDisplayed={displayTwitter}

                        />
                        <LinkedButton
                            isLinked={!!user?.farcaster}
                            displayColumn="farcaster"
                            linkUrl={`https://warpcast.com/${user?.farcaster?.username}`}
                            onClick={linkFarcaster}
                            text="Link Farcaster"
                            linkedText="Linked with Farcaster"
                            icon={<Image src={FarcasterLogo} alt='Connect with Farcaster' className='w-6 h-6 ml-1' />}
                            className='text-gray-500'
                            linkedColor='text-[#8a63d2]'
                            username={user?.farcaster?.username || ''}
                            isDisplayed={displayFarcaster}

                        />

                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p className="text-sm text-muted-foreground truncate lg:truncate lg:w-9/12 px-4 break-words w-full border-zinc-400 rounded lg:rounded-full border cursor-pointer" onClick={handleCopy}>{wallet}</p>
                            </TooltipTrigger>
                            <TooltipContent className='bg-primarydark rounded p-0.5 m-2'>
                                <p>{wallet}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <p className="text-sm text-muted-foreground">Member since {formattedDate}</p>
                </motion.div>
            </CardHeader>
            <CardContent className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                >
                    <div>
                        {bio}
                    </div>
                    <p>Vouches available: {vouchesAvailables}</p>
                    <p>It refreshes in: {remainingTime}</p>
                    <UnlinkAccounts
                        user={user}
                        unlinkTwitter={unlinkTwitter}
                        unlinkFarcaster={unlinkFarcaster}
                    />
                </motion.div>
            </CardContent>
            <CardFooter className="flex justify-center items-center flex-col">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                >
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Edit my profile</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleFormSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} maxLength={160} />
                                                </FormControl>
                                                <FormDescription>
                                                    Max 160 characters
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="avatarType"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Choose an avatar</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col md:flex-row md:items-start md:justify-start space-y-1 "
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="blockies" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                <Avatar className="w-24 h-24 mx-auto mb-4">
                                                                    <AvatarImage src={getAvatar(wallet, 'blockies') as string} alt="Blockies Avatar" className="w-full h-full object-cover" />
                                                                    <AvatarFallback>{email?.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0 p-0 m-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="metamask" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                <div className="w-24 h-24 mx-auto mb-4">
                                                                    <MetaMaskAvatar address={wallet} size={96} className="w-full h-full object-cover" />
                                                                </div>
                                                            </FormLabel>
                                                        </FormItem>

                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <DialogFooter>
                                        <Button type="submit">
                                            Save changes
                                        </Button>
                                        {/* <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose> */}
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </motion.div>
            </CardFooter>
        </Card>
    );
}
