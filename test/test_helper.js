const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlog = [
    {
        title:"blogpost1",
        author:"Monte Yoon1",
        url:"....IDK1??",
        likes: 12
    },
    {
        title:"blogpost2",
        author:"Monte Yoon2",
        url:"....IDK2??",
        likes: 13
    },
    {
        title:"blogpost3",
        author:"Monte Yoon3",
        url:"....IDK3??",
        likes: 14
        },
]

const initialUser = [
    {
        username: "MonteQ",
        name: "Monte Yoon",
    },
    {
        username: "MonteQ2",
        name: "Monte Yoon",
    },
    {
        username: "MonteQ3",
        name: "Monte Yoon",
    }
]

//COMPARE WHAT IS JSON VS OBJECT LOOKS LIKE...
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlog, initialUser, blogsInDb, usersInDb
}