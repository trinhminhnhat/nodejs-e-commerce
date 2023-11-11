'use strict';

const { Created } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        console.log(`[P]::signUp::`, req.body);

        return new Created({
            message: 'Shop created successfully',
            metadata: await AccessService.signUp(req.body),
            // options: {
            //     limit: 20
            // }
        }).send(res);
    };
}

module.exports = new AccessController();
