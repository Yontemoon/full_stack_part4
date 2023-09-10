const config = require("./utils/config");
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware');
const logger = require("./utils/logger");
const mongoose = require('mongoose');
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")

if(process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
    .then(() => {t
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('MongoDB connection error', error.message)
    })

app.use(cors())
// app.use(express.static('build')) USE THIS WHEN CREATING A BUILD??
app.use(express.json());
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
// app.use(middleware.userExtractor)
app.use("/api/blogs", blogRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)



module.exports = app;