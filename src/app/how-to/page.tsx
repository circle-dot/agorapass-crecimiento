'use client';

import React, { useState } from 'react';
import OrbitingCirclesDemo from '@/components/ui/sections/orbiting-circles';
import HyperText from '@/components/ui/sections/HyperText';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import ConnectQuarkId from '@/components/ui/ConnectQuarkId';
import { useFetchUserProfile } from '@/hooks/useFetchUser';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { Wallet } from 'lucide-react';
import ShinyButton from '@/components/ui/ShinyButton';

function Page() {
    const { ready, authenticated, user, login } = usePrivy();
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const { data, isLoading, error } = useFetchUserProfile(updateTrigger);
    const quarkidUser = data?.Quarkid;

    return (
        <div className="flex flex-col items-center w-full p-6">
            <HyperText
                className="text-4xl font-bold text-gray-900 mb-8"
                text="Get started with"
            />
            <OrbitingCirclesDemo />

            <div className="mt-12 w-full max-w-lg">
                <h1 className="text-2xl font-semibold text-gray-800">1. Sign in</h1>
                <div className="mt-6">
                    {!ready ? (
                        <p className="text-lg text-gray-600">Loading...</p>
                    ) : authenticated ? (
                        <div className="flex flex-col items-center">
                            <p className="text-2xl text-green-600">Already logged in!</p>
                        </div>
                    ) : (
                        <p className="flex items-center justify-center gap-x-2 text-lg text-gray-700 whitespace-nowrap">
                        Use the wallet <Wallet className="h-6 w-6 text-blue-500" /> icon in the top navbar to log in
                    </p>
                    
                    )}
                </div>
            </div>

            <div className="mt-12 w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-800">2. Connect your QuarkId</h2>
                <div className="mt-6 flex items-center justify-center">
                    {quarkidUser ? (
                        <div className="text-lg text-green-600">QuarkId connected 🎉</div>
                    ) : (
                        <Dialog>
                            <DialogTrigger asChild>
                                <ConnectQuarkId />
                            </DialogTrigger>
                        </Dialog>
                    )}
                </div>
            </div>

            <div className="my-12">
                <Link href='/profiles'>
                    <ShinyButton className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600">
                        3. Start vouching!
                    </ShinyButton>
                </Link>
            </div>
        </div>
    );
}

export default Page;
