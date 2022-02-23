import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import { schema } from './api/graphql/schema';
import { rootValue } from './api/graphql/resolvers';


const app = express();
const port = 4000;

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
}));

app.listen(port);
console.log(`App listening on port ${port}`)