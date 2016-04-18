'use strict';

var rendy       = require('rendy'),
    messages    = require('../json/messages'),
    DIR         = './';

module.exports = function(options) {
    var userito;
    
    if (!options)
        throw Error('options could not be empty!');
    
    userito = Userito(options);
    
    return userito;
};

function Userito(options) {
    if (!(this instanceof Userito))
        return new Userito(options);
    
    switch(options.type) {
    case 'file':
        this._users = require(DIR + 'file')(options.path, options.schema);
        break;
    
    case 'db':
        if (!options.db)
            throw Error('options.db could not be empty!');
        
        this._users = require(DIR + 'db')(options.db, options.schema);
        break;
    
    default:
        throw Error('options.type could be "file" or "db" only!');
    }
}

Userito.prototype.all      = function(callback) {
    this._users.all(callback);
};

Userito.prototype.get      = function(username, callback) {
    this._users.get(username, function(error, user) {
        var notFoundError;
        
        if (!error && !user)
            notFoundError = {
                message: rendy(messages.notFound, {
                    username: username
                })
            };
        
        callback(error, user, notFoundError);
    });
};

Userito.prototype.create   = function(params, callback) {
    this._users.create(params, function(error, user) {
        var msg, data;
        
        if (!error) {
            data = set('username', params.username);
            
            if (user)
                msg = rendy(messages.exist, data);
        }
        
        callback(error, msg);
    });
};

Userito.prototype.update = function(username, params, callback) {
    this._users.update(username, params, function(error, user) {
        var msg, data, msgTmpl;
        
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

Userito.prototype.remove   = function(username, callback) {
    this._users.remove(username, function(error, user) {
        var msg, data, msgTmpl;
        
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
    var obj = {};
    
    obj[name] = value;
    
    return obj;
}

