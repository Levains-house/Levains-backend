import {CustomError} from "ts-custom-error";

export class NotEnoughRequestDataError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}

export class InvalidFieldTypeError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}