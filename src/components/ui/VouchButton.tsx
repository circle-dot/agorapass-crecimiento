import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import generateAttestation from '@/utils/generateAttestation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function VouchButtonCustom({ recipient }: { recipient: string }) {
    const { getAccessToken } = usePrivy();

    const handleClick = async () => {
        MySwal.fire({
            title: 'Processing...',
            text: 'Please wait while your request is being processed.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const token = await getAccessToken();
            if (!token) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Try reloading the page.',
                });
                return;
            }

            const power = "1";
            const endorsementType = "Social";
            const platform = "Agora City";
            const wallet = recipient;

            const result = await generateAttestation(token, power, endorsementType, platform, wallet);
            MySwal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Vouch created successfully.',
            });
            console.log('Vouch created:', result);
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while creating the vouch.',
            });
            console.error('Error creating vouch:', error);
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
