// src/utils/avatarUtils.ts

import redAvatar from '@/../../public/agora-red.png';
import noirAvatar from '@/../../public/agora-noir.png';
import regularAvatar from '@/../../public/agora.png';

export const getAvatar = (rankScore: number | null | undefined): string => {
    const score = rankScore ?? 0; // Default to 0 if rankScore is null or undefined
    if (score < 50) return redAvatar.src;
    if (score >= 100) return noirAvatar.src;
    return regularAvatar.src;
};
