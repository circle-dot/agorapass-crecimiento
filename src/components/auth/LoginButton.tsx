"use client"
import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button"

export default function LoginButton() {
    const { ready, authenticated, login } = usePrivy();
    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
        <Button disabled={disableLogin} onClick={login} variant="outline">
            Log in
        </Button>
    );
}