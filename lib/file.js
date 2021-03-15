'use strict';

const path = require('path');
const {callbackify} = require('util');

const readjson = require('readjson');
const writejson = require('writejson');
const tryCatch = require('try-catch');
const untildify = require('untildify');
const HOME = require('os').homedir();

module.exports = (filePath, schema) => {
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
    
    this._path = path;
    this._schema = schema;
}

File.prototype.all = callbackify(async function() {
    return await readjson(this._path);
});

File.prototype.get = callbackify(async function(username) {
    const users = await readjson(this._path);
    
    const [user] = users.filter((item) => {
        if (!item)
            return;
        
        return item.username === username;
    });
    
    return user;
});

File.prototype.create = callbackify(async function(params) {
    const schema = this._schema;
    const path = this._path;
    
    const users = await readjson(this._path);
        
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
        
    await writejson(path, users);
    
    return user;
});

File.prototype.update = callbackify(async function(username, data) {
    const schema = this._schema;
    const path = this._path;
    
    const users = await readjson(path);
    let n;
    
    const is = users.some((user, i) => {
        n = i;
        return user.username === username;
    });
    
    if (!is)
        throw Error(`username "${username}" not found`);
        
    const user = users[n];
    update(user, data, schema);
    
    await writejson(path, users);
    
    return user;
});

File.prototype.remove = callbackify(async function(username) {
    const path = this._path;
    
    const users = await readjson(path);
    let n;
    let user;
    
    const is = users.some((item, i) => {
        let is;
        
        if (item) {
            n = i;
            is = item.username === username;
        }
        
        if (is)
            user = item;
        
        return is;
    
    });
    
    if (is)
        users[n] = null;
    
    await writejson(path, users);
    
    return user;
});

function create(data, schema) {
    const user = {};
    
    for (const field of Object.keys(schema)) {
        user[field] = data[field];
    }
    
    return user;
}

function update(user, data, schema) {
    for (const field of Object.keys(schema)) {
        if (typeof data[field] !== 'undefined')
            user[field] = data[field];
    }
    
    return user;
}

module.exports._createFile = createFile;
function createFile(filePath) {
    let [error] = tryCatch(readjson.sync, filePath);

    if (error && error.code === 'ENOENT') {
        [error] = tryCatch(writejson.sync, filePath, []);

        if (error)
            throw Error(error.message);
    }
}

