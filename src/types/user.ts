export interface User {
    name: string;
    walletAddress: string;
    trustedBy: number;
    bio?: string;
    twitter?: string;
    image?: string;
    rankScore?: number;
    attestationReceived?: number;
}
