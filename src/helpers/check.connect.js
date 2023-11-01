'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

const countConnections = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);
};

const checkOverLoad = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Example maximum number of connections base on number osf cores
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`);
        console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`);

        if (numConnections > maxConnections) {
            console.log('Connections overload detected');
        }
    }, _SECONDS); // monitor every 5s
};

module.exports = {
    countConnections,
    checkOverLoad,
};
