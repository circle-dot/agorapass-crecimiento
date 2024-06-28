// api/createUser.ts
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import privy from '@/lib/privy';

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
        console.log('verifiedClaims', verifiedClaims);
        // Extract user data from request body
        const { name, email, bio, wallet } = await request.json();
        console.log('Received data:', { name, email, bio, wallet });

        const id = verifiedClaims.userId
        const userEmail = email?.address || ''
        const walletAddress = wallet.address
        console.log(walletAddress)
        console.log(wallet)
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this Id already exists' }, { status: 400 });
        }

        // Create a new user using Prisma
        const newUser = await prisma.user.create({
            data: {
                name,
                email: userEmail,
                bio,
                wallet: walletAddress,
                id
            },
        });

        // Return success response with the newly created user
        return NextResponse.json({ newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        // Return error response if something goes wrong
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
