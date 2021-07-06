const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema({
    Email: {
        type: String,
        required: true
    },
    FullName: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: false
    },
    AccountType: {
        type: String,
        required: false
    },
    ProfileImageUrl: {
        type: String,
        required: false
    },
    Images: {
        type: Array,
        required: false
    }
})


const User = module.exports = mongoose.model("users", UserSchema);