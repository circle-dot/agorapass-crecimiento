import React from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import blockies from 'ethereum-blockies';

// Fix the types
export function getAvatar(wallet: string, avatarType: 'metamask' | 'blockies'): JSX.Element | string | null {
    if (avatarType === 'metamask') {
        // MetaMaskAvatar is a component, so return the JSX element
        return <MetaMaskAvatar address={wallet} size={100} className='w-full h-full' />;
    }
    if (avatarType === 'blockies') {
        // Generate a blockies avatar and return the data URL string
        const icon = blockies.create({ seed: wallet, size: 8, scale: 4 });
        return icon.toDataURL();
    }
    return null;
}
