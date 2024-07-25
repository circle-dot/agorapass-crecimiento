"use client"
import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import generateAttestation from '@/utils/generateAttestation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from './button';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { base, baseSepolia } from 'viem/chains'
import { type Address, type Hash, createWalletClient, custom } from 'viem'
import 'viem/window'

const MySwal = withReactContent(Swal);

interface VouchButtonCustomProps {
    recipient: string;
    className?: string;
    authStatus: boolean;
}

const fetchNonce = async (wallet: string) => {
    // console.log('wallet!', wallet);
    const response = await fetch(`/api/getNonce?attester=${wallet}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error fetching EAS nonce');
    }

    const data = await response.json();
    // console.log('Fetched nonce data:', data);
    return data.easNonce;
};


const VouchButtonCustom: React.FC<VouchButtonCustomProps> = ({ recipient, className, authStatus }) => {

    const { getAccessToken, signTypedData, user } = usePrivy();
    const { wallets } = useWallets();
    const handleClick = async () => {
        if (!user?.wallet?.address) {
            MySwal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'User wallet address is not defined.',
            });
            return;
        }

        const power = "1";
        const endorsementType = "Social";
        const platform = "Agora Pass";
        // console.log('Recipient:', recipient);
        // console.log('test', user.wallet.address)
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


        MySwal.fire({
            title: 'Processing...',
            text: 'Please wait while your request is being processed.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const token = await getAccessToken();
            if (!token) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Try reloading the page.',
                });
                return;
            }


            const schemaUID = process.env.SCHEMA_ID || "0x5ee00c7a6606190e090ea17749ec77fe23338387c23c0643c4251380f37eebc3";
            const attester = user?.wallet.address
            // Helper function to convert a string to bytes32 (hexadecimal)
            function stringToBytes32(str: string): string {
                const hex = Buffer.from(str, 'utf8').toString('hex');
                return `0x${hex.padEnd(64, '0')}`; // Ensure it is 64 characters long (32 bytes)
            }

            // Domain for EAS contract
            const domain = {
                name: 'EAS',
                version: '1.2.0',
                chainId: 84532,
                verifyingContract: '0x4200000000000000000000000000000000000021'
            }

            // Type definitions for EAS attestation
            const types = {
                Attest: [
                    { name: 'schema', type: 'bytes32' },
                    { name: 'recipient', type: 'address' },
                    { name: 'expirationTime', type: 'uint64' },
                    { name: 'revocable', type: 'bool' },
                    { name: 'refUID', type: 'bytes32' },
                    { name: 'data', type: 'bytes' },
                    { name: 'value', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'deadline', type: 'uint64' }
                ]
            }


            const schemaEncoder = new SchemaEncoder("uint8 power,string endorsementType,string platform");

            const encodedData = schemaEncoder.encodeData([
                { name: "power", value: "1", type: "uint8" },
                { name: "endorsementType", value: "Social", type: "string" },
                { name: "platform", value: "Agora Pass", type: "string" }
            ]);
            console.log('nonce', nonce)
            // The data to sign
            const value = {
                schema: schemaUID,
                recipient: recipient,
                expirationTime: 0, // Unix timestamp of when attestation expires (0 for no expiration)
                revocable: true,
                refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                data: encodedData,
                deadline: 0, // Unix timestamp of when signature expires (0 for no expiration)
                value: 0,
                nonce: nonce
            }



            const typedData = {
                types: types,
                domain: domain,
                primaryType: 'Attest',
                message: value,
            };

            const uiConfig = {
                title: 'Sign EAS Attestation',
                description: 'Please sign this message to attest.',
                buttonText: 'Sign',
            };



            const walletClient = createWalletClient({
                chain: baseSepolia,
                transport: custom(window.ethereum!),
            })
            const [address] = await walletClient.requestAddresses()
            console.log(address)
            const account = address

            const signature = await walletClient.signTypedData({
                account,
                domain: {
                    name: 'EAS',
                    version: '1.2.0',
                    chainId: 84532,
                    verifyingContract: '0x4200000000000000000000000000000000000021'
                },
                types: {
                    Attest: [
                        { name: 'schema', type: 'bytes32' },
                        { name: 'recipient', type: 'address' },
                        { name: 'expirationTime', type: 'uint64' },
                        { name: 'revocable', type: 'bool' },
                        { name: 'refUID', type: 'bytes32' },
                        { name: 'data', type: 'bytes' },
                        { name: 'value', type: 'uint256' },
                        { name: 'nonce', type: 'uint256' },
                        { name: 'deadline', type: 'uint64' }
                    ]
                },
                primaryType: 'Attest',
                message: {
                    schema: schemaUID,
                    recipient: recipient,
                    expirationTime: 0, // Unix timestamp of when attestation expires (0 for no expiration)
                    revocable: true,
                    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    data: encodedData,
                    deadline: 0, // Unix timestamp of when signature expires (0 for no expiration)
                    value: 0,
                    nonce: nonce
                }
                ,
            })
            console.log('signature', signature)
            // const wallet = wallets[0]; // Replace this with your desired wallet
            // const provider = await wallet.getEthereumProvider();
            // const address = wallet.address;
            // // const message = 'This is the message I am signing';
            // const signature = await provider.request({
            //     method: 'eth_signTypedData_v4',
            //     params: [address, typedData],
            // });
            // console.log(signature2)
            // let signature;
            // console.log('signature1', signature);
            // if (user.wallet.walletClientType === 'privy') {
            //     signature = await signTypedData(typedData, uiConfig);
            // } else {
            //     const walletClient = createWalletClient({
            //         chain: baseSepolia,
            //         transport: custom(window.ethereum!),
            //     });
            //     const [account] = await walletClient.getAddresses()
            //     signature = await walletClient.signTypedData({
            //         // account: user.wallet.address,
            //         account,
            //         domain: {
            //             name: 'EAS',
            //             version: '1.2.0',
            //             chainId: 84532,
            //             verifyingContract: '0x4200000000000000000000000000000000000021'
            //         },
            //         primaryType: 'Attest',
            //         message: value,
            //         types: types,
            //     });
            // }
            // console.log('signature', signature);

            //         console.log('Generated Signature:', signature);

            const result = await generateAttestation(token, power, endorsementType, platform, recipient, attester, signature);

            MySwal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Vouch created successfully.',
            });
            // console.log('Vouch created:', result);
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while creating the vouch.',
            });
            console.error('Error creating vouch:', error);
        }
    };

    return (
        <>
            {authStatus && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="inline-flex w-full hover:animate-shimmer items-center justify-center rounded-md border border-gray-300 bg-[linear-gradient(110deg,#ffffff,45%,#f0f0f0,55%,#ffffff)] bg-[length:200%_100%] px-6 font-medium text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
                            Vouch
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='p-0' asChild>
                                <button
                                    // onClick={async () => {
                                    //     try {
                                    //         const signature = await signTypedData(typedData, uiConfig);
                                    //         console.log('Generated Signature:', signature);
                                    //     } catch (error) {
                                    //         console.error('Error signing typed data:', error);
                                    //     }
                                    // }}
                                    onClick={handleClick}
                                    className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 !bg-primarydark border-gray-100 rounded-lg shadow-inner group">
                                    <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-accentdark group-hover:w-full ease"></span>
                                    <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-accentdark group-hover:w-full ease"></span>
                                    <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-accentdark group-hover:h-full ease"></span>
                                    <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-accentdark group-hover:h-full ease"></span>
                                    <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-accentdarker opacity-0 group-hover:opacity-100"></span>
                                    <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">Vouch</span>
                                </button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
};

export default VouchButtonCustom;
