const app = require('./app');
const port = 3000;
app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.listen(port,()=>{
    console.log(`Server Listening on Port http://localhost:${port}`);
})


// s3.headBucket({Bucket:'rajatbuckettask2'},(err,success)=>{
//     if (err) {
//         console.log("error: ",err);
//         // The bucket does not exist or you don't have access to it
//       } else {
//         console.log(success);
//         // The bucket exists and you have access to it
//       }
// })

// s3.createBucket({
//     Bucket:'rajatbuckettask2'
// },(err,success)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(success);
// });



// s3.getObject({
//     Bucket:'rajatbuckettask2',
//     Key:'text.txt',
// }, (err, success) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(success);
// });


// s3.deleteObject({
//     Bucket:'rajatbuckettask2',
//     Key:'text.txt'
// },(err,success)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(success);
// })

// s3.listBuckets({},(err,success)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(success);
//     console.log(success['Buckets'][0]['Name']);
// })

// s3.listObjectsV2({
//     Bucket:'rajatbuckettask2'
// },(err,success)=>{
//     if(err){
//                 console.log(err);
//     }
//             console.log(success);
// })