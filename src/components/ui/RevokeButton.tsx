import React from 'react'
import revokeAttestation from '@/utils/revokeAttestation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from './button'
import { XCircle } from 'lucide-react'
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains'
import { type Address, type Hash, createWalletClient, custom } from 'viem'
import fetchNonce from '@/utils/fetchNonce';
import 'viem/window'

const MySwal = withReactContent(Swal);

interface RevokeButtonCustomProps {
    UID: string;
    className?: string;
}

const RevokeButton: React.FC<RevokeButtonCustomProps> = ({ UID, className }) => {

    const { getAccessToken, signTypedData, user } = usePrivy();
    const { wallets } = useWallets();

    const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '84532', 10);
    const schemaUID = process.env.SCHEMA_ID || "0x5ee00c7a6606190e090ea17749ec77fe23338387c23c0643c4251380f37eebc3";

    const handleClick = async () => {
        if (!user?.wallet?.address) {
            MySwal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'User wallet address is not defined.',
            });
            return;
        }
        const token = await getAccessToken();
        if (!token) {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Try reloading the page.',
            });
            return;
        }
        const nonce = await fetchNonce(user.wallet.address);
        // console.log('nonce', nonce)
        if (nonce === undefined) {
            MySwal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch nonce.',
            });
            return;
        }

        const revoker = user.wallet.address
        let signature;

        const domain = {
            name: 'EAS',
            version: '1.2.0',
            chainId: chainId, //+ 'n', 
            verifyingContract: '0x4200000000000000000000000000000000000021'
        }
        const message = {
            revoker: revoker,
            schema: schemaUID,
            uid: UID,
            deadline: 0,
            value: 0,
            nonce: nonce
        }
        const types = {
            Revoke: [
                { name: 'schema', type: 'bytes32' },
                { name: 'uid', type: 'bytes32' },
                { name: 'value', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint64' }
            ]
        }

        const typedData = {
            domain: domain,
            primaryType: 'Revoke',
            message: message,
            types: types,
        };


        if (user.wallet.walletClientType === 'privy') {
            const wallet = wallets[0];
            await wallet.switchChain(chainId)
            const provider = await wallet.getEthereumProvider();
            const address = wallet.address;
            // console.log('Wallet address', address)
            signature = await provider.request({
                method: 'eth_signTypedData_v4',
                params: [address, JSON.stringify(typedData)],
            });
        } else {

            // console.log(wallets)
            const wallet = wallets.find(wallet => wallet.walletClientType === user.wallet!.walletClientType); // Replace 'MetaMask' with the desired wallet type
            // console.log('wallet', wallet)
            // Ensure the wallet is found
            if (!wallet) {
                throw new Error('Desired wallet not found');
            }

            // Switch chain if needed
            await wallet.switchChain(chainId);

            // Get the EIP-1193 provider
            const provider = await wallet.getEthereumProvider();

            // Get the wallet address
            const address = wallet.address;
            // console.log('Wallet address', address);

            // Determine the defaultChain and supportedChains based on the chainId
            const defaultChain = chainId === 8453 ? base : baseSepolia;

            const walletClient = createWalletClient({
                account: address as `0x${string}`,
                chain: defaultChain,
                transport: custom(provider),
            })
            // console.log('walletc', walletClient)

            // console.log('revoker', revoker)
            signature = await walletClient.signTypedData({
                domain: {
                    name: 'EAS',
                    version: '1.2.0',
                    chainId: chainId,
                    verifyingContract: '0x4200000000000000000000000000000000000021'
                },
                primaryType: 'Revoke',
                message: {
                    schema: schemaUID as `0x${string}`,
                    uid: UID as `0x${string}`,
                    deadline: 0n,
                    value: 0n,
                    nonce: nonce
                },
                types: {
                    Revoke: [
                        { name: 'schema', type: 'bytes32' },
                        { name: 'uid', type: 'bytes32' },
                        { name: 'value', type: 'uint256' },
                        { name: 'nonce', type: 'uint256' },
                        { name: 'deadline', type: 'uint64' }
                    ]
                }
            })
        }
        // console.log('signature', signature)
        const wallet = user.wallet;
        // console.log('wallet', wallet)
        // console.log('UID', UID)
        const resultAttestation = await revokeAttestation(signature, UID, token);
        console.log('Result', resultAttestation)

    }

    return (
        <Button variant="outline" className="p-2 cursor-pointer" onClick={handleClick}>
            Remove vouch
            <XCircle className="text-red-500 w-4 h-4 ml-2" />
        </Button>
    )
}

export default RevokeButton