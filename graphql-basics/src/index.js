import { GraphQLServer } from 'graphql-yoga';
const users = [
    {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        age: 26
    },
    {
        id: '2',
        name: 'James',
        email: 'james@example.com',
    },
    {
        id: '3',
        name: 'Joe',
        email: 'joe@example.com',
    }
]
const posts = [
    {
        id: '1',
        title: 'Book of Contents',
        body: 'many contents',
        published: true,
        user: '1'
    },
    {
        id: '2',
        title: 'Book of kitten',
        body: 'How to train kitten',
        published: false,
        user: '2'
    }
]
const comments = [
    {
        id: '1',
        text: 'I like it',
        user: '1',
        post: '1'
    },
    {
        id: '2',
        text: "I don't like it",
        user: '1',
        post: '2'
    }
]
const typeDefs = `
    type Query {
        users(name: String):[User!]! 
        currentUser:User!
        post:Post!
        comments:[Comment!]!
        posts(query:String):[Post!]!
        greeting(name:String):String!
    }
    type Post{
        id:ID!
        title: String!
        body: String!
        published: Boolean!
        user: User!
        comments:[Comment!]
    }
    type User{
        id:ID!
        name: String!
        email: String!
        age: Int
        posts:[Post!]
        comments:[Comment!]
    }
    type Comment{
        id:ID!
        text: String!
        user: User!
        post:Post!
    }
`
const resolvers = {
    Query: {
        users(parent, args, context, info) {
            if (args.name) return users.filter(user => user.name.toLowerCase() === args.name.toLowerCase());
            return users;
        },
        posts(parent, args, context, info) {
            if (args.query) {
                const query = args.query.toLowerCase();
                return posts.filter(post => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
            }
            return posts;
        },
        currentUser() {
            return {
                id: '1',
                name: 'Mochi',
                email: 'Mochi@gmail.com',
                age: 28
            }
        },
        comments(parent, args, context, info) {
            return comments;
        },
        post() {
            return {
                id: '1',
                title: 'Book of Contents',
                body: 'many contents',
                published: true,
            }
        },
        greeting(parent, args, context, info) {
            return `Hello ${args.name || ''}`;
        }
    },
    Post: {
        user(parent, args, context, info) {
            return users.find((user) => user.id === parent.user);
        },
        comments(parent, args, context, info) {
            return comments.filter((comment) => comment.post === parent.id);
        }
    },
    //this is parent
    User: {
        //posts => posts
        posts(parent, args, context, info) {
            return posts.filter((post) => post.user === parent.id);
        },
        //comments => comments
        comments(parent, args, context, info) {
            return comments.filter((comment) => comment.user === parent.id);
        }
    },
    Comment: {
        user(parent, args, context, info) {
            return users.find((user) => user.id === parent.user);
        },
        post(parent, args, context, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}
const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('server is up and running at http://localhost:4000');
});
/*
query{
  
  comments{
    text
    user{
      id
    }
    post{
      id
    }
  }
  
  currentUser{
    id
    name
    email
    age
  }
  users{
    name
    posts{
      title
    }
    comments{
      text
    }
  }
  posts{
    id
    title,
    user{
      name
    }
    comments{
      text
    }
  }
  
  greeting(name:"Cat")
}
*/