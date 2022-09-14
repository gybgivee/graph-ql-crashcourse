const Post = {
    user(parent, args, context, info) {
        const {users} = context;
        return users.find((user) => user.id === parent.user);
    },
    comments(parent, args, context, info) {
        const {comments} = context;
        return comments.filter((comment) => comment.post === parent.id);
    }
}
module.exports = Post;