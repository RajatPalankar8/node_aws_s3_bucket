const router = require("express").Router();
const BucketServices = require('../services/bucket.services');

router.post('/createBucket',async (req,res)=>{
    try {
        const response = await BucketServices.createBucket();

        res.json({ status: true, success: response })
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
});


router.post('/createBall',async (req,res)=>{
    try {
        
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
});

router.post('/fillBucket',async (req,res)=>{
    try {
        
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
});


module.exports = router;