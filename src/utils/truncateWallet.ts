import { normalizeAddress } from './normalizeAddress';

export default function truncateWallet(address: string): string {
    const normalizedAddress = normalizeAddress(address);
    return `${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`;
}