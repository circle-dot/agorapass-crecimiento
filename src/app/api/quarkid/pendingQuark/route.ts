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

export async function DELETE(request: Request) {
    // Extract the invitationId from the URL query parameters
    const searchParams = new URL(request.url).searchParams;
    const invitationId = searchParams.get('invitationId');

    if (!invitationId) {
        return NextResponse.json({ error: 'invitationId is required' }, { status: 400 });
    }

    try {
        // Perform the deletion operation
        const result = await prisma.pendingQuarkId.deleteMany({
            where: {
                invitationId: invitationId
            }
        });

        if (result.count === 0) {
            return NextResponse.json({ message: 'No records found to delete' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting record:', error);
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}