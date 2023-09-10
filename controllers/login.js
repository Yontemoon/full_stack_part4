const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username })
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash) //compares password(password) put in, and the actual password(passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "invalid password or username"
        })
    }

    const userForToken = {
        user: user.username,
        id: user._id //Should this be _id or id?
    }

    const token = jwt.sign(userForToken, process.env.SECRET);

    response.status(200).send({token, username: user.username, name: user.name, _id: user._id}) //why does it not send user id?
})

module.exports = loginRouter