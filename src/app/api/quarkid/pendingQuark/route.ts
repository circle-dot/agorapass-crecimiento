import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {

    const { invitationId } = await request.json();

    try {
        const existingQuarkId = await prisma.pendingQuarkId.findUnique({
            where: { invitationId }
        });

        if (existingQuarkId) {
            return NextResponse.json({ existingQuarkId });

        } else {
            return NextResponse.json({ exists: false });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to check' }, { status: 500 });
    }

}