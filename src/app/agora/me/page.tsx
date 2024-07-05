"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePrivy } from '@privy-io/react-auth';
import { DateTime, Interval } from "luxon";

export default function Page() {
  const { user } = usePrivy();
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    if (!user) return;

    const targetDate = DateTime.now().plus({ weeks: 1 });

    const updateRemainingTime = () => {
      const now = DateTime.now();
      const interval = Interval.fromDateTimes(now, targetDate);
      const { days, hours, minutes, seconds } = interval.toDuration(['days', 'hours', 'minutes', 'seconds']).toObject();
      //@ts-expect-error !TODO double check this, is temp until we use the db
      setRemainingTime(`${Math.floor(days * 24 + hours).toString().padStart(2, '0')}:${Math.floor(minutes).toString().padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`);
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [user]);

  // Check if user is not null
  if (!user) {
    return <div>Loading...</div>;
  }

  const { email, createdAt, wallet } = user;
  const profileImageUrl = "https://source.boringavatars.com/"; // Replace with actual profile image URL if available

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-[350px]">
        <CardHeader>
          {/* <CardTitle>Profile</CardTitle>
          <CardDescription>Profile information</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileImageUrl} alt="Profile Image" />
              <AvatarFallback>{email?.address.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center flex items-center justify-center flex-col w-full">
              <p className="text-lg font-medium">{email?.address}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground lg:truncate lg:w-9/12 px-4 break-words w-full border-zinc-400 rounded lg:rounded-full border">{wallet?.address}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{wallet?.address}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-sm text-muted-foreground">Member since {formattedDate}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center items-center flex-col">
          <p>Vouches available: 3</p>
          <p>It refreshes in: {remainingTime}</p>
          <Button variant="outline" asChild>
            <a target="_blank" href={'https://base.easscan.org/address/' + wallet?.address}>Check my attestations</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
