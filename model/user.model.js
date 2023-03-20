const db = require('../config/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "userName can't be empty"],
    },
    apiKey:{
        type: String,
        required: [true, "Access Token is required"],
    }
},{timestamps:true});

const UserModel = db.model('user',userSchema);
module.exports = UserModel;