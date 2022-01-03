"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const CustomError_1 = require("./CustomError");
/*
 *
 */
class RequestValidationError extends CustomError_1.CustomError {
    constructor(errors) {
        super("RequestValidationError");
        this.errors = errors;
        this.statusCode = 400;
        // Only because we are extending a build in class.
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
