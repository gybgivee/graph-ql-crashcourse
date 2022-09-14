const User = {
    //posts => posts
    posts(parent, args, context, info) {
        const {posts} = context;
        return posts.filter((post) => post.user === parent.id);
    },
    //comments => comments
    comments(parent, args, context, info) {
        const {comments} = context;
        return comments.filter((comment) => comment.user === parent.id);
    }
}
module.exports = User;