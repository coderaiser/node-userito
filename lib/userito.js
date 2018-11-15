'use strict';

const rendy = require('rendy');
const messages = require('../json/messages');
const DIR = './';

module.exports = (options) => {
    if (!options)
        throw Error('options could not be empty!');
    
    return new Userito(options);
};

function Userito(options) {
    const type = options.type;
    
    if (type === 'file') {
        this._users = require(DIR + 'file')(options.path, options.schema);
        return;
    }
    
    if (type === 'db') {
        if (!options.db)
            throw Error('options.db could not be empty!');
        
        this._users = require(DIR + 'db')(options.db, options.schema);
        return;
    }
    
    throw Error('options.type could be "file" or "db" only!');
}

Userito.prototype.all = function(callback) {
    this._users.all(callback);
};

Userito.prototype.get = function(username, callback) {
    this._users.get(username, (error, user) => {
        if (!error && !user)
            return callback(Error(rendy(messages.notFound, {
                username
            })));
        
        callback(error, user);
    });
};

Userito.prototype.create = function(params, callback) {
    this._users.create(params, (error, user) => {
        let msg;
        
        if (!error) {
            const data = set('username', params.username);
            
            if (user)
                msg = rendy(messages.exist, data);
        }
        
        callback(error, msg);
    });
};

Userito.prototype.update = function(username, params, callback) {
    this._users.update(username, params, (error, user) => {
        let msg, data, msgTmpl;
        
        if (!error) {
            data = set('username', username);
            
            if (user)
                msgTmpl = messages.modify;
            else
                msgTmpl = messages.notFound;
                
            msg = rendy(msgTmpl, data);
        }
        
        callback(error, msg);
    });
};

Userito.prototype.remove = function(username, callback) {
    this._users.remove(username, (error, user) => {
        let msg, data, msgTmpl;
        
        if (!error) {
            data = set('username', username);
            
            if (user)
                msgTmpl = messages.remove;
            else
                msgTmpl = messages.notFound;
                
            msg = rendy(msgTmpl, data);
        }
        
        callback(error, msg);
    });
};

function set(name, value) {
    const obj = {};
    
    obj[name] = value;
    
    return obj;
}

