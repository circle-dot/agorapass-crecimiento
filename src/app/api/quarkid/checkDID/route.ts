import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {

    const { holderDID } = await request.json();

    try {
        const existingQuarkId = await prisma.quarkid.findUnique({
            where: { holderDID }
        });

        if (existingQuarkId) {
            return NextResponse.json({ exists: true });

        } else {
            return NextResponse.json({ exists: false });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

}