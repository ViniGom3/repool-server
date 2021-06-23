import { FAILURE_CODE_ERROR, FAILURE_MESSAGE } from "../helpers";

export function ErrorMiddleware(error, req, res, next) {
    const status = error.status || FAILURE_CODE_ERROR.SERVERERROR;
    const response = error.response || FAILURE_MESSAGE.SERVERERROR;
    res.status(status).json(response);
}