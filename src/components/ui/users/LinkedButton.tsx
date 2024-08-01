import { FC, ReactNode } from 'react';
import Link from 'next/link';

interface LinkedButtonProps {
    isLinked: boolean;
    linkUrl: string;
    onClick: () => void;
    text: string;
    icon: ReactNode;
    className: string;
    linkedText: string;
    linkedColor: string;
}

const LinkedButton: FC<LinkedButtonProps> = ({ isLinked, linkUrl, onClick, text, icon, className, linkedText, linkedColor }) => (
    isLinked ? (
        <Link href={linkUrl} className={`flex flex-row items-center ${linkedColor}`}>
            {linkedText}
            {icon}
        </Link>
    ) : (
        <button
            className={`flex flex-row ${className}`}
            onClick={onClick}
            disabled={isLinked}
        >
            {text}
            {icon}
        </button>
    )
);

export default LinkedButton;
