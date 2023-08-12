const logger = require('./logger')

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
        console.log(request)
        logger.info(`Authorization successful! ${authorization}`)        
    } 
    // return null
    next()
  }
  

module.exports = {requestLogger, tokenExtractor};