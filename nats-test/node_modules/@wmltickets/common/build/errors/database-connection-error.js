"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const CustomError_1 = require("./CustomError");
class DatabaseConnectionError extends CustomError_1.CustomError {
    constructor() {
        super("DatabaseConnectionError");
        this.statusCode = 500;
        this.reason = "Error connecting to database!";
        // Only because we are extending a build in class.
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        let message = this.reason;
        return [{ message }];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
