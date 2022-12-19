import {ItemsRepository} from "../repositories/ItemsRepository";
import { v4 as uuid } from 'uuid';
import path from "path";
import fs from "fs";
import S3 from "../config/S3Config";
import {AWSS3Error} from "../errors/S3Error";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import {ItemRegisterRequest} from "../controllers/requests/ItemsRegisterRequest";

export class ItemsService {

    private itemModel: ItemsRepository;

    private static instance: ItemsService;

    public static getInstance(itemModel: ItemsRepository){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new ItemsService(itemModel);
    }

    private constructor(itemModel: ItemsRepository){
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
        //로컬에 저장한 이미지 파일 읽어오기
        const fileStream = await fs.readFileSync(fileData.path);

        const fileName = `${fileData.filename}${path.extname(fileData.originalname)}`;
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: fileName,
            Body: fileStream
        };

        const result = await S3.upload(uploadParams, (error: Error, data: SendData) => {
            if (error) {
                throw new AWSS3Error(500, `파일 업로드에 실패하였습니다:${error}`);
            }
        }).promise();

        //S3에 파일을 저장했으면 로컬 파일 제거
        await fs.unlinkSync(fileData.path);

        return [fileName, result.Location];
    }

}