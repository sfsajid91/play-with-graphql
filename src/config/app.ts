import express from 'express';

import { errors } from '@/middlewares/errors';
import { middlewares } from '@/middlewares/middlewares';
import routes from '@/routes/routes';

import { graphqlSchema } from '@/graphql';
import { resolvers } from '@/graphql/resolver';
import { getUser } from '@/utils/getToken';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const apolloServer = new ApolloServer({
    typeDefs: graphqlSchema,
    resolvers,
    formatError: (error) => {
        return {
            message: error.message,
            path: error.path,
            locations: error.locations,
        };
    },
});

export const app = express();

apolloServer.start().then(() => {
    app.use(middlewares);
    app.use(routes);
    app.use(
        '/graphql',
        expressMiddleware(apolloServer, {
            context: async ({ req }) => {
                const token = req.headers.authorization?.split(' ')[1] || '';
                const user = await getUser(token);
                return { user };
            },
        })
    );
    app.use(errors);
});
