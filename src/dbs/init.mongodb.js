'use strict';

const mongoose = require('mongoose');
const { countConnections } = require('../helpers/check.connect');
const {
    db: { host, port, name },
} = require('../configs/config.mongodb.js');
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (true) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose
            .connect(connectString, {
                maxPoolSize: 50,
                family: 4,
            })
            .then(() => {
                console.log('Connected to MongoDb');
                countConnections();
            })
            .catch((err) => console.log(`Error connecting to MongoDB ${err.message}`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
