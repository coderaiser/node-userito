(function() {
    'use strict';
    
    var os                  = require('os'),
        fs                  = require('fs'),
        readjson            = require('readjson'),
        
        env                 = process.env,
        dir                 = env.USERITO_DIR || homedir(),
        Name                = dir + '.userito.json',
        
        Format              = ['username', 'password'];
    
    module.exports.all      = function(callback) {
        readjson(Name, callback);
    };
    
    module.exports.get      = function(id, callback) {
        readjson(Name, function(error, users) {
            var user;
            
            if (!error)
                user = users.filter(function(user) {
                    return user.id === id;
                })[0];
        
            callback(error, user);
        });
    };
    
    module.exports.create   = function(params, callback) {
        readjson(Name, function(error, users) {
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
            
                fs.writeFile(Name, stringify(users), function(error) {
                    callback(error, user);
                });
            }
        });
    };
    
    module.exports.modify   = function(id, data, callback) {
        readjson(Name, function(error, users) {
            var is, n, user;
            
            if (error) {
                callback(error);
            } else {
                is  = users.some(function(item, i) {
                    var is;
                    
                    if (user) {
                        n   = i;
                        is  = user.id === id;
                    }
                    
                    return is;
                    
                });
            
                if (!is) {
                    user        = modify(data);
                    users[n]    = user;
                }
                
                fs.writeFile(Name, stringify(users), function(error) {
                    callback(error, user);
                });
            }
        });
    };
    
    module.exports.remove   = function(id, callback) {
        readjson(Name, function(error, users) {
            var is, n, user;
            
            if (error) {
                callback(error);
            } else {
                is  = users.some(function(item, i) {
                    var is;
                    
                    if (item) {
                        n       = i;
                        is      = item.id === id;
                    }
                    
                    if (is)
                        user    = item;
                    
                    return is;
                    
                });
            
                if (is)
                    users[n]    = null;
                
                fs.writeFile(Name, stringify(users), function(error) {
                    callback(error, user);
                });
            }
        });
    };
    
    function homedir() {
        var fn = os.homedir || function() {
            var HOME_WIN    = process.env.HOMEPATH,
                HOME_UNIX   = process.env.HOME,
                HOME        = (HOME_UNIX || HOME_WIN);
            
            return HOME;
        };
        
        return fn() + '/';
    }
    
    function create(id, data) {
        var user = {};
        
        Format.forEach(function(field) {
            user[field] = data[field];
        });
        
        user.id = id;
        
        return user;
    }
    
    function modify(data) {
        var user = {};
        
        Format.forEach(function(field) {
            if (data[field])
                user[field] = data[field];
        });
        
        return user;
    }
    
    function stringify(obj) {
        return JSON.stringify(obj, null, 4);
    }
    
})();
