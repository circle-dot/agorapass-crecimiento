import generateAttestation from './generateAttestation';
import { signTypedData } from '../signTypedData';
import fetchNonce from '../fetchNonce';
import { showLoadingAlert, showErrorAlert, showSuccessAlert } from '../alertUtils';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
export const handleVouch = async (
    user: any,
    wallets: any,
    getAccessToken: any,
    payload:any
) => {
    if (!user?.wallet?.address) {
        showErrorAlert('User wallet address is not defined.');
        return;
    }

    const nonce = await fetchNonce(user.wallet.address);

    if (nonce === undefined) {
        showErrorAlert('Failed to fetch nonce.');
        return;
    }

    showLoadingAlert();

    try {
        const token =getAccessToken;
        if (!token) {
            showErrorAlert('Something went wrong. Try reloading the page.');
            return;
        }

        const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '84532', 10);
        const schemaUID = process.env.SCHEMA_ID_ZUPASS || "0x29888513d12699874efdd00b930a3b1589f3c29b04775d17471c80ff5f4533c4";
        const attester = user?.wallet.address;
        const nullifier= payload.nullifier;
        const schemaEncoder = new SchemaEncoder("address attester,bytes32 nullifier,bytes32 category,bytes32 subcategory,bytes32[] subsubcategory,bytes32 app");
        const encodedData = schemaEncoder.encodeData([
            { name: "attester", value: attester, type: "address" },
            { name: "nullifier", value: "", type: "bytes32" },
            { name: "category", value: "", type: "bytes32" },
            { name: "subcategory", value: "", type: "bytes32" },
            { name: "subsubcategory", value: [], type: "bytes32[]" },
            { name: "app", value: "", type: "bytes32" }
        ]);
        
        console.log('encodedData', encodedData);
        
            console.log('encodedData',encodedData)
            

        const domain = {
            name: 'EAS',
            version: '1.2.0',
            chainId: chainId,
            verifyingContract: '0x4200000000000000000000000000000000000021'
        };

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
        };

        const value = {
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
        console.log('signature', signature)
        const resultAttestation = await generateAttestation(token, attester, signature, nullifier);

        showSuccessAlert('Zupass connected succesfully.', 'Go to profile', `/vouch/${resultAttestation.newAttestationUID}`);

    } catch (error) {
        // const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.log(error)
            showErrorAlert('An error occurred while creating the vouch.');
    }
};
