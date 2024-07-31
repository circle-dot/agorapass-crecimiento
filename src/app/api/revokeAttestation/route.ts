import { NextRequest, NextResponse } from 'next/server';
import privy from '@/lib/privy';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import prisma from '@/lib/db';
import { toBigInt } from 'ethers';
import { Utils } from 'alchemy-sdk';

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID = process.env.SCHEMA_ID || "0x5ee00c7a6606190e090ea17749ec77fe23338387c23c0643c4251380f37eebc3";

const eas = new EAS(easContractAddress);
// Signer must be an ethers-like signer.
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const ALCHEMY_URL = process.env.ALCHEMY_URL!;

const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
await eas.connect(signer);

export async function POST(request: NextRequest) {
    try {
        // Verify Privy token
        const authorization = request.headers.get('authorization');

        if (!authorization || typeof authorization !== 'string') {
            console.error('Authorization header is missing or invalid');
            return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
        }

        let verifiedClaims;
        try {
            verifiedClaims = await privy.verifyAuthToken(authorization);
            console.log('verifiedClaims', verifiedClaims);
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
        }

        // Extract user data from request body
        const { signature, uid } = await request.json();

        const id = verifiedClaims.userId;
        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                vouchesAvailables: true,
                wallet: true
            }
        });

        if (!user) {
            return new Response('User not found', {
                status: 400,
            });
        }

        const walletAddress = user.wallet;
        console.log(walletAddress);



        let flatSig = signature
        console.log('Signature', flatSig)
        let expandedSig = Utils.splitSignature(flatSig);
        console.log('expandedSig', expandedSig)
        console.log('schemaUID', schemaUID)
        console.log('uid', uid)
        console.log('revokeer', walletAddress)


        const transaction2 = await eas.revoke({
            schema: schemaUID,
            data: {
                uid: uid,
            }
        });
        console.log(transaction2)

        const transaction = await eas.revokeByDelegation({
            schema: schemaUID,
            data: {
                uid: uid,
            },
            signature: expandedSig,
            revoker: walletAddress,
            deadline: 0n // Unix timestamp of when signature expires (0 for no expiration)
        });

        // Optional: Wait for transaction to be validated
        const newAttestationUID = await transaction.wait();
        // Update user's vouchesAvailables
        // await prisma.user.update({
        //     where: { id: id },
        //     data: { vouchesAvailables: { decrement: 1 } },
        // });

        console.log('New attestation UID:', newAttestationUID);
        // console.log('Transaction receipt:', transaction.receipt);

        // Return success response with the newly created attestation UID
        return NextResponse.json({ newAttestationUID });
    } catch (error) {
        console.error('Error revoking attestation:', error);
        // Return error response if something goes wrong
        return NextResponse.json({ error: 'Failed to revoke attestation' }, { status: 500 });
    }
}
