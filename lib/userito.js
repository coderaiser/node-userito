(function() {
    'use strict';
    
    var rendy       = require('rendy'),
        messages    = require('../json/messages'),
        DIR         = './';
    
    module.exports          = function(options) {
        var userito;
        
        if (!options)
            throw(Error('options could not be empty!'));
        
        userito = Userito({type: options.type});
        
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
                throw(Error('options.db could not be empty!'));
                
            this._users = require(DIR + 'db')(options.db);
            break;
        
        default:
            throw(Error('options.type could be "file" or "db" only!'));
        }
    }
    
    Userito.prototype.all      = function(callback) {
        this._users.all(callback);
    };
    
    Userito.prototype.get      = function(id, callback) {
        this._users.get(id, function(error, user) {
            var notFoundError;
            
            if (!error && !user)
                notFoundError = {
                    message: rendy(messages.notFound, {
                        id: id
                    })
                };
            
            callback(error, user, notFoundError);
        });
    };
    
    Userito.prototype.create   = function(params, callback) {
        this._users.create(params, function(error, user) {
            var msg, data, existError;
            
            if (!error) {
                data = set('username', params.username);
                
                if (!user)
                    msg = rendy(messages.create, data);
                else
                    existError = rendy(messages.exist, data);
            }
            
            callback(error, msg, existError);
        });
    };
    
    Userito.prototype.modify   = function(id, params, callback) {
        this._users.modify(id, params, function(error, user) {
            var msg, data, existError;
            
            if (!error) {
                data = set('id', id);
                
                if (user)
                    msg         = rendy(messages.modify, data);
                else
                    existError = rendy(messages.exist, data);
            }
            
            callback(error, msg, existError);
        });
    };
    
    Userito.prototype.remove   = function(id, callback) {
        this._users.remove(id, function(error, user) {
            var msg, data, notFoundError;
            
            if (!error) {
                data = set('id', id);
                
                if (user)
                    msg             = rendy(messages.remove, data);
                else
                    notFoundError   = rendy(messages.notFound, data);
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
