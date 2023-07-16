const router = require('express').Router();
const fs = require('fs');
const aws = require('aws-sdk');
const path = require('path');
const multer = require("multer");
const { upload } = require('../config/multerConfig')
const UploadModel = require('../model/uploads.model');

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
router.get("/getAllFolderBucket", Auth.userAuthMiddleWare, async (req, res) => {
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
router.get("/getAllFilesFromParticularBucket", Auth.userAuthMiddleWare, async (req, res) => {
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
        console.log("error------->>", error);
    }
});

//Upload Files to a Bucket and store same to Mongo DB
router.post("/uploadFileInBucket", Auth.userAuthMiddleWare, upload().single("myFile"), async (req, res) => {
    console.log(req.file);
    if (req.file) {
        const filefullPath = req.file.destination + req.file.filename;
        const uploaded = new UploadModel({ userId: req.user._id, filename: req.file.filename, mimeType: req.file.mimetype, path: filefullPath });
        await uploaded.save();
        res.json({ status: true, success: "File Uploaded Successfully" });
    }
});


//get Files from a Bucket
router.get('/downloadFile/:filename/:folderName', (req, res) => {

    const { filename, folderName } = req.params;
    const filePath = `bucketFolder/${folderName}/${filename}`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);
});

// Delete Folder/Bucket only if it Empty
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
        return res.json({ status: false, success: "Directory Not Found" });
    } catch (error) {
        return res.json({ status: true, success: "Directory can't be deleted because it Not Empty" });
    }
});

// This will delete Files from a Given Bucket
router.post("/deleteFileBucket", async (req, res) => {
    const folderName = req.body.folderName;
    const fileName = req.body.fileName;
    if (!folderName) {
        return res.json({ status: false, message: "Folder Name is Mandatory" });
    }
    if (!fileName) {
        return res.json({ status: false, message: "File Name is Mandatory" });
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
        return res.json({ status: false, success: error });
    }
});


module.exports = router;