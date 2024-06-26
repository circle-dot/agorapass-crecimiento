"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePrivy } from '@privy-io/react-auth';

export default function Page() {
    const { user } = usePrivy();

    // Check if user is not null
    if (!user) {
        return <div>Loading...</div>;
    }

    const { email, createdAt } = user;
    const profileImageUrl = "https://avatars.githubusercontent.com/u/79646488"; // Replace with actual profile image URL if available

    const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="flex items-center justify-center p-4">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={profileImageUrl} alt="Profile Image" />
                            <AvatarFallback>{email?.address.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <p className="text-lg font-medium">{email?.address}</p>
                            <p className="text-sm text-muted-foreground">Member since {formattedDate}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="outline" disabled>
                        My temp button
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
