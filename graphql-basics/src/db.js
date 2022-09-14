let users = [
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
let posts = [
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
let comments = [
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
const setUsers = (updateUser) => {
    users = JSON.parse(JSON.stringify(updateUser));
}
const setPosts = (updatePost) => {
    posts = JSON.parse(JSON.stringify(updatePost));
}
const setComments = (updateComment) => {
    comments = JSON.parse(JSON.stringify(updateComment));
}
export {
    users,
    posts,
    comments,
    setUsers,
    setPosts,
    setComments

}
