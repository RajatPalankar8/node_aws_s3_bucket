const db = require('../config/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ballSchema = new Schema({
    name: {
        type: String,
        required: [true, "name can't be empty"],
        unique: true,
    },
    vol:{
        type: Number,
        required: [true, "ball size is required"],
    }
},{timestamps:true});

const BallModel = db.model('ball',ballSchema);
module.exports = BallModel;