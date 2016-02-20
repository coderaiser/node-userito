(function() {
    'use strict';
    
    var path                = require('path'),
        readjson            = require('readjson'),
        writejson           = require('writejson'),
        tryCatch            = require('try-catch'),
        
        HOME                = require('os-homedir')(),
        env                 = process.env,
        
        Schema              = getSchema() || ['username', 'password'];
    
    function getSchema() {
        var schema,
            str = env.USERITO_SCHEMA;
        
        if (str)
            schema = str.split(',');
        
        return schema;
    }
    
    module.exports  = function(filePath, schema) {
        var file = checkFile(filePath || '.userito.json');
        
        return File(file, schema);
    };
    
    function File(filePath, schema) {
        if (!(this instanceof File))
            return new File(filePath);
        
        this._filePath = filePath;
        this._schema   = schema;
        
        console.log('connected with ' + this._filePath);
    }
    
    File.prototype.all      = function(callback) {
        readjson(this._filePath, callback);
    };
    
    File.prototype.get      = function(username, callback) {
        readjson(this._filePath, function(error, users) {
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
        readjson(this._filePath, function(error, users) {
            var is, user;
            
            if (error) {
                callback(error);
            } else {
                is = users.some(function(item) {
                    var is;
                    
                    if (item)
                        is      = item.username === params.username;
                    
                    if (is)
                         user    = item;
                    
                    return is;
                });
                
                if (!is)
                    users.push(create(users.length, params));
                
                writejson(this._filePath, users, function(error) {
                    callback(error, user);
                });
            }
        });
    };
    
    File.prototype.update = function(username, data, callback) {
        readjson(this._filePath, function(error, users) {
            var is, n, user;
            
            if (error) {
                callback(error);
            } else {
                is  = users.some(function(item, i) {
                    var is;
                    
                    if (user) {
                        n   = i;
                        is  = user.username === username;
                    }
                    
                    return is;
                });
                
                if (!is) {
                    user        = modify(data);
                    users[n]    = user;
                }
                
                writejson(this._filePath, users, function(error) {
                    callback(error, user);
                });
            }
        });
    };
    
    File.prototype.remove   = function(username, callback) {
        readjson(this._filePath, function(error, users) {
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
                
                writejson(this._filePath, users, function(error) {
                    callback(error, user);
                });
            }
        });
    };
    
    function create(id, data) {
        var user = {};
        
        Schema.forEach(function(field) {
            user[field] = data[field];
        });
        
        user.id = id;
        
        return user;
    }
    
    function modify(data) {
        var user = {};
        
        Schema.forEach(function(field) {
            if (data[field])
                user[field] = data[field];
        });
        
        return user;
    }
    
    function checkFile(filePath) {
        let error,
            file  = path.join(HOME, filePath);
        
        error = tryCatch(function() {
            readjson.sync(file);
        });
        
        if (error && error.code === 'ENOENT') {
            error = writejson.sync.try(file, {});
            if (error)
                throw Error(error.code);
            
            console.log('file not found, creating new on "' + file + '"');
        }
        
        return file;
    }
})();

