import path from 'node:path';
import nodeOs from 'node:os';
import readjson from 'readjson';
import writejson from 'writejson';
import {tryCatch} from 'try-catch';
import untildify from 'untildify';

const isUndefined = (a) => typeof a === 'undefined';
const HOME = nodeOs.homedir();

export const createFile = (filePath, schema, overrides = {}) => {
    if (filePath)
        filePath = untildify(filePath);
    else
        filePath = path.join(HOME, '.userito.json');
    
    _createFile(filePath, overrides);
    
    return File(filePath, schema);
};

export function File(path, schema) {
    if (!(this instanceof File))
        return new File(path, schema);
    
    this._path = path;
    this._schema = schema;
}

File.prototype.all = async function(overrides = {}) {
    const {read = readjson} = overrides;
    return await read(this._path);
};

File.prototype.get = async function(username, overrides = {}) {
    const {read = readjson} = overrides;
    const users = await read(this._path);
    
    const [user] = users.filter((item) => {
        if (!item)
            return;
        
        return item.username === username;
    });
    
    return user;
};

File.prototype.create = async function(params, overrides = {}) {
    const {
        read = readjson,
        write = writejson,
    } = overrides;
    const schema = this._schema;
    const path = this._path;
    
    const users = await read(path);
    
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
    
    await write(path, users);
    
    return user;
};

File.prototype.update = async function(username, data, overrides = {}) {
    const {
        read = readjson,
        write = writejson,
    } = overrides;
    const schema = this._schema;
    const path = this._path;
    
    const users = await read(path);
    let n;
    
    const is = users.some((user, i) => {
        n = i;
        return user.username === username;
    });
    
    if (!is)
        throw Error(`username "${username}" not found`);
    
    const user = users[n];
    update(user, data, schema);
    
    await write(path, users);
    
    return user;
};

File.prototype.remove = async function(username, overrides = {}) {
    const {
        read = readjson,
        write = writejson,
    } = overrides;
    const path = this._path;
    
    const users = await read(path);
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
    
    await write(path, users);
    
    return user;
};

function create(data, schema) {
    const user = {};
    
    for (const field of Object.keys(schema)) {
        user[field] = data[field];
    }
    
    return user;
}

function update(user, data, schema) {
    for (const field of Object.keys(schema)) {
        if (!isUndefined(data[field]))
            user[field] = data[field];
    }
    
    return user;
}

export function _createFile(filePath, overrides = {}) {
    const {
        read = readjson.sync,
        write = writejson.sync,
    } = overrides;
    
    let [error] = tryCatch(read, filePath);
    
    if (error && error.code === 'ENOENT') {
        [error] = tryCatch(write, filePath, []);
        
        if (error)
            throw Error(error.message);
    }
}
