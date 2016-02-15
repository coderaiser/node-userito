(function() {
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
            this._users = require(DIR + 'file');
            break;
        
        case 'db':
            if (!options.db)
                throw Error('options.db could not be empty!');
            
            this._users = require(DIR + 'db')(options.db, options.scheme);
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
                
                if (!user)
                    msg = rendy(messages.create, data);
            }
            
            callback(error, msg);
        });
    };
    
    Userito.prototype.modify   = function(username, params, callback) {
        this._users.modify(username, params, function(error, user) {
            var msg, data, existError;
            
            if (!error) {
                data = set('username', username);
                
                if (user)
                    msg = rendy(messages.modify, data);
                else
                    existError = rendy(messages.exist, data);
            }
            
            callback(error, msg, existError);
        });
    };
    
    Userito.prototype.remove   = function(username, callback) {
        this._users.remove(username, function(error, user) {
            var msg, data, notFoundError;
            
            if (!error) {
                data = set('username', username);
                
                if (user)
                    msg = rendy(messages.remove, data);
                else
                    notFoundError = rendy(messages.notFound, data);
            }
            
            callback(error, msg, notFoundError);
        });
    };
    
    function set(name, value) {
        var obj = {};
        
        obj[name] = value;
        
        return obj;
    }
    
})();
