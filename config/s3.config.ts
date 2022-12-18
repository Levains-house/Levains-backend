import AWS from "aws-sdk";

AWS.config.update({region: "ap-northeast-2"});

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
    apiVersion: "2006-03-01"
});

export default s3;