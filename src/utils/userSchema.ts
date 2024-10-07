import { z } from 'zod';

export const userSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' }),
});

export type UserType = z.infer<typeof userSchema>;
