'use strict';

'use strict';

const express = require('express');
const fs = require('fs');

const server = express();

const basePaths = {
    access: 'logs/access.txt',
    error: 'logs/error.txt'
}

// FUNCTIONS

const getYyyymmdd = date => {
    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;

    let day = date.getDate();
    day = day < 10 ? '0' + day : day;

    return year + '-' + month + '-' + day;
}

const currentPath = (basePath) => {
    const date = getYyyymmdd(new Date());

    // include date into file path
    const pathParts = basePath.split('.');

    return `${pathParts[0]}${date}.${pathParts[1]}`;
}

const log = ({
    basePath,
    message
} = {}) => {
    const time = new Date().toLocaleTimeString();
    const path = currentPath(basePath)

    // Extract log type form filename
    const logType = basePath.split('.')[0].split('/')[1];

    fs.appendFile(path, `${time}: ${message}`, err => {
        if (err) console.warn(err);
    });
}

// Log requested URL
server.use((req, res, next) => {
    log({basePath: basePaths.access,
        message: req.url})
    next();
})

// Provide html - this probably blocks the get route below!
server.use(express.static('public', {
    extensions: ['html']
}));

// Needed for the server to provide data via JSON
server.use(express.json());

// ROUTES

// TODO: Implement the routes for data export / import later

// server.post('/simulation', (req, res) => {
//     let simulationData = req.body.data;

//     fs.writeFile(
//         `./simulations/${simulationData.simulationName}.json`,
//         JSON.stringify(simulationData),
//         err => { if (err) console.warn(err) }
//         )
// })

// Log errors
server.use((req, res, next) => {
    log({basePath: basePaths.error,
        message: req.url})
    next();
})

const init = () => {
    const port = process.env.PORT || 80;
    server.listen(port, err => console.log(err || `Server running on Port ${port}`));
}

init();