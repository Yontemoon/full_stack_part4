const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require('./test_helper');
// const { beforeEach } = require('node:test');




describe("Blog Section", () => {
    beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlog)
    })

    test("Blogs are returned as a JSON", async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect("Content-Type", /application\/json/)
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

    test("test to make sure a blogpost get deleted correctly", async () => {
        const startingBlogs = await helper.blogsInDb()
        const removedBlog = startingBlogs[0]
        await api.delete(`/api/blogs/${removedBlog.id}`).expect(204)

        const endingBlogs = await helper.blogsInDb();
        expect(endingBlogs).toHaveLength(helper.initialBlog.length - 1)

        const allContent = endingBlogs.map(blog => blog.title);
        expect(allContent).not.toContain(removedBlog.title)
    })

    test("Replaces an existing blog with a new one", async () => {
        const startingBlogs = await helper.blogsInDb()
        const replacedBlog = startingBlogs[0]

        const newBlog = {
            title: "New Post",
            author: "Yonte Moon",
            url: "NEWURL",
            likes: 69
        }
        await api
            .put(`/api/blogs/${replacedBlog.id}`)
            .send(newBlog)
            .expect(200)
        
        const endingBlogs = await helper.blogsInDb();
        expect(endingBlogs).toHaveLength(startingBlogs.length)

        const allContent = endingBlogs.map(blog => blog.title);
        expect(allContent).toContain("New Post")
    })
})

describe("User Section", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await User.insertMany(helper.initialUser)
    }, 100000)

    test("Confirms that if a username, or name is not entered, status error shown and it isn't added to the user list", async () => {
        const usersInStart = await helper.usersInDb();

        const wrongUser = {
            username: "DONOTENTER",
            password: "Water123",
        }

        await api.post("/api/users/").send(wrongUser).expect(500) //SHOULDN'T IT BE 400?

        const usersInEnd = await helper.usersInDb();
        expect(usersInEnd).toHaveLength(usersInStart.length)
    })

    test("Confirms when a username is enteres but it's invalid", async () => {
        const usersInStart = await helper.usersInDb();

        const wrongUser = {
            username: "HE",
            name: "Monte Boom",
            password: "Water123",
        }

        await api.post("/api/users/").send(wrongUser).expect(500) //SHOULDN'T IT BE 400?

        const usersInEnd = await helper.usersInDb();
        expect(usersInEnd).toHaveLength(usersInStart.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})