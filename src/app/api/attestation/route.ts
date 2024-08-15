import { NextRequest, NextResponse } from 'next/server';
import privy from '@/lib/privy';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID =
    "0xf7c2336281fec237a26aab0c82fcfedb59e9204ca7257c4e574be49cfeeb6af4";

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
            // console.log('verifiedClaims', verifiedClaims);
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
        }

        // Extract user data from request body
        const { name, email, bio, wallet } = await request.json();
        // console.log('Received data:', { name, email, bio, wallet });








        const eas = new EAS(easContractAddress);
        // Signer must be an ethers-like signer.
        const PRIVATE_KEY = process.env.PRIVATE_KEY!;
        const ALCHEMY_URL = process.env.ALCHEMY_URL!


        const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);

        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        await eas.connect(signer);
        // Initialize SchemaEncoder with the schema string
        const schemaEncoder = new SchemaEncoder(
            "string endorsementType,string platform"
        );
        const encodedData = schemaEncoder.encodeData([
            { name: "endorsementType", value: "m", type: "string" },
            { name: "platform", value: "m", type: "string" },
        ]);
        const tx = await eas.attest({
            schema: schemaUID,
            data: {
                recipient: "0xb97214755c216B482A298Aec26075dcd7bCEFB86",
                expirationTime: 0n,
                revocable: true, // Be aware that if your schema is not revocable, this MUST be false
                data: encodedData,
            },
        });
        const newAttestationUID = await tx.wait();
        // console.log("New attestation UID:", newAttestationUID);











        return NextResponse.json({ newAttestationUID });
    } catch (error) {
        console.error('Error creating attestation:', error);
        // Return error response if something goes wrong
        return NextResponse.json({ error: 'Failed to create attestation' }, { status: 500 });
    }
}
