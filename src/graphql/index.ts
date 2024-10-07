import fs from 'fs';
import gql from 'graphql-tag';
import path from 'path';

const schemaPath = path.resolve(__dirname, 'schema.gql');

export const graphqlSchema = gql(fs.readFileSync(schemaPath, 'utf8'));
