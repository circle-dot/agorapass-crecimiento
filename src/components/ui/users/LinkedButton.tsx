import { FC, ReactNode } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

}

const LinkedButton: FC<LinkedButtonProps> = ({
    isLinked,
    linkUrl,
    onClick,
    text,
    icon,
    className,
    // linkedText,
    linkedColor,
    username
}) => {


    return isLinked ? (
        <div>
            <Link href={linkUrl} className={`flex flex-row items-center ${linkedColor}`}>
                @{username}
                {icon}
            </Link>
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
