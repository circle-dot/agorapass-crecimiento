export interface User {
    name: string;
    wallet: string;
    trustedBy: number;
    bio?: string;
    twitter?: string;
    farcaster?: string;
    image?: string;
    rankScore?: number;
    attestationReceived?: number;
    avatarType: "metamask" | "blockies";
}
