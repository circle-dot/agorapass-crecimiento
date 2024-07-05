"use client";
import React, { useEffect, useState } from 'react';
import { EAS } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

const EASContractAddress = "0x4200000000000000000000000000000000000021"; // Sepolia v0.26

const attestationUID = '0x42cdb1a71c0eae5b6bae990ebf828a388b549c80dbad73b72402675af8d9caa2'; // Replace with the actual attestation UID

const fetchAttestation = async (uid: string) => {
    try {
        // Initialize the EAS SDK with the address of the EAS contract
        const eas = new EAS(EASContractAddress);

        // Set up the Infura provider
        const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);

        // Connect the EAS SDK to the provider
        //@ts-ignore there is some difference between the provider and the signer
        eas.connect(provider);

        // Fetch the attestation information
        const attestation = await eas.getAttestation(uid);
        console.log('attestation', attestation)
        return attestation;
    } catch (error) {
        console.error('Error fetching attestation:', error);
        throw error;
    }
};

const AttestationInfo = () => {
    const [attestationRecord, setAttestationRecord] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const record = await fetchAttestation(attestationUID);
                setAttestationRecord(record);
            } catch (err) {
                setError('Failed to fetch attestation');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Attestation Information</h2>
        </div>
    );
};

export default AttestationInfo;
