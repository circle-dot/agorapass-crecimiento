import { NextRequest, NextResponse } from 'next/server';
import { EAS } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const attester = searchParams.get('attester');
    if (!attester) {
        return NextResponse.json({ error: 'Attester is required' }, { status: 400 });
    }

    const easContractAddress = "0x21d8d4eE83b80bc0Cc0f2B7df3117Cf212d02901";
    const eas = new EAS(easContractAddress);
    const PRIVATE_KEY = process.env.PRIVATE_KEY!;
    const ALCHEMY_URL = process.env.ALCHEMY_URL!;

    const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    await eas.connect(signer);
    const easNonce = await eas.getNonce(attester);
    // console.log('easNonce', easNonce);

    return NextResponse.json({ easNonce: easNonce.toString() });
}
