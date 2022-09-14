const  Comment = {
    user(parent, args, context, info) {
        const {users} = context;
        return users.find((user) => user.id === parent.user);
    },
    post(parent, args, context, info) {
        const {posts} = context;
        return posts.find((post) => {
            return post.id === parent.post
        })
    }
}
module.exports = Comment;