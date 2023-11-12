'use strict';

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');

class SuccessResponse {
    constructor({ message, statusCode, metadata = {} }) {
        this.message = message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class Ok extends SuccessResponse {
    constructor({ message = ReasonPhrases.OK, statusCode = StatusCodes.OK, metadata }) {
        super({ message, statusCode, metadata });
    }
}

class Created extends SuccessResponse {
    constructor({ message = ReasonPhrases.CREATED, statusCode = StatusCodes.CREATED, metadata, options = {} }) {
        super({ message, statusCode, metadata });
        this.options = options;
    }
}

module.exports = {
    Ok,
    Created,
};
