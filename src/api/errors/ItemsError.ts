import {CustomError} from "ts-custom-error";

export class ItemsNotFoundError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}