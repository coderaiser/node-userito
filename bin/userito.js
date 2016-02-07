#!/usr/bin/env node

(function() {
    'use strict';
    
    var express     = require('express'),
        bodyParser  = require('body-parser'),
        info        = require('../package'),
        app         = express(),
        
        DB          = process.env.USERITO_DB,
        userito     = require('..')({
            type: DB ? 'db' : 'file',
            db: DB
        }),
        
        PORT        = process.env.USERITO_PORT || 3000,
        
        server;
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.get('/', function(req, res) {
        res.send({
            name: info.name,
            version: info.version,
            api: {
                'GET /users': 'get all users',
                'GET /user/:username': 'get user with :username',
                'PUT /user/:username': 'modify user with :username',
                'POST /user': 'create user',
                'DELETE /user': 'remove user'
            }
        });
    });
    
    app.get('/users', function (req, res) {
        userito.all(send(res));
    });
    
    app.get('/user/:username', function(req, res) {
        var username = req.params.username;
        userito.get(username, send(res));
    });
    
    app.put('/user/:username', function(req, res) {
        var username = req.params.username;
        userito.modify(username, req.body, send(res));
    });
    
    app.post('/user', function(req, res) {
        userito.create(req.body, send(res));
    });
    
    app.delete('/user/:username', function(req, res) {
        var username = req.params.username;
        userito.remove(username, send(res));
    });
    
    app.use('*', function(req, res) {
        res
            .status(500)
            .json({
                message: 'api not defined'
            });
    });
    
    function send(res) {
        return function(error, data, appError) {
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
    
    server = app.listen(PORT, function () {
        var host = server.address().address;
        var port = server.address().port;
    
        console.log('%s v%s listening at http://%s:%s', info.name, info.version, host, port);
    });
    
})();
