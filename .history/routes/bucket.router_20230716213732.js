const router = require("express").Router();

router.post('/createBucket',async (req,res)=>{
    try {
        
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


module.exports = router;