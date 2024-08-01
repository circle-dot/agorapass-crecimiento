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
            displayFarcaster: true,
            displayTwitter: true,
            createdAt: true,
            name: true
        },
    });

    if (!user) {
        return new Response('User not found', { status: 404 });
    }

    const filteredUser = (() => {
        const { displayFarcaster, displayTwitter, farcaster, twitter, ...rest } = user;

        return {
            ...rest,
            ...(displayFarcaster ? { farcaster } : {}),
            ...(displayTwitter ? { twitter } : {}),
        };
    })();

    return new Response(JSON.stringify(filteredUser), {
        headers: { 'Content-Type': 'application/json' },
    });
}
