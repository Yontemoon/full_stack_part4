const logger = require('./logger');
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const requestLogger = (request, response, next) => {
    logger.info(`Method: ${request.method}`)
    logger.info(`Path: ${request.path}`)
    logger.info(`Body: ${request.body}`)
    logger.info(`-------`)
    next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization");
    if(authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "")
        // console.log(request)
        // logger.info(`Authorization successful! ${authorization}`)        
    } 
    // return null
    next()
  }

const userExtractor = (request, response, next) => {
    const token = request.token
    const decodetoken = jwt.verify(token, process.env.SECRET)
    if(!decodetoken.id) {
        return response.status(401).json({error: "token invalid"})
    } else if(!token) {
        return response.status(401).json({error: "missing token"})
    }

    next()
}
  

module.exports = {requestLogger, tokenExtractor, userExtractor};