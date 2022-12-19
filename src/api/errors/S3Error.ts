import {CustomError} from "ts-custom-error";

export class AWSS3Error extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}