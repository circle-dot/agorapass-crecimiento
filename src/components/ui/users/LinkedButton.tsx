import { FC, ReactNode, useState } from 'react';
import Link from 'next/link';
import { Switch } from '../switch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CircleHelp } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
const MySwal = withReactContent(Swal);

interface LinkedButtonProps {
    isLinked: boolean;
    linkUrl: string;
    onClick: () => void;
    text: string;
    icon: ReactNode;
    className: string;
    linkedText: string;
    linkedColor: string;
    username?: string;
    displayColumn: string;
    isDisplayed: boolean;
}

const LinkedButton: FC<LinkedButtonProps> = ({
    isLinked,
    linkUrl,
    onClick,
    text,
    icon,
    className,
    linkedText,
    linkedColor,
    username,
    displayColumn,
    isDisplayed: initialIsDisplayed
}) => {
    const [isDisplayed, setIsDisplayed] = useState(initialIsDisplayed); // Use the initial value
    const { getAccessToken } = usePrivy();

    const handleSwitchChange = async () => {
        console.log('here')
        const token = await getAccessToken();
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${isDisplayed ? 'hide' : 'show'} your username publicly?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {
            try {
                MySwal.fire({
                    title: 'Processing...',
                    text: 'Please wait while your request is being processed.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                const response = await fetch('/api/user/linkAccount', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username,
                        displayColumn,
                        display: !isDisplayed,
                    }),
                });

                if (response.ok) {
                    setIsDisplayed(!isDisplayed);
                    MySwal.fire('Updated!', 'Your preferences have been updated.', 'success');
                } else {
                    MySwal.fire('Error!', 'Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                MySwal.fire('Error!', 'Something went wrong. Please try again.', 'error');
            }
        }
    };

    return isLinked ? (
        <div>
            <Link href={linkUrl} className={`flex flex-row items-center ${linkedColor}`}>
                {linkedText}
                {icon}
            </Link>
            <div className='flex flex-row justify-center items-center gap-x-1'>
                Display
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <CircleHelp className='h-4 w-4' />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Show it in your profile publicly</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Switch id={linkedText} checked={isDisplayed} onCheckedChange={handleSwitchChange} />
            </div>
        </div>
    ) : (
        <button
            className={`flex flex-row ${className}`}
            onClick={onClick}
            disabled={isLinked}
        >
            {text}
            {icon}
        </button>
    );
};

export default LinkedButton;
