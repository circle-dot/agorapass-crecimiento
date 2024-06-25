'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                // Customize Privy's appearance in your app
                appearance: {
                    theme: 'light',
                    accentColor: '#19473f',
                    logo: 'agora.png',
                    landingHeader: 'Hop into Agora City',
                },
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}