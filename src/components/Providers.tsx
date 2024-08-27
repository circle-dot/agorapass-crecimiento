'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import React from 'react';
import { zkSync } from 'viem/chains';
import { ApolloWrapper } from './layout/ApolloWrapper';
import QueryProvider from './layout/QueryProvider';


export default function Providers({ children }: { children: React.ReactNode }) {
    // Get the chainId from environment variables and parse it as a number
    const chainId = 324

    // Determine the defaultChain and supportedChains based on the chainId
    const defaultChain = zkSync;
    const supportedChains = [zkSync];
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                defaultChain,
                supportedChains,
                // Customize Privy's appearance in your app
                appearance: {
                    theme: 'light',
                    accentColor: '#19473f',
                    logo: '/logo.png',
                    landingHeader: 'Hop into CreciStamp',
                },
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
                loginMethods: ['email', 'wallet']
            }}
        >
            <ApolloWrapper>
                <QueryProvider >
                    {children}
                </QueryProvider>
            </ApolloWrapper>
        </PrivyProvider>
    );
}