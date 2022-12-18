import {CustomError} from "ts-custom-error";

export class TokenNotFoundError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}

export class InvalidTokenError extends CustomError {

    constructor(public code: number, message: string) {
        super(message);
    }
}