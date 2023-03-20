const router = require('express').Router();
const fs = require('fs');
const aws = require('aws-sdk');
const path = require('path');
const Auth= require('../middleWare/auth.middleware')
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
router.get("/download/:filename", async (req, res) => {
    const fileParams = req.params.filename;
    let data = await s3.getObject({ Bucket: "rajatbuckettask2", Key: fileParams }).promise();
    res.send(data.Body);
});

router.post("/createFolderBucket", async (req, res) => {
    const folderName = req.body.folderName;
    if (!folderName) {
        return res.json({ status: false, message: "Folder Name is Mandatory" });
    }
    const rootFolder = "bucketFolder";
    const folderpath = `${rootFolder}/${folderName}`;
    try {
        if (fs.existsSync(rootFolder)) {
            if (!fs.existsSync(folderpath)) {
                fs.mkdirSync(folderpath);
                return res.json({ status: true, success: "Directory created" });
            }
        } else {
            fs.mkdirSync(rootFolder);
            if (!fs.existsSync(folderpath)) {
                fs.mkdirSync(folderpath);
                return res.json({ status: true, success: "Directory/Folder created" });
            }
        }
        return res.json({ status: true, success: "Directory/Folder Already Exist" });
    } catch (error) {
        console.log(error);
    }
});

router.get("/getAllFolderBucket", Auth.userAuthMiddleWare,async (req, res) => {
    //joining path of directory 
    const directoryPath = path.join('bucketFolder');
    let fileList = [];
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            fileList.push(file);
            console.log(file);
        });
        return res.json({ status: true, success: fileList });
    });
});


router.get('/downloadFile/:filename',(req,res)=>{
    const { filename } = req.params;
    const filePath = `bucketFolder/upload1/${filename}`;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const fileStream = fs.createReadStream(filePath);

     fileStream.pipe(res);
});




module.exports = router;