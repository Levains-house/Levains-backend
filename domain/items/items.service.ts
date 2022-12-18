import {ItemsModel} from "./items.model";
import { v4 as uuid } from 'uuid';
import path from "path";
import fs from "fs";
import s3 from "../../config/s3.config";
import {AWSS3Error} from "./s3.error";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import {ItemRegisterRequest} from "./dto/items.register.dto";

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


    public async registerItem(itemRegisterRequest: ItemRegisterRequest) {
        await this.itemModel
            .save(itemRegisterRequest.toItem());
    }

    public async updateItemTradeStatus(itemId: bigint, tradeStatus: string){
        await this.itemModel
            .updateTradeStatusByItemId(itemId, tradeStatus);
    }

    public async uploadImageToS3(fileData: Express.Multer.File): Promise<Array<string>> {
        const filePath = path.join(__dirname, `../../uploads/${fileData.filename}`);
        const fileStream = await fs.createReadStream(filePath);
        await fileStream.on('error', (error: Error) => {
            console.log('File Error', error);
        });

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: path.basename(filePath) + path.extname(fileData.originalname),
            Body: fileStream
        };

        const result = await s3.upload(uploadParams, (error: Error, data: SendData) => {
            if (error) {
                throw new AWSS3Error(500, `파일 업로드에 실패하였습니다:${error}`);
            } else {
                console.log(`File upload successful=${data.Key}`);
            }
        }).promise();

        return [fileData.originalname + path.extname(fileData.originalname), result.Location];
    }

}