'use strict';

const crypto = require('crypto');

const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
    // const newKey = await apiKeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permissions: ['0000'],
    // });
    // console.log('newKey: ', newKey);


    // * lean(): return raw javaScript object
    return await apiKeyModel.findOne({ key, status: true }).lean();
};

module.exports = {
    findById,
};
