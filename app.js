const config = require("./utils/config");
const express = require('express');
require('express-async-errors')
const app = express();
const cors = require('cors');
const blogRouter = require('./controllers/blogs')
// middleware?
const logger = require("./utils/logger");
const mongoose = require('mongoose');

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('MongoDB connection error', error.message)
    })

app.use(cors())
// app.use(express.static('build')) USE THIS WHEN CREATING A BUILD??
app.use(express.json());
// middleware?
app.use("/api/blogs", blogRouter)

module.exports = app;