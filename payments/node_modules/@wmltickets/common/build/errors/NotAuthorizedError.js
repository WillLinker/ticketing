"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
const CustomError_1 = require("./CustomError");
/*
 *
 */
class NotAuthorizedError extends CustomError_1.CustomError {
    constructor() {
        super("Not Authorized");
        this.statusCode = 401;
        // Only because we are extending a build in class.
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: "Not Authorized" }];
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
