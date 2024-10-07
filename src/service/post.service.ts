import { prisma } from '@/lib/prisma';

export const createPost = async (
    title: string,
    content: string,
    authorId: string
) => {
    return await prisma.post.create({
        data: { title, content, authorId },
    });
};

export const getPosts = async (userId: string) => {
    return await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
    });
};
