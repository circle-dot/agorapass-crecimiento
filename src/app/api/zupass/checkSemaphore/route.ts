import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {

    const { semaphoreId } = await request.json();

    try {
        const existingZupass = await prisma.zupass.findUnique({
            where: { semaphoreId }
        });

        if (existingZupass) {
            return NextResponse.json({ exists: true });

        } else {
            return NextResponse.json({ exists: false });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

}