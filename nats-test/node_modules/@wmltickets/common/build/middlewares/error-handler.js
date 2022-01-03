"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomError_1 = require("../errors/CustomError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError_1.CustomError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }
    else {
        console.error('[ErrorHandler] not a CustomError!!!!');
        console.error(err);
    }
    res.status(400).send({ errors: [{ message: err.message }] });
};
exports.errorHandler = errorHandler;
