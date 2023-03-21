const router = require('express').Router();
const fs = require('fs');
const aws = require('aws-sdk');
const path = require('path');
const Auth= require('../middleWare/auth.middleware');
const multer = require("multer");
const {upload} = require('../config/multerConfig')



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

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

// Create a Bucket 
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

// get Bucket List
router.get("/getAllFolderBucket", Auth.userAuthMiddleWare,async (req, res) => {
    //joining path of directory 
    const directoryPath = path.join('bucketFolder');
    let fileList = [];
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }
      
        const directories = files.filter(file => {
          const filePath = path.join(directoryPath, file);
          return fs.statSync(filePath).isDirectory();
        });
      
        console.log(directories);
        return res.json({ status: true, success: directories });
    });
});

// get list of all files from a Particular bucket
router.get("/getAllFilesFromParticularBucket", Auth.userAuthMiddleWare,async (req, res) => {
    try {
    const bucketName = req.body.bucketName;
    const directoryPath = path.join(`bucketFolder/${bucketName}`);
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
          return res.json({ status: false, message: `${bucketName}, No Such Bucket Found` });
        }
      
        const allfiles = files.filter(file => {
          const filePath = path.join(directoryPath, file);
          return fs.statSync(filePath).isFile();
        });
      
        console.log(allfiles);
        return res.json({ status: true, filesList: allfiles });
    });
} catch (error) {
    console.log("error------->>",error);
}
});

//Upload Files to a Bucket
router.post("/uploadFileInBucket", upload().single("myFile"), async (req, res) => {
    console.log("/uploadFile");
    // Stuff to be added later
    console.log(req.file);
  });


  //get Files from a Bucket
router.get('/downloadFile/:filename/:folderName',(req,res)=>{

    const { filename,folderName } = req.params;
    const filePath = `bucketFolder/${folderName}/${filename}`;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const fileStream = fs.createReadStream(filePath);

     fileStream.pipe(res);
});

router.post("/deleteFolderBucket", async (req, res) => {
    const folderName = req.body.folderName;
    if (!folderName) {
        return res.json({ status: false, message: "Folder Name is Mandatory" });
    }
    const rootFolder = "bucketFolder";
    const folderpath = `${rootFolder}/${folderName}`;
    try {
        if (fs.existsSync(rootFolder)) {
            if (fs.existsSync(folderpath)) {
                fs.rmdirSync(folderpath);
                return res.json({ status: true, success: "Directory Deleted" });
            }
        } 
        return res.json({ status: true, success: "Directory Not Found" });
    } catch (error) {
        return res.json({ status: true, success: "Directory can't be deleted because it Not Empty" });
    }
});

router.post("/deleteFileBucket", async (req, res) => {
    const folderName = req.body.folderName;
    const fileName = req.body.fileName;
    if (!folderName) {
        return res.json({ status: false, message: "Folder Name is Mandatory" });
    }
    if (!fileName) {
        return res.json({ status: false, message: "File ame is Mandatory" });
    }
    const rootFolder = "bucketFolder";
    const folderpath = `${rootFolder}/${folderName}/${fileName}`;
    try {
        fs.unlink(folderpath, (err) => {
            if (err) {
              console.error(err);
              return;
            }        
            console.log('File deleted successfully');
       });
        return res.json({ status: true, success: "File deleted successfully" });
    } catch (error) {
        return res.json({ status: true, success: error});
    }
});


module.exports = router;