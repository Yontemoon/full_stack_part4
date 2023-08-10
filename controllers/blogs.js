const blogRouter = require('express').Router();
const Blog = require("../models/blog");

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
      response.json(blogs)
  })

blogRouter.post('/', async (request, response) => {
  const body = request.body;

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

    // const blog = new Blog(request.body)
  if(body.title && body.url) {
    const savedBlog = await blog.save()
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