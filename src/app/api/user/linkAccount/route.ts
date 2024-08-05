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

        const { twitter, farcaster } = await request.json();

        // Prepare the data to update only if the value is provided
        const updateData: {
            twitter?: string | null;
            farcaster?: string | null;
        } = {};

        if (twitter !== undefined) {
            updateData.twitter = twitter === "" ? null : twitter; // Set to null if the value is an empty string
        }

        if (farcaster !== undefined) {
            updateData.farcaster = farcaster === "" ? null : farcaster; // Set to null if the value is an empty string
        }

        // If no data to update, return an error
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
        }

        const updateUser = await prisma.user.update({
            where: { id: verifiedClaims.userId },
            data: updateData,
        });

        return NextResponse.json(updateUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
