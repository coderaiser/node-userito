'use strict';

const path = require('path');
const readjson = require('readjson');
const writejson = require('writejson');
const tryCatch = require('try-catch');
const untildify = require('untildify');
const HOME = require('os').homedir();

module.exports  = (filePath, schema) => {
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

File.prototype.all = function(callback) {
    readjson(this._path, callback);
};

File.prototype.get = function(username, callback) {
    readjson(this._path, function(error, users) {
        let user;
        
        if (!error)
            user = users.filter((item) => {
                if (!item)
                    return;
                
                return item.username === username;
            })[0];
        
        callback(error, user);
    });
};

File.prototype.create = function(params, callback) {
    const schema = this._schema;
    const path = this._path;
    
    readjson(this._path, (error, users) => {
        if (error)
            return callback(error);
        
        let user;
        const is = users.some((item) => {
            let is;
            
            if (item)
                is = item.username === params.username;
            
            if (is)
                user = item;
            
            return is;
        });
        
        if (!is)
            users.push(create(params, schema));
        
        writejson(path, users, (error) => {
            callback(error, user);
        });
    });
};

File.prototype.update = function(username, data, callback) {
    const schema = this._schema;
    const path = this._path;
    
    readjson(path, (error, users) => {
        let n;
        
        if (error)
            return callback(error);
            
        const is  = users.some((user, i) => {
            n = i;
            return user.username === username;
        });
        
        if (!is)
            return callback(Error(`username "${username}" not found`));
        
        const user = users[n];
        update(user, data, schema);
        
        writejson(path, users, (error) => {
            callback(error, user);
        });
    });
};

File.prototype.remove = function(username, callback) {
    const path = this._path;
    
    readjson(path, (error, users) => {
        let n, user;
        
        if (error)
            return callback(error);
        
        const is  = users.some((item, i) => {
            let is;
            
            if (item) {
                n       = i;
                is      = item.username === username;
            }
            
            if (is)
                user    = item;
            
            return is;
            
        });
        
        if (is)
            users[n] = null;
        
        writejson(path, users, (error) => {
            callback(error, user);
        });
    });
};

function create(data, schema) {
    const user = {};
    
    Object.keys(schema).forEach((field) => {
        user[field] = data[field];
    });
    
    return user;
}

function update(user, data, schema) {
    Object.keys(schema).forEach((field) => {
        if (typeof data[field] !== 'undefined')
            user[field] = data[field];
    });
    
    return user;
}

function createFile(filePath) {
    let error = tryCatch(readjson.sync, filePath);
    
    if (error && error.code === 'ENOENT') {
        error = tryCatch(writejson.sync, filePath, []);
        
        if (error)
            throw Error(error.message);
    }
}

