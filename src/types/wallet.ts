export interface Wallet {
    walletClientType: string;
    switchChain: (chainId: number) => Promise<void>;
    getEthereumProvider: () => Promise<any>;
    address: string;
}