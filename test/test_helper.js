const Blog = require("../models/blog")

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

//COMPARE WHAT IS JSON VS OBJECT LOOKS LIKE...
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlog, blogsInDb
}