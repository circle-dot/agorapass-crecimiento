import prisma from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug

    const user = await prisma.user.findUnique({
        where: { wallet: slug },
        select: {
            rankScore: true,
            avatarType: true
        },
    });
    const rankScore = user?.rankScore ?? null
    return Response.json({ rankScore })
}