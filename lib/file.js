'use strict';

var path                = require('path'),
    readjson            = require('readjson'),
    writejson           = require('writejson'),
    tryCatch            = require('try-catch'),
    untildify           = require('untildify'),
    HOME                = require('os-homedir')();

module.exports  = function(filePath, schema) {
    if (filePath)
        filePath = untildify(filePath);
    else
        filePath = path.join(HOME, '.userito.json');
    
    createFile(filePath);
    
    return File(filePath, schema);
};

function File(path, schema) {
    if (!(this instanceof File))
        return new File(path, schema);
    
    this._path      = path;
    this._schema    = schema;
}

File.prototype.all      = function(callback) {
    readjson(this._path, callback);
};

File.prototype.get      = function(username, callback) {
    readjson(this._path, function(error, users) {
        var user;
        
        if (!error)
            user = users.filter(function(item) {
                var is;
                
                if (item)
                    is = item.username === username;
                
                return is;
            })[0];
        
        callback(error, user);
    });
};

File.prototype.create   = function(params, callback) {
    var schema  = this._schema;
    var path    = this._path;
    
    readjson(this._path, function(error, users) {
        var is, user;
        
        if (error) {
            callback(error);
        } else {
            is = users.some(function(item) {
                var is;
                
                if (item)
                    is      = item.username === params.username;
                
                if (is)
                     user   = item;
                
                return is;
            });
            
            if (!is)
                users.push(create(params, schema));
            
            writejson(path, users, function(error) {
                callback(error, user);
            });
        }
    });
};

File.prototype.update = function(username, data, callback) {
    var schema = this._schema;
    var path    = this._path;
    
    readjson(this._path, function(error, users) {
        var is, n, user;
        
        if (error) {
            callback(error);
        } else {
            is  = users.some(function(user, i) {
                n = i;
                return user.username === username;
            });
            
            if (!is) {
                callback(Error(`username "${username}" not found`));
            } else {
                user = users[n];
                update(user, data, schema);
                
                writejson(path, users, function(error) {
                    callback(error, user);
                });
            }
        }
    });
};

File.prototype.remove   = function(username, callback) {
    var path = this._path;
    
    readjson(path, function(error, users) {
        var is, n, user;
        
        if (error) {
            callback(error);
        } else {
            is  = users.some(function(item, i) {
                var is;
                
                if (item) {
                    n       = i;
                    is      = item.username === username;
                }
                
                if (is)
                    user    = item;
                
                return is;
                
            });
            
            if (is)
                users[n]    = null;
            
            writejson(path, users, function(error) {
                callback(error, user);
            });
        }
    });
};

function create(data, schema) {
    var user = {};
    
    Object.keys(schema).forEach(function(field) {
        user[field] = data[field];
    });
    
    return user;
}

function update(user, data, schema) {
    Object.keys(schema).forEach(function(field) {
        if (typeof data[field] !== 'undefined')
            user[field] = data[field];
    });
    
    return user;
}

function createFile(filePath) {
    var error;
    
    error = tryCatch(function() {
        readjson.sync(filePath);
    });
    
    if (error && error.code === 'ENOENT') {
        error = tryCatch(function() {
            writejson.sync(filePath, []);
        });
        
        if (error)
            throw Error(error.message);
    }
}

