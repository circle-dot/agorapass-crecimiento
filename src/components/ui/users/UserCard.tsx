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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserCard() {
    return (
        <Card>
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                <div className="space-y-1">

                    <CardTitle className='flex flex-row items-center gap-4'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        shadcn/ui</CardTitle>
                    <CardDescription>
                        Beautifully designed components that you can copy and paste into
                        your apps. Accessible. Customizable. Open Source.
                    </CardDescription>
                </div>
                <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
                    <Button variant="secondary" className="px-3 shadow-none w-full">
                        <StarIcon className="mr-2 h-4 w-4" />
                        Vouch
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground justify-between">
                    <div className="flex items-center">
                        <StarIcon className="mr-1 h-3 w-3" />Trusted by
                        20k
                    </div>
                    <div className="flex items-center">
                        <a href="#"><TwitterLogoIcon className="mr-1 h-4 w-4 fill-sky-400 text-sky-400" /></a>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
