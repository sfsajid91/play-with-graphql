import { prisma } from '@/lib/prisma';
import { userSchema, type UserType } from '@/utils/userSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (user: UserType) => {
    const parsedUser = userSchema.safeParse(user);

    if (!parsedUser.success) {
        throw new Error(
            parsedUser.error.flatten().fieldErrors.email?.[0] ??
                parsedUser.error.flatten().fieldErrors.name?.[0] ??
                parsedUser.error.flatten().fieldErrors.password?.[0] ??
                'Something went wrong'
        );
    }

    const { email, name, password } = parsedUser.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user
        .create({
            data: { email, name, password: hashedPassword },
        })
        .catch((error) => {
            if (error.code === 'P2002') {
                throw new Error('User already exists');
            }
            throw error;
        });

    return {
        token: signToken(newUser.id),
        user: newUser,
    };
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = signToken(user.id);
    return { token, user };
};

export const signToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!);
};
