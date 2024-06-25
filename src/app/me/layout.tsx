"use client"
import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

type Props = {
    children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
    const { ready, authenticated } = usePrivy();
    const router = useRouter();

    useEffect(() => {
        if (ready && !authenticated) {
            router.push('/');
        }
    }, [ready, authenticated, router]);

    // Return the children only if both ready and authenticated
    return ready && authenticated ? (
        <>{children}</> // Wrap children in a fragment or return directly
    ) : null; // If not authenticated or not ready, return null (or some other UI for non-authenticated state)
}
