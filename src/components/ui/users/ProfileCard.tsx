"use client";
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
import { getAvatar } from "@/utils/getAvatarImg";
import { motion } from "framer-motion";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";

export const FormSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    bio: z.string().max(160, { message: "Bio must not be longer than 160 characters." }).optional(),
});

interface ProfileCardProps {
    data: any;
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
}

export function ProfileCard({ data, onSubmit }: ProfileCardProps) {
    const { email, wallet, rankScore, vouchesAvailables, createdAt, vouchReset, name, bio } = data || {};

    const [remainingTime, setRemainingTime] = useState('00:00:00');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const formattedDate = DateTime.fromISO(createdAt).toLocaleString(DateTime.DATE_FULL);

    // Convert `vouchReset` to DateTime
    const vouchResetDate = DateTime.fromISO(vouchReset);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { username: name || "", bio: bio || "" }, // Ensure default values are set
    });

    useEffect(() => {
        form.reset({ username: name || "", bio: bio || "" }); // Reset form with new data when `data` changes
    }, [name, bio, form]);

    useEffect(() => {
        const updateRemainingTime = () => {
            const now = DateTime.now();
            const remainingDuration = vouchResetDate.diff(now, ['hours', 'minutes', 'seconds']);

            if (remainingDuration.as('milliseconds') <= 0) {
                setRemainingTime('00:00:00');
            } else {
                const { hours, minutes, seconds } = remainingDuration.shiftTo('hours', 'minutes', 'seconds').toObject();
                setRemainingTime(
                    `${String(Math.floor(hours || 0)).padStart(2, '0')}:${String(Math.floor(minutes || 0)).padStart(2, '0')}:${String(Math.floor(seconds || 0)).padStart(2, '0')}`
                );
            }
        };

        updateRemainingTime();
        const intervalId = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(intervalId);
    }, [vouchResetDate]);

    return (
        <Card className="shadow-lg">
            <CardHeader className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                >
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={getAvatar(rankScore)} alt="Profile Image" />
                        <AvatarFallback>{email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center space-y-2"
                >
                    <p className="text-lg font-medium">{name ? name : email}</p>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p className="text-sm text-muted-foreground truncate lg:truncate lg:w-9/12 px-4 break-words w-full border-zinc-400 rounded lg:rounded-full border">{wallet}</p>
                            </TooltipTrigger>
                            <TooltipContent>
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
                                    onSubmit={form.handleSubmit(onSubmit)}
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
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            onClick={() => {
                                                // Prevent closing the dialog if there are validation errors
                                                if (form.formState.isValid) {
                                                    setIsDialogOpen(false);
                                                }
                                            }}
                                        >
                                            Save changes
                                        </Button>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
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
