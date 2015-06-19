(function() {
    'use strict';
    
    var rendy       = require('rendy'),
        messages    = require('../json/messages'),
        DIR         = './',
        
        file        = require(DIR + 'file');
    
    module.exports.all      = function(callback) {
        file.all(callback);
    };
    
    module.exports.get      = function(id, callback) {
        file.get(id, function(error, user) {
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
    
    module.exports.create   = function(params, callback) {
        file.create(params, function(error, user) {
            var msg, data, existError;
            
            if (!error) {
                data = {
                    username: params.username
                };
                
                if (!user)
                    msg = rendy(messages.create, data);
                else
                    existError = rendy(messages.exist, data);
            }
            
            callback(error, msg, existError);
        });
    };
    
    module.exports.modify   = function(id, params, callback) {
        file.modify(id, params, function(error, user) {
            var msg, data, existError;
            
            if (!error) {
                data = {
                    id: id
                };
            
                if (user)
                    msg         = rendy(messages.modify, data);
                else
                    existError = rendy(messages.exist, data);
            }
            
            callback(error, msg, existError);
        });
    };
    
    module.exports.remove   = function(id, callback) {
        file.remove(id, function(error, user) {
            var msg, data, notFoundError;
            
            if (!error) {
                data = {
                    id: id
                };
                
                if (user)
                    msg             = rendy(messages.remove, data);
                else
                    notFoundError   = rendy(messages.notFound, data);
            }
            
            callback(error, msg, notFoundError);
        });
    };
    
})();
