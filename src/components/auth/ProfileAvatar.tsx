import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { useLogin, usePrivy } from '@privy-io/react-auth';
import createUser from '@/utils/createUser'

interface ProfileProps {
    onLogout: () => void;
}

interface LoginButtonProps {
    onLoginComplete: (user: any, isNewUser: boolean, wasAlreadyAuthenticated: boolean) => void;
}

function ProfileAvatar() {
    const { authenticated, logout, getAccessToken } = usePrivy();
    const [showProfile, setShowProfile] = useState(authenticated);

    const handleLoginComplete: LoginButtonProps['onLoginComplete'] = async (user, isNewUser, wasAlreadyAuthenticated) => {
        setShowProfile(true);
        // console.log('user', user);
        // Ensure accessToken is a string or handle null case
        let accessToken: string | null = await getAccessToken();
        if (!accessToken) {
            console.error('Access token is null or undefined');
            return;
        }
        createUser(user, accessToken)
        // console.log('wasAlreadyAuthenticated', wasAlreadyAuthenticated)
        // console.log('isNewUser', isNewUser)
    };

    const handleLogout = () => {
        setShowProfile(false);
        logout();
    };

    return showProfile ? <Profile onLogout={handleLogout} /> : <LoginButton onLoginComplete={handleLoginComplete} />;
}

function Profile({ onLogout }: ProfileProps) {
    const { user } = usePrivy();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function LoginButton({ onLoginComplete }: LoginButtonProps) {
    const { ready } = usePrivy();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { login } = useLogin({
        onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
            onLoginComplete(user, isNewUser, wasAlreadyAuthenticated);
            setIsLoggingIn(false);
        },
        onError: (error) => {
            setIsLoggingIn(false);
            console.error(error);
        },
    });

    const handleLogin = () => {
        setIsLoggingIn(true);
        login();
    };

    const disableLogin = !ready || isLoggingIn;

    return (
        <Button disabled={disableLogin} onClick={handleLogin} variant="outline">
            {isLoggingIn ? 'Logging in...' : 'Log in'}
        </Button>
    );
}

export default ProfileAvatar;
