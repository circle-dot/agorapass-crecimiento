import { NextRequest, NextResponse } from 'next/server';
import privy from '@/lib/privy';

export async function verifyPrivyToken(request: NextRequest) {
    const authorization = request.headers.get('authorization');

    if (!authorization || typeof authorization !== 'string') {
        console.error('Authorization header is missing or invalid');
        return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
    }

    try {
        const verifiedClaims = await privy.verifyAuthToken(authorization);
        return verifiedClaims;
    } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
    }
}
