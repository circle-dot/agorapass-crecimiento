"use client";
import React, { useEffect, useState } from 'react';
import { EAS } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

const attestationUID = '0xff08bbf3d3e6e0992fc70ab9b9370416be59e87897c3d42b20549901d2cccc3e'; // Replace with the actual attestation UID

const fetchAttestation = async (uid: string) => {
    try {
        // Initialize the EAS SDK with the address of the EAS contract
        const eas = new EAS(EASContractAddress);

        // Set up the Infura provider
        const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);

        // Connect the EAS SDK to the provider
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
