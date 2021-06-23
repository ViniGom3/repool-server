import { FAILURE_CODE_ERROR, FAILURE_MESSAGE, logging } from "../helpers";

export function ErrorMiddleware(error, req, res, next) {
    logging(error)
    const status = error.status || FAILURE_CODE_ERROR.SERVERERROR;
    const response = error.response || FAILURE_MESSAGE.SERVERERROR;
    res.status(status).json(response);
}