const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    passwordHash: { //FOR SOME REASON, PUT IN "PASSWORD" INSTEAD OF PASSWORDHASH...
        type: String,
        // required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ]
})

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema);

module.exports = User