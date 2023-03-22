const db = require('../config/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserModel = require("./user.model")

const uploadSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: UserModel.modelName
    },
    filename:{
        type: String
    },
    mimeType:{
        type: String
    },
    path:{
        type:String
    }
},{timestamps:true});

const UploadModel = db.model('uploads',uploadSchema);
module.exports = UploadModel;