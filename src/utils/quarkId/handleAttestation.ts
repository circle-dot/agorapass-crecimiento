import generateAttestation from './generateAttestation';
import { signTypedData } from '../signTypedData';
import fetchNonce from '../fetchNonce';
import { showLoadingAlert, showErrorAlert, showOnlySucessWithRedirect } from '../alertUtils';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

export const handleVouchQuarkId = async (
    user: any,
    wallets: any,
    getAccessToken: any,
    payload: any
) => {
    if (!user?.wallet?.address) {
        showErrorAlert('User wallet address is not defined.');
        return;
    }

    // Check if semaphoreId already exists using the API route
    const response = await fetch('/api/quarkid/checkDID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ holderDID: payload.holderDID }),
    });

    const result = await response.json();

    if (result.exists) {
        showErrorAlert('QuarkId already connected to another account.');
        return;
    }

    const nonce = await fetchNonce(user.wallet.address);

    if (nonce === undefined) {
        showErrorAlert('Failed to fetch nonce.');
        return;
    }
    showLoadingAlert();

    try {
        const token = getAccessToken;
        if (!token) {
            showErrorAlert('Something went wrong. Try reloading the page.');
            return;
        }

        const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '324', 10);
        const schemaUID = process.env.SCHEMA_ID_ZUPASS || "0x9075dee7661b8b445a2f0caa3fc96223b8cc2593c796c414aed93f43d022b0f9";
        const attester = user?.wallet.address;
        const nullifier = payload.proofValue;
        const ticketType = payload.ticketType;

        const schemaEncoder = new SchemaEncoder("string nullifier,bytes32 category,bytes32 subcategory,bytes32[] subsubcategory,bytes32 issuer,bytes32 credentialType,bytes32 platform");
        const encodedData = schemaEncoder.encodeData([
            { name: "nullifier", value: nullifier, type: "string" },
            { name: "category", value: ethers.encodeBytes32String('Aleph'), type: "bytes32" },
            { name: "subcategory", value: ethers.encodeBytes32String(ticketType), type: "bytes32" },
            { name: "subsubcategory", value: [ethers.encodeBytes32String('short')], type: "bytes32[]" },
            { name: "issuer", value: ethers.encodeBytes32String('Aleph'), type: "bytes32" },
            { name: "credentialType", value: ethers.encodeBytes32String('Ticket'), type: "bytes32" },
            { name: "platform", value: "QuarkId", type: "bytes32" }
        ]);


        const domain = {
            name: 'EAS',
            version: '1.3.0',
            chainId: chainId,
            verifyingContract: '0x21d8d4eE83b80bc0Cc0f2B7df3117Cf212d02901'
        };

        const types = {
            Attest: [
                { name: 'attester', type: 'address' },
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
        };

        const value = {
            attester: attester,
            schema: schemaUID,
            recipient: attester,
            expirationTime: 0,
            revocable: true,
            refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
            data: encodedData,
            deadline: 0,
            value: 0,
            nonce: nonce
        };

        const typedData = {
            types: types,
            domain: domain,
            primaryType: 'Attest',
            message: value,
        };

        const signature = await signTypedData(user, wallets, chainId, typedData);
        // console.log('signature', signature)
        const resultAttestation = await generateAttestation(token, attester, signature, nullifier, payload);

        showOnlySucessWithRedirect('QuarkId connected succesfully.', 'Go to profile', `/me`);

    } catch (error) {
        // const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.log(error)
        showErrorAlert('An error occurred while attesting to connect your QuarkId');
    }
};
