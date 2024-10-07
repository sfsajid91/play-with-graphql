import { createPost, getPosts } from '@/service/post.service';
import { createUser, loginUser } from '@/service/user.service';
import type { UserType } from '@/utils/userSchema';
import type { User } from '@prisma/client';

type Context = {
    user: User | null;
};

export const resolvers = {
    Query: {
        me: async (_: unknown, __: unknown, { user }: Context) => user,
        posts: async (_: unknown, __: unknown, { user }: Context) => {
            if (!user) throw new Error('Authentication required');
            return await getPosts(user.id);
        },
    },
    Mutation: {
        signup: async (_: unknown, { email, name, password }: UserType) => {
            return await createUser({ email, name, password });
        },
        login: (
            _: unknown,
            { email, password }: { email: string; password: string }
        ) => {
            return loginUser(email, password);
        },
        createPost: async (
            _: unknown,
            { title, content }: { title: string; content: string },
            { user }: Context
        ) => {
            if (!user) throw new Error('Authentication required');
            return await createPost(title, content, user.id);
        },
    },
};
