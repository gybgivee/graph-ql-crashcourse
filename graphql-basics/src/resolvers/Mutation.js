import uuidv4 from 'uuid/v4';
import { setUsers, setPosts, setComments } from '../db';
const Mutation = {
    createUser(parent, args, context, info) {
        const { users } = context;
        const isEmailTaken = users.some((user) => user.email === args.data.email);
        if (isEmailTaken) return new Error('this email is already taken');
        const user = {
            id: uuidv4(),
            ...args.data
        }
        users.push(user);
        return user;
    },
    deleteUser(parent, args, context, info) {
        const { users, posts, comments } = context;
        const deletedUser = users.find((user) => user.id === args.id);
        if (!deletedUser) return new Error('User not found');

        const updateUsers = users.map((user) => user.id !== deletedUser.id ? user : null).filter(Boolean);
        setUsers(updateUsers);
        const updatePosts = posts.map((post) => post.user !== deletedUser.id ? post : null).filter(Boolean);
        setPosts(updatePosts);
        const updateComments = comments.map((comment) => comment.user !== deletedUser.id ? comment : null).filter(Boolean);
        setComments(updateComments);

        return deletedUser;
    },
    updateUser(parent, args, context, info) {
        const { users } = context;
        const { data } = args;
        const user = users.find(user => user.id === args.id);
        if (!user) return new Error('User not found');

        for (const key in user) {
            if (data[key] !== null && data[key] !== undefined) {
                if (key === 'email') {
                    const isEmailTaken = users.some(user => user.email === data.email);
                    if (isEmailTaken) return new Error('Email already taken');
                }
                user[key] = data[key];
            };
        }


        const updateUsers = users.map((currentUser) => currentUser.id === args.id ? user : currentUser);
        setUsers(updateUsers);

        return user;
    },
    createPost(parent, args, context, info) {
        const { users, posts, pubsub } = context;
        const userExists = users.some((user) => user.id === args.data.user);
        if (!userExists) return new Error('User not found');
        const post = {
            id: uuidv4(),
            ...args.data
        }
        if (args.data.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        }
        posts.push(post);
        return post;
    },
    deletePost(parent, args, context, info) {
        const { posts, comments, pubsub } = context;
        const deletedPost = posts.find(post => post.id === args.id);
        if (!deletedPost) return new Error('Post not found');

        const updatePosts = posts.map(post => post.id !== deletedPost.id ? post : null).filter(Boolean);
        setPosts(updatePosts);
        const updateComments = comments.map(comment => comment.post !== deletedPost.id ? comment : null).filter(Boolean);
        setComments(updateComments);

        if (deletedPost.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            })
        }
        return deletedPost;
    },
    updatePost(parent, args, context, info) {
        const { posts,pubsub} = context;
        const { id, data } = args;
        const post = posts.find(post => post.id !== id);
        if (!post) return new Error('Post not found');
        const originalPost = { ...post };

        for (const key in post) {
            if (data[key] !== null && data[key] !== undefined) {
                post[key] = data[key];
            };
        }
        const updatePosts = posts.map((currentPost) => post.id === id ? post : currentPost);
        setPosts(updatePosts);

        //published unchange
        let mutation = 'UPDATED';
        let publishData = post;

        //published change
        if (originalPost.published !== data.published
            && data.published !== undefined && data.published !== null) {
            //change from false to true
            console.log('originalPost',originalPost.published ,'data',data.published);
            if (data.published) {
                mutation = 'CREATED';
            } else {
                mutation = 'DELETED';
                publishData = originalPost;;
            }
        }
        pubsub.publish('post', {
            post: {
                mutation,
                data: publishData
            }
        })
        return post;
    },
    createComment(parent, args, context, info) {
        const { users, posts, comments, pubsub } = context;
        const userExists = users.some((user) => user.id === args.data.user);
        if (!userExists) return new Error('User not found');

        const postExists = posts.some((post) => post.id === args.data.post && post.published);
        if (!postExists) return new Error('Post not found');

        const comment = {
            id: uuidv4(),
            ...args.data
        }
        comments.push(comment);
        pubsub.publish(`comment-post${args.data.post}`, {
            comment:{
                mutation:'CREATED',
                data: comment
            }
        });
        return comment;

    },
    deleteComment(parent, args, context, info) {
        const { comments,pubsub } = context;
        const deletedComment = comments.find(comment => comment.id === args.id);
        if (!deletedComment) return new Error('Comment not found');

        const updateComments = comments.map(comment => comment.id !== args.id ? comment : null).filter(Boolean);
        setComments(updateComments);
        
        pubsub.publish(`comment-post${deletedComment.post}`,{
            comment:{
                mutation:"DELETED",
                data:deletedComment
            }
        })

        return deletedComment;

    },
    updateComment(parent, args, context, info) {
        const { comments,pubsub } = context;
        const { id, data } = args;
        const comment = comments.find(comment => comment.id !== id);
        if (!comment) return new Error('Comment not found');
        if (data.text) {
            comment.text = data.text;
        }

        const updateComments = comments.map((currentComment) => comment.id === id ? comment : currentComment);
        setComments(updateComments);
        pubsub.publish(`comment-post${comment.post}`,{
            comment:{
                mutation:"UPDATED",
                data:comment
            }
        })
        return comment;
    },
}
module.exports = Mutation;