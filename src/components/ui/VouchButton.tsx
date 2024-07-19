import React from 'react';
import { Button } from './button';
import { usePrivy } from '@privy-io/react-auth';
import generateAttestation from '@/utils/generateAttestation';

function VouchButtonCustom({ recipient }: { recipient: string }) {
    const { getAccessToken } = usePrivy();

    const handleClick = async () => {
        try {
            const token = await getAccessToken();
            const power = "1";
            const endorsementType = "Social";
            const platform = "Agora City";
            const wallet = recipient;

            const result = await generateAttestation(token, power, endorsementType, platform, wallet);
            console.log('Attestation created:', result);
        } catch (error) {
            console.error('Error creating attestation:', error);
        }
    };

    return (
        <p
            className="inline-flex w-full h-full md:w-auto hover:animate-shimmer items-center justify-center rounded-md border border-primarydark bg-[linear-gradient(110deg,#468c80,45%,#fcd270,55%,#468c80)] bg-[length:200%_100%] px-6 font-medium text-accentdark transition-colors focus:outline-none focus:ring-2 focus:ring-accentdark focus:ring-offset-2 focus:ring-offset-primarydark"
            onClick={handleClick}
        >
            Vouch
        </p>
    );
}

export default VouchButtonCustom;
