import {ItemsModel} from "./items.model";
import { v4 as uuid } from 'uuid';
import path from "path";
import fs from "fs";
import s3 from "../../config/s3.config";
import {AWSS3Error} from "./s3.error";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;

export class ItemsService {

    private itemModel: ItemsModel;

    private static instance: ItemsService;

    public static getInstance(itemModel: ItemsModel){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new ItemsService(itemModel);
    }

    private constructor(itemModel: ItemsModel){
        this.itemModel = itemModel;
    }

    // public async uploadImageToS3(fileData: Express.Multer.File) {
    //     try {
    //         const fileContent: Buffer = fs.readFileSync(fileData.path);
    //
    //         const params: {
    //             Bucket: string;
    //             Key: string;
    //             Body: Buffer;
    //         } = {
    //             Bucket: config.bucketName,
    //             Key: fileData.originalname,
    //             Body: fileContent
    //         };
    //
    //         const result = await storage.upload(params).promise();
    //
    //         const file = new File({
    //             link: result.Location,
    //             fileName: fileData.originalname
    //         });
    //
    //         await file.save();
    //
    //         const data = {
    //             _id: file._id,
    //             link: result.Location
    //         };
    //
    //         return data;
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }

    public async uploadImageToS3(fileData: Express.Multer.File): Promise<string> {
        const filePath = path.join(__dirname, `../../uploads/${fileData.filename}`);
        const fileStream = await fs.createReadStream(filePath);
        await fileStream.on('error', (error: Error) => {
            console.log('File Error', error);
        });

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: path.basename(filePath),
            Body: fileStream
        };

        await s3.upload(uploadParams, (error: Error, data: SendData) => {
            if (error) {
                throw new AWSS3Error(500, `파일 업로드에 실패하였습니다:${error}`);
            } else {
                console.log(`File upload successful=${data.Key}`);
            }
        });

        return fileData.originalname;
    }

}