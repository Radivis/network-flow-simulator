'use strict';

'use strict';

const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const { response } = require('express');

const server = express();

const paths = {
    access: 'logs/access.json',
    error: 'logs/error.json'
}

// It would be better to read out the corresponding log file of the day, otherwise data gets lost whenever the server restarts!
const logs = {
    access: [],
    error: []
}

const posts = [];

// FUNCTIONS

const getYyyymmdd = date => {
    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;

    let day = date.getDate();
    day = day < 10 ? '0' + day : day;

    return year + '-' + month + '-' + day;
}

const log = (path, str) => {
    let dateTime = new Date();
    let date = getYyyymmdd(dateTime);
    let time = dateTime.toLocaleTimeString();

    // include date into file path
    const pathParts = path.split('.');

    // Extract log type form filename
    let logType = pathParts[0].split('/')[1];
    path = `${pathParts[0]}${date}.${pathParts[1]}`;

    logs[logType].push({time, event: str});

    fs.writeFileSync(path, JSON.stringify(logs[logType]), err => {
        if (err) console.warn(err);
    });
}

// Log requested URL
server.use((req, res, next) => {
    log(paths.access, req.url)
    next();
})

// Provide html - this probably blocks the get route below!
server.use(express.static('public', {
    extensions:['html']
}));

// Needed for the server to provide data via JSON
server.use(express.json());

// ROUTES

server.post('/post', (req, res) => {
    const form = formidable({

    })

    form.parse(req, (err, fields, files) => {
        if (err) console.error(err);
        else {
            console.log(fields);

            posts.push(fields.post);
            console.log(posts);
            res.json(posts);
        }
    })
})

server.post('/deletePost', (req, res) => {
    let post = req.body.post;

    if (posts.includes(post)) {
        let postIndex = posts.indexOf(post);
        posts.splice(postIndex, 1);
        res.json({message: "Deleted!"})
    } else {
        res.json({message: "Not found!"})
    }
})

// Should actually be a GET route, but is probably blocked by "static" above!
server.get('/postarray', (req, res) => {
    // DEBUG
    console.log("Route GET /postarray hit!");
    console.log({posts: posts});

    res.json({posts: posts});
})


// Log errors
server.use((req, res, next) => {
    log(paths.error, req.url)
    next();
})




const init = () => {
    const port = process.env.PORT || 8080;
    server.listen(port, err => console.log(err || `Server running on Port ${port}`));
}

init();