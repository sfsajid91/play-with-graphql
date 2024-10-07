import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';

import jwt from 'jsonwebtoken';

export const getUser = async (token: string) => {
    if (!token) return null;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as User;
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
        });

        return user;
    } catch (error) {
        return null;
    }
};
