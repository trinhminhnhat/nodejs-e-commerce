'use strict';

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

// ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 1]));
};

// ['a', 'b'] => {a: 0, b: 0}
const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 0]));
};

const removeUndefinedObject = (object) => {
    Object.keys(object).forEach((key) => {
        if (object[key] === null || object[key] === undefined) {
            delete object[key];
        }
    });

    return object;
};

const updateNestedObjectParser = (object) => {
    const result = {};

    Object.keys(object || {}).forEach((key) => {
        if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            const response = updateNestedObjectParser(object[key]);

            Object.keys(response).forEach((childKey) => {
                result[`${key}.${childKey}`] = response[childKey];
            });
        } else {
            result[key] = object[key];
        }
    });

    return result;
};

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
};
