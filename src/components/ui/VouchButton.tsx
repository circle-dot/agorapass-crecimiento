import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import generateAttestation from '@/utils/generateAttestation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from './button';
const MySwal = withReactContent(Swal);

interface VouchButtonCustomProps {
    recipient: string;
    className?: string;
}

const VouchButtonCustom: React.FC<VouchButtonCustomProps> = ({ recipient, className }) => {
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

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="inline-flex w-full hover:animate-shimmer items-center justify-center rounded-md border border-gray-300 bg-[linear-gradient(110deg,#ffffff,45%,#f0f0f0,55%,#ffffff)] bg-[length:200%_100%] px-6 font-medium text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
                    Vouch
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='p-0' asChild>
                        <button onClick={handleClick} className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 !bg-primarydark border-gray-100 rounded-lg shadow-inner group">
                            <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-accentdark group-hover:w-full ease"></span>
                            <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-accentdark group-hover:w-full ease"></span>
                            <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-accentdark group-hover:h-full ease"></span>
                            <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-accentdark group-hover:h-full ease"></span>
                            <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-accentdarker opacity-0 group-hover:opacity-100"></span>
                            <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">Vouch them!</span>
                        </button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default VouchButtonCustom;
