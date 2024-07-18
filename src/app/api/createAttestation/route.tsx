import { NextRequest, NextResponse } from 'next/server';
import privy from '@/lib/privy';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import prisma from '@/lib/db';
import { toBigInt } from 'ethers';

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID = process.env.SCHEMA_ID || "0x5ee00c7a6606190e090ea17749ec77fe23338387c23c0643c4251380f37eebc3";

const eas = new EAS(easContractAddress);
// Signer must be an ethers-like signer.
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const ALCHEMY_URL = process.env.ALCHEMY_URL!


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
        const { name, email, bio, wallet } = await request.json();
        console.log('Received data:', { name, email, bio, wallet });

        const id = verifiedClaims.userId;
        const userEmail = email?.address || '';
        const walletAddress = wallet.address;

        console.log(walletAddress);
        console.log(wallet);

        const user = await prisma.user.findUnique({
            where: { id: id },
            select: { vouchesAvailables: true }
        });

        if (!user || user.vouchesAvailables <= 0) {
            return new Response('You have no vouches available.', {
                status: 550,
            })
        }

        // Encode the data using SchemaEncoder
        const schemaEncoder = new SchemaEncoder("uint8 power,string endorsementType,string platform");
        const encodedData = schemaEncoder.encodeData([
            { name: "power", value: "1", type: "uint8" },
            { name: "endorsementType", value: "social", type: "string" },
            { name: "platform", value: "agoraCity", type: "string" }
        ]);


        // Create signer
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);

        // const attester = await signer.getAddress()

        const attester = await signer.getAddress()
        // const attester = "0x55795567D4E13FCAf30515fd6E0d93f62c297557"
        console.log(attester)
        const recipient = "0xb97214755c216B482A298Aec26075dcd7bCEFB86"
        // Get delegated attestation
        const delegated = await eas.getDelegated();

        // Print values for debugging
        console.log('schemaUID:', schemaUID);
        console.log('walletAddress:', walletAddress);
        console.log('encodedData:', encodedData);
        // const nonce = await signer.getNonce();
        // console.log('nonce', nonce)
        const easnonce = await eas.getNonce(attester);
        console.log('easnonce', easnonce)

        // const easnonce = 2n
        const options =
        {
            schema: schemaUID,
            recipient: recipient,
            expirationTime: toBigInt(0), // Unix timestamp of when attestation expires (0 for no expiration)
            revocable: true,
            refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
            data: encodedData,
            deadline: toBigInt(0), // Unix timestamp of when signature expires (0 for no expiration)
            value: toBigInt(0),
            nonce: easnonce,
        }
        console.log(options)
        // Sign the delegated attestation
        const response = await delegated.signDelegatedAttestation(
            options,
            signer
        );

        // Print response for debugging
        console.log('Delegated Attestation Response:', response);

        // Create the delegated attestation
        const transaction = await eas.attestByDelegation({
            schema: schemaUID,
            data: {
                recipient: recipient,
                expirationTime: toBigInt(0), // Unix timestamp of when attestation expires (0 for no expiration)
                revocable: true,
                refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                data: encodedData
            },
            signature: response.signature,
            attester: attester,
            deadline: toBigInt(0) // Unix timestamp of when signature expires (0 for no expiration)
        });

        const newAttestationUID = await transaction.wait();

        console.log('New attestation UID:', newAttestationUID);
        console.log('Transaction receipt:', transaction.receipt);

        // Return success response with the newly created attestation UID
        return NextResponse.json({ newAttestationUID });
    } catch (error) {
        console.error('Error creating attestation:', error);
        // Return error response if something goes wrong
        return NextResponse.json({ error: 'Failed to create attestation' }, { status: 500 });
    }
}
