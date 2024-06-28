"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import { useLogin, usePrivy } from '@privy-io/react-auth';

export default function LoginButton() {
    const { ready, authenticated } = usePrivy();

    const { login } = useLogin({
        onComplete: (user, isNewUser, wasAlreadyAuthenticated, loginMethod) => {
            console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod);
            console.log('isNewUser', isNewUser)
            // Any logic you'd like to execute if the user is/becomes authenticated while this
            // component is mounted
        },
        onError: (error) => {
            console.log(error);
            // Any logic you'd like to execute after a user exits the login flow or there is an error
        },
    });

    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
        <Button disabled={disableLogin} onClick={login} variant="outline">
            Log in
        </Button>
    );
}