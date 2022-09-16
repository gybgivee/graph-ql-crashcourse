const Subscription = {
    comment:{
        subscribe(parent, {postId}, context, info){
            const {posts,pubsub} = context;
            const post = posts.find(post => post.id === postId && post.published);
            if(!post) return new Error('Post not found');

            return pubsub.asyncIterator(`comment-post${postId}`);
        }
    },
    post:{
        subscribe(parent,args, context, info){
            const {pubsub} = context;
          
            return pubsub.asyncIterator('post');
        }
    }


}
module.exports = Subscription;