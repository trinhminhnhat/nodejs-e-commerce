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

    logout = async (req, res) => {
        new Ok({
            message: 'Logout successfully',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    };

    handleRefreshToken = async (req, res) => {
        new Ok({
            message: 'Get token successfully',
            metadata: await AccessService.handleRefreshToken({
                keyStore: req.keyStore,
                user: req.user,
                refreshToken: req.refreshToken,
            }),
        }).send(res);
    };
}

module.exports = new AccessController();
