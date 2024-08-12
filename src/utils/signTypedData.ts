import { createWalletClient, custom } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export async function signTypedData(wallet: any, typedData: any, chainId: number) {
    const provider = await wallet.getEthereumProvider();
    const address = wallet.address;
    const defaultChain = chainId === 8453 ? base : baseSepolia;

    const walletClient = createWalletClient({
        account: address as `0x${string}`,
        chain: defaultChain,
        transport: custom(provider),
    });

    return walletClient.signTypedData(typedData);
}
