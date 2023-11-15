'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify token::`, err);
            } else {
                console.log(`decode verify token::`, decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid request1');

    const keyStore = await findByUserId(userId);
    console.log('keyStore: ', keyStore);
    if (!keyStore) throw new NotFoundError('Not found keyStore');

    // Todo: check route handle refreshToken
    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);

            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId');

            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;

            return next();
        } catch (error) {
            throw error;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid request2');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId');

        req.keyStore = keyStore;

        return next();
    } catch (error) {
        throw error;
    }
});

const verifyToken = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = {
    createTokenPair,
    authentication,
    verifyToken,
};
