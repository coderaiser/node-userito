import {rendy} from 'rendy';
import {tryToCatch} from 'try-to-catch';
import messages from '../json/messages.json' with {
    type: 'json',
};
import {createFile} from './file.js';
import {createMongo} from './mongo.js';

export const createUserito = (options) => {
    if (!options)
        throw Error('options could not be empty!');
    
    return new Userito(options);
};

function Userito(options) {
    const {type} = options;
    
    if (type === 'file') {
        this._users = createFile(options.path, options.schema);
        return;
    }
    
    if (type === 'mongo') {
        if (!options.mongo)
            throw Error('options.db could not be empty!');
        
        this._users = createMongo(options.db, options.schema);
        
        return;
    }
    
    throw Error('options.type could be "file" or "mongo" only!');
}

Userito.prototype.all = async function() {
    return await this._users.all();
};

Userito.prototype.get = async function(username) {
    const {get} = this._users;
    let [error, user] = await tryToCatch(get, username);
    
    if (!error && !user) {
        error = Error(rendy(messages.notFound, {
            username,
        }));
        throw error;
    }
    
    return user;
};

Userito.prototype.create = async function(params) {
    const user = await this._users.create(params);
    const data = set('username', params.username);
    
    if (user)
        return rendy(messages.exist, data);
};

Userito.prototype.update = async function(username, params) {
    const [user] = await this._users.update(username, params);
    let msgTmpl;
    
    const data = set('username', username);
    
    if (user)
        msgTmpl = messages.modify;
    else
        msgTmpl = messages.notFound;
    
    return rendy(msgTmpl, data);
};

Userito.prototype.remove = async function(username) {
    const user = await this._users.remove(username);
    let msgTmpl;
    
    const data = set('username', username);
    
    if (user)
        msgTmpl = messages.remove;
    else
        msgTmpl = messages.notFound;
    
    return rendy(msgTmpl, data);
};

function set(name, value) {
    const obj = {};
    
    obj[name] = value;
    
    return obj;
}
