const blogRouter = require('express').Router();
const Blog = require("../models/blog");
const User = require('../models/user')
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware")



blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
      response.json(blogs)
  })

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const decodetoken = jwt.verify(request.token, process.env.SECRET)
  
  const user = await User.findById(decodetoken.id)

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id //is it _id or id?
  })

    // const blog = new Blog(request.body)
  if(body.title && body.url) {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id) //CONFUSED HERE!!!!
    await user.save()
    response.status(201).json(savedBlog)
  } else {
    response.status(400).end();
  }
})

blogRouter.delete(`/:id`, middleware.userExtractor, async (request, response) => { 
  const blog = await Blog.findById(request.params.id)
  const decodetoken = jwt.verify(request.token, process.env.SECRET)
  console.log( `${blog.user} || ${decodetoken.id}`)
  if(blog.user.toString() === decodetoken.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end();
 } else if(blog.user.toString() !== decodetoken.id.toString()){ 
    return response.status(403).json({ error: "Unauthorized, incorrect authorization" })
 } else {
    return response.status(401).json({ error: "Authentication is required to delete" })
 }
  
})

blogRouter.put(`/:id`, middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const body = request.body;
  const decodetoken = jwt.verify(request.token, process.env.SECRET)

  
  if(blog.user.toString() === decodetoken.id.toString()) {
    const replaceBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, replaceBlog, { new: true })
    response.json(updatedBlog)
  } else {
    return response.status(403).json({ error: "Unauthorized, incorrect authorization" })
  }
})

module.exports = blogRouter;