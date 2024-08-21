import { NextRequest, NextResponse } from 'next/server';

export async function GET() {

    try {
        const URL = process.env.QUARK_URL!;

        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Failed to fetch data' });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' });
    }

}