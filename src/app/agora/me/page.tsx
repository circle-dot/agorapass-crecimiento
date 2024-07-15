"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePrivy } from '@privy-io/react-auth';
import { DateTime, Duration } from "luxon";
import { motion } from "framer-motion";
import Link from "next/link";
import { useFetchUser } from '@/hooks/useFetchUser';
import { getAvatar } from "@/utils/getAvatarImg";
import { XCircle, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Page() {
  const { user } = usePrivy();
  const [remainingTime, setRemainingTime] = useState('');

  const { data, isLoading, error } = useFetchUser();


  useEffect(() => {
    if (!user || !data?.vouchReset) return;

    const vouchResetDate = DateTime.fromISO(data.vouchReset);

    const updateRemainingTime = () => {
      const now = DateTime.now();
      if (now > vouchResetDate) {
        setRemainingTime("00:00:00"); // Time has expired
        return;
      }

      const duration = vouchResetDate.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
      const days = duration.days ?? 0;
      const hours = duration.hours ?? 0;
      const minutes = duration.minutes ?? 0;
      const seconds = duration.seconds ?? 0;

      setRemainingTime(
        `${Math.floor(days * 24 + hours).toString().padStart(2, '0')}:${Math.floor(minutes).toString().padStart(2, '0')}:${Math.floor(seconds).toString().padStart(2, '0')}`
      );
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [user, data?.vouchReset]);



  if (!user) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error fetching user data</div>;
  }

  const { email, wallet, rankScore, vouchesAvailables, createdAt } = data || {};

  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';


  const vouches = [
    { attesterWallet: '0x123...abc', vouchId: '1', date: '2024-07-01T00:00:00.000Z' },
    { attesterWallet: '0x456...def', vouchId: '2', date: '2024-07-05T00:00:00.000Z' },
    { attesterWallet: '0x123...abc', vouchId: '1', date: '2024-07-01T00:00:00.000Z' },
  ];

  return (
    <div className="p-4 bg-gray-100 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
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
                  <p className="text-lg font-medium">{email}</p>
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
                  <Button variant="outline" asChild>
                    <Link href={'/agora/address/' + wallet}>Check my attestations</Link>
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        <div className="md:col-span-2">
          {/* Your new section for vouches */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Your latest vouches</h2>
            <div className="space-y-4">
              {vouches.map((vouch, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
                    <div>
                      <p className="font-semibold">You vouched for <Link href={`/agora/address/${vouch.attesterWallet}`} className="text-blue-500 hover:underline">{vouch.attesterWallet}</Link> on {new Date(vouch.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-row space-x-2">

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div>
                            <Button variant="outline" className="font-extrabold hidden md:block">...</Button>
                            <Button variant="outline" className="font-extrabold block md:hidden">Actions</Button>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Button variant="outline" className="p-2" asChild>
                              <Link href={`/agora/attestation/${vouch.vouchId}`}>
                                Check vouch
                                <CheckCircle className="text-green-500 w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Button variant="outline" className="p-2" onClick={() => {/* Add revoke vouch logic here */ }}>
                              Remove vouch
                              <XCircle className="text-red-500 w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>



                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Link href={'/agora/address/' + wallet} className="w-full flex ">
              <button className="px-4 py-2 w-full font-bold rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                Check all your vouches
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
