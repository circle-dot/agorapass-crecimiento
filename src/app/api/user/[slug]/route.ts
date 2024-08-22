import prisma from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug
    const LowercaseAddress = slug.toLowerCase();
    // Fetch ranking information based on the wallet address
    const ranking = await prisma.ranking.findUnique({
        where: { address: LowercaseAddress },
        select: {
            position: true,
            value: true,
        },
    });

    // Fetch user information
    const user = await prisma.user.findUnique({
        where: { wallet: slug },
        select: {
            avatarType: true,
            bio: true,
            twitter: true,
            farcaster: true,
            createdAt: true,
            name: true,
            Zupass: {
                select: {
                    groups: true,
                },
            },
            Quarkid: {
                select: {
                    issuer: true,
                    ticketType:true,
                },
            },
        },
    });

    // Combine user and ranking data
    const response = {
        user: user || null,
        ranking: ranking || null,
    };

    // Handle cases where neither user nor ranking is found
    if (!user && !ranking) {
        return new Response('User and ranking not found', { status: 404 });
    }

    return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
    });
}
