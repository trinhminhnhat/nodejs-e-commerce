'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

const { createTokenPair, verifyToken } = require('../auth/authUtils');
const KeyTokenService = require('./keyToken.service');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    Shop: 'SHOP',
    Writer: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};

class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        const shop = await findByEmail({ email });

        if (!shop) throw new BadRequestError('Shop not registered');

        const isMatchPassword = await bcrypt.compare(password, shop.password);

        if (!isMatchPassword) throw new AuthFailureError('Authentication failed');

        // Create accessToken and refreshToken
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const { _id: userId } = shop;

        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            userId,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: shop }),
            tokens,
        };
    };

    static logout = async (keyStore) => {
        return await KeyTokenService.removeKeyTokenById(keyStore._id);
    };

    static signUp = async ({ name, email, password }) => {
        // check email exists
        const holderShop = await shopModel.findOne({ email }).lean();

        if (holderShop) {
            throw new BadRequestError('Shop already registered');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.Shop],
        });

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            const { _id: userId } = newShop;
            const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

            await KeyTokenService.createKeyToken({
                userId,
                privateKey,
                publicKey,
                refreshToken: tokens.refreshToken,
            });

            return {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens,
            };
        }

        throw new BadRequestError('Error create shop');
    };

    static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            // because refreshToken has been used and use again => delete all token to reduce the risk of hacker attacks
            await KeyTokenService.deleteKeyTokenByUserId(userId);
            throw new ForbiddenError('Something wrong happened. Please login again!');
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop is not registered1');

        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Shop is not registered2');

        // create new pair token
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user,
            tokens,
        };
    };
}

module.exports = AccessService;
