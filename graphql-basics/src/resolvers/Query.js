const Query = {
    users(parent, args, context, info) {
        const {users} = context;
        if (args.name) return users.filter(user => user.name.toLowerCase() === args.name.toLowerCase());
        return users;
    },
    posts(parent, args, context, info) {
        const {posts} = context;
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
        const {comments} = context;
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
}
module.exports = Query;