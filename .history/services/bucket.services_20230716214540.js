const BucketModel = require('../model/bucket.model');
const BallModel = require('../model/bucket.model');

class BucketServices{

    static async createBucket(name,vol){
         const insertBucket = new BucketModel({name,vol,availableVol});
         return await insertBucket.save();
    }

    static async createBall(){
        
    }

    static async fillBucket(){
        
    }
}

module.exports = BucketServices;