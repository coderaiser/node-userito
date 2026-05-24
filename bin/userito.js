#!/usr/bin/env node

import process from 'node:process';
import express from 'express';
import bodyParser from 'body-parser';
import info from '../package.json' with {
    type: 'json',
};

const {USERITO_TYPE, USERITO_DB}= process.env;
import {createUserito} from '../lib/userito.js';

const userito =createUserito({
    type: USERITO_TYPE || 'file',
    db: USERITO_DB,
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

const send = (res) => (error, data, appError) => {
    if (data) {
        res.send(data);
        return;
    }
    
    if (error) {
        res
            .status(500)
            .send(error);
        return;
    }
    
    res
        .status(400)
        .send(appError);
};

const server = app.listen(PORT, () => {
    const host = server.address().address;
    const {port} = server.address();
    
    console.log('%s v%s listening at http://%s:%s', info.name, info.version, host, port);
});
