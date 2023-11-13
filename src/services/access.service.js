'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

const { createTokenPair } = require('../auth/authUtils');
const KeyTokenService = require('./keyToken.service');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
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
}

module.exports = AccessService;
