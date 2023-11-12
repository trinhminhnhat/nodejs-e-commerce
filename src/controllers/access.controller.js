'use strict';

const { Ok, Created } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    login = async (req, res) => {
        new Ok({
            message: 'Login successfully',
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    signUp = async (req, res, next) => {
        new Created({
            message: 'Shop created successfully',
            metadata: await AccessService.signUp(req.body),
            // options: {
            //     limit: 20
            // }
        }).send(res);
    };
}

module.exports = new AccessController();
