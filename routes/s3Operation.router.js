const router = require('express').Router();
const fs = require('fs');
const aws = require('aws-sdk');
const path = require('path');
const Auth = require('../middleWare/auth.middleware');
const multer = require("multer");
const { upload } = require('../config/multerConfig')
const UploadModel = require('../model/uploads.model');


let s3 = new aws.S3({
    region: 'us-east-2',
    accessKeyId: 'Accesskey',
    secretAccessKey: 'secretAccessKey'
});

// check if bucket exist, If not then create it.
router.post("/createBucket", (req, res) => {
    var bucketname = req.body.bucketName;
    s3.headBucket({ Bucket: bucketname }, async (err, success) => {
        if (err) {


            if (err.code == 'NotFound' || err.code == "Forbidden ") {
                await s3.createBucket({
                    Bucket: bucketname
                }, (err, success) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(success);
                });

                res.json({ status: true, message: "Bucket Created" })
            }
            console.log("error: ", err);
        } else {
            console.log(success);
            // The bucket exists and you have access to it
            res.json({ status: true, success })
        }
    })
})

//---------------------LIST OPERATION -------------------

// Get list of all S3 Buckets
router.get('/getAllBuckets', (req, res) => {
    s3.listBuckets({}, (err, success) => {
        if (err) {
            console.log(err);
            res.json({ status: false, err })
        }
        res.json({ status: true, success })
    })
})

// Get Object/Files list of from a S3 Bucket
router.get('/getAllFilesList', (req, res) => {
    s3.listObjectsV2({
        Bucket: 'rajatbuckettask2'
    }, (err, success) => {
        if (err) {
            console.log(err);
            res.json({ status: false, err })
        }
        res.json({ status: true, success })
    })
})


//---------------------PUT OPERATION ---------------------

// Upload a File in S3 Bucket
router.post("/putObject", (req, res) => {
    s3.putObject({
        Bucket: 'rajatbuckettask2',
        Key: 'folder/text3.txt',
        Body: "Hello This is S3 Bucket trial File 3"
    }, (err, success) => {
        if (err) {
            console.log(err);
            res.json({ status: false, message: err })
        }
        console.log(success);
        res.json({ status: true, success: success })
    })
});

// Upload a Image File in S3 Bucket
router.post("/uploadImagetoS3", async (req, res) => {

    const fileContent = fs.readFileSync('image.jpg');

    console.log(" image buffer data ----->>>>>>    ", fileContent);

    s3.putObject({
        Bucket: 'rajatbuckettask2',
        Key: 'folder/image22.png',
        Body: fileContent
    }, (err, success) => {
        if (err) {
            console.log(err);
            res.json({ status: false, message: err })
        }
        console.log(success);
        res.json({ status: true, success: success })
    })
});

// Upload a Video File in S3 Bucket
router.post("/uploadVideotoS3", async (req, res) => {

    const fileContent = fs.readFileSync('video.mp4');

    console.log(" image buffer data ----->>>>>>    ", fileContent);

    s3.putObject({
        Bucket: 'rajatbuckettask2',
        Key: 'folder/video.mp4',
        Body: fileContent
    }, (err, success) => {
        if (err) {
            console.log(err);
            res.json({ status: false, message: err })
        }
        console.log(success);
        res.json({ status: true, success: success })
    })
});


//---------------------DELETE OPERATION ---------------------


// Delete S3 Bucket Object by File Name if it empty
router.post("/deleteFile", async (req, res) => {

    const bucketName = req.body.bucketName;
    const fileName = req.body.fileName;

    s3.deleteObject({
        Bucket: bucketName,
        Key: fileName
    }, (err, success) => {
        if (err) {
            console.log(err);
            return res.json({ status: false, message: err })
        }
        console.log(success);
        res.json({ status: true, success: success })
    })
});

// Delete S3 Bucket if it empty
router.delete("/deleteBucket", async (req, res) => {

    const bucketName = req.body.bucketName;

    s3.deleteBucket({
        Bucket: bucketName,
    }, (err, success) => {
        if (err) {
            console.log(err);
            res.json({ status: false, message: err })
        }
        console.log(success);
        res.json({ status: true, success: success })
    })
});

//---------------------GET OPERATION  Download Files/Object ---------------------
//download file from S3 bucket
// router.get("/download/:filename", async (req, res) => {
//     const fileParams = req.params.filename;
//     let data = await s3.getObject({ Bucket: "rajatbuckettask2", Key: fileParams }).promise();
//     res.send(data.Body);
// });

module.exports = router;