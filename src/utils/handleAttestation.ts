import generateAttestation from './generateAttestation';
import { signTypedData } from './signTypedData';
import fetchNonce from './fetchNonce';
import { showLoadingAlert, showErrorAlert, showSuccessAlert } from './alertUtils';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

export const handleVouch = async (
    recipient: string,
    authStatus: boolean,
    user: any,
    wallets: any,
    getAccessToken: any
) => {
    if (!user?.wallet?.address) {
        showErrorAlert('User wallet address is not defined.');
        return;
    }

    if (recipient === user.wallet.address) {
        showErrorAlert("You can't vouch yourself.");
        return;
    }

    const power = "1";
    const endorsementType = "Social";
    const platform = "CreciScore";
    const nonce = await fetchNonce(user.wallet.address);

    if (nonce === undefined) {
        showErrorAlert('Failed to fetch nonce.');
        return;
    }

    showLoadingAlert();

    try {
        const token = await getAccessToken();
        if (!token) {
            showErrorAlert('Something went wrong. Try reloading the page.');
            return;
        }

        const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '84532', 10);
        const schemaUID = process.env.SCHEMA_ID || "0x5ee00c7a6606190e090ea17749ec77fe23338387c23c0643c4251380f37eebc3";
        const attester = user?.wallet.address;

        const schemaEncoder = new SchemaEncoder("uint8 power,string endorsementType,string platform");
        const encodedData = schemaEncoder.encodeData([
            { name: "power", value: "1", type: "uint8" },
            { name: "endorsementType", value: "Social", type: "string" },
            { name: "platform", value: "CreciScore", type: "string" }
        ]);

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
            recipient: recipient,
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

        const resultAttestation = await generateAttestation(token, power, endorsementType, platform, recipient, attester, signature);

        showSuccessAlert('Vouch created successfully.', 'Go to vouch', `/vouch/${resultAttestation.newAttestationUID}`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (errorMessage === '550') {
            showErrorAlert("You don't have any vouches available.");
        } else if (errorMessage === "You can't vouch yourself.") {
            showErrorAlert("You can't vouch yourself.");
        } else {
            showErrorAlert('An error occurred while creating the vouch.');
        }
    }
};
