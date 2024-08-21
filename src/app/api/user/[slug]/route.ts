import prisma from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    const user = await prisma.user.findUnique({
        where: { wallet: slug },
        select: {
            rankScore: true,
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
                },
            },
        },
    });

    if (!user) {
        return new Response('User not found', { status: 404 });
    }



    return new Response(JSON.stringify(user), {
        headers: { 'Content-Type': 'application/json' },
    });
}
