import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import privy from '@/lib/privy';

export async function PATCH(request: NextRequest) {
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
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
        }

        const { twitter, farcaster, displayTwitter, displayFarcaster } = await request.json();

        // Prepare data to update
        const updateData: {
            twitter?: { username: string };
            farcaster?: { username: string };
            displayTwitter?: boolean;
            displayFarcaster?: boolean;
        } = {};

        if (twitter) {
            updateData.twitter = { username: twitter.username };
        }

        if (farcaster) {
            updateData.farcaster = { username: farcaster.username };
        }

        if (displayTwitter !== undefined) {
            updateData.displayTwitter = displayTwitter;
        }

        if (displayFarcaster !== undefined) {
            updateData.displayFarcaster = displayFarcaster;
        }

        const updateUser = await prisma.user.update({
            where: {
                id: verifiedClaims.userId,
            },
            data: {
                twitter: updateData.twitter?.username ?? null,
                farcaster: updateData.farcaster?.username ?? null,
                displayTwitter: updateData.displayTwitter,
                displayFarcaster: updateData.displayFarcaster,
            },
        });


        return NextResponse.json(updateUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
