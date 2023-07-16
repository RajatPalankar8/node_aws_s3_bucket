const db = require('../config/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bucketSchema = new Schema({
    name: {
        type: String,
        required: [true, "name can't be empty"],
        unique: true,
    },
    vol:{
        type: Number,
        required: [true, "bucket volume is required"],
    },
    availableVol:{
        type: Number
    },
    filled:[{
        type:String
    }]
},{timestamps:true});

const BucketModel = db.model('bucket',bucketSchema);
module.exports = BucketModel;