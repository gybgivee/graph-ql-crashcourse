import { GraphQLServer,PubSub } from 'graphql-yoga';

import { users,posts,comments } from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
const pubsub = new PubSub()
const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql',
    resolvers:{
        Query,
        Mutation,
        Subscription,
        Post,
        User,
        Comment
    },
    context:{
        pubsub,
        users,
        posts,
        comments
    }
});

server.start(() => {
    console.log('server is up and running at http://localhost:4000');
});
