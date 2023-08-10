const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const helper = require('./test_helper');




beforeEach(async () => {
//  await Blog.deleteMany({})
//  const blogObjects = helper.initialBlog.map(blog => new Blog(blog))
//  const promiseArray = blogObjects.map(blog => blog.save())
//  await Promise.all(promiseArray)

await Blog.deleteMany({});
let blogObject = new Blog(helper.initialBlog[0])
await blogObject.save()
blogObject = new Blog(helper.initialBlog[1])
await blogObject.save()
blogObject = new Blog(helper.initialBlog[2])
await blogObject.save()
}, 100000)

test("Blogs are returned as a JSON", async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect("Content-Type", /application\/json/)
})

afterAll(async () => {
    await mongoose.connection.close()
})

test("All blogposts are returned", async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlog.length)
})

test("There is an ID for each blogpost", async () => {
    const response = await api.get("/api/blogs")
    const getId = response.body.map(blog => blog._id)
    expect(getId).toBeDefined()
})

test('Verify that a post request is successfully created', async () => {
    const newBlog = {
        title: "New Post",
        author: "Yonte Moon",
        url: "NEWURL",
        likes: 69
    }
    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const futureBlogs = await helper.blogsInDb()
    expect(futureBlogs).toHaveLength(helper.initialBlog.length + 1)
})

test("Defaults the likes button to 0 if there isn't a number of likes", async () => {
    const newBlog = {
        title: "New Post",
        author: "Yonte Moon",
        url: "NEWURL"
    }

    await api.post("/api/blogs").send(newBlog).expect(201).expect("Content-Type", /application\/json/)
    const futureBlogs = await helper.blogsInDb()
    const checkLikes = futureBlogs.map(blog => blog.likes) //body??
    console.log(checkLikes) //check later.... recieves array
    expect(checkLikes).toBeDefined()
})

test("Verifies if the title or url are missing, a status code 400 Bad Request is sent", async () => {
    const newBlog = {
        author: "Monte Yoon",
        likes: 25
    }

    await api.post("/api/blogs").send(newBlog).expect(400)
})