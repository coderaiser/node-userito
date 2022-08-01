#!/usr/bin/env node

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const info = require('../package');
const db = process.env.USERITO_DB;

const userito = require('..')({
    type: db ? 'db' : 'file',
    db,
});
const app = express();

const PORT = process.env.USERITO_PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true,
}));

app.get('/', (req, res) => {
    res.send({
        name: info.name,
        version: info.version,
        api: {
            'GET /users': 'get all users',
            'GET /user/:username': 'get user with :username',
            'PUT /user/:username': 'modify user with :username',
            'POST /user': 'create user',
            'DELETE /user': 'remove user',
        },
    });
});

app.get('/users', (req, res) => {
    userito.all(send(res));
});

app.get('/user/:username', (req, res) => {
    const {username} = req.params;
    userito.get(username, send(res));
});

app.put('/user/:username', (req, res) => {
    const {username} = req.params;
    userito.modify(username, req.body, send(res));
});

app.post('/user', (req, res) => {
    userito.create(req.body, send(res));
});

app.delete('/user/:username', (req, res) => {
    const {username} = req.params;
    userito.remove(username, send(res));
});

app.use('*', (req, res) => {
    res
        .status(500)
        .json({
            message: 'api not defined',
        });
});

function send(res) {
    return (error, data, appError) => {
        if (data)
            res.send(data);
        else if (error)
            res
                .status(500)
                .send(error);
        else
            res
                .status(400)
                .send(appError);
    };
}

const server = app.listen(PORT, () => {
    const host = server.address().address;
    const {port} = server.address();
    
    console.log('%s v%s listening at http://%s:%s', info.name, info.version, host, port);
});
    
