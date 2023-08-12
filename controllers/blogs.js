const blogRouter = require('express').Router();
const Blog = require("../models/blog");
const User = require('../models/user')
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if(authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "")
  }
  return null
}

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
      response.json(blogs)
  })

blogRouter.post('/', async (request, response) => {
  const body = request.body;
  const decodetoken = jwt.verify(request.token, process.env.SECRET)
  if(!decodetoken.id) {
    return response.status(401).json({error: "token invalid"})
  }
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

blogRouter.delete(`/:id`, async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end();
})

blogRouter.put(`/:id`, async (request, response) => {
  const body = request.body;

  const replaceBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  await Blog.findByIdAndUpdate(request.params.id, replaceBlog, { new: true })
    response.json(replaceBlog)
})

module.exports = blogRouter;