import { FC, ReactNode } from 'react';

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
            <a href={linkUrl} target='_blank' className={`flex flex-row items-center ${linkedColor}`}>
                {icon}
                @{username}
            </a>
        </div>
    ) : (
        <button
            className={`flex flex-row items-center ${className}`}
            onClick={onClick}
            disabled={isLinked}
        >
            {icon}
            {text}
        </button>
    );
};

export default LinkedButton;
