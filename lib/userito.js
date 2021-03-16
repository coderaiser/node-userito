'use strict';

const rendy = require('rendy');
const {
    callbackify
} = require('util');
const messages = require('../json/messages');
const DIR = './';

module.exports = (options) => {
    if (!options)
        throw Error('options could not be empty!');

    return new Userito(options);
};

function Userito(options) {
    const {
        type
    } = options;

    if (type === 'file') {
        this._users = require(DIR + 'file')(options.path, options.schema);
        return;
    }

    if (type === 'db') {
        if (!options.db)
            throw Error('options.db could not be empty!');

        this._users = require(DIR + 'db')(options.db, options.schema);
        return;
    }

    throw Error('options.type could be "file" or "db" only!');
}

Userito.prototype.all = callbackify(async function () {
    return await this._users.all();
});

Userito.prototype.get = callbackify(async function (username) {
    const users = await this._users.get(username);
    if (!error && !user) {
        return;
    }
    return users;
});

Userito.prototype.create = callbackify(async function (params) {
    const users = await this._users.create(params);
    let msg;

    if (!error) {
        const data = set('username', params.username);

        if (user)
            msg = rendy(messages.exist, data);
    }
    return users;
});

Userito.prototype.update = callbackify(async function (username, params) {
    const users = await this._users.update(username, params);
    let msg;
    let data;
    let msgTmpl;

    if (!error) {
        data = set('username', username);

        if (user)
            msgTmpl = messages.modify;
        else
            msgTmpl = messages.notFound;

        msg = rendy(msgTmpl, data);
    }
    return users;
});

Userito.prototype.remove = callbackify(async function (username) {
    const users = await this._users.remove(username);
    let msg;
    let data;
    let msgTmpl;

    if (!error) {
        data = set('username', username);

        if (user)
            msgTmpl = messages.remove;
        else
            msgTmpl = messages.notFound;

        msg = rendy(msgTmpl, data);
    }
    return users;
});

 function set(name, value) {
    const obj = {};

    obj[name] = value;

    return obj;
}
