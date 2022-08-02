'use strict';

const mongoose = require('mongoose');
const {callbackify} = require('util');
const {Schema} = mongoose;

module.exports = (url, schema) => {
    if (!url)
        throw Error('url could not be empty!');
    
    return DB(url, schema);
};

function DB(url, schema) {
    if (!(this instanceof DB))
        return new DB(url, schema);
    
    let userSchema;
    
    if (schema)
        userSchema = new Schema(schema);
    else
        userSchema = new Schema({
            username: String,
            password: String,
        });
    
    this._user = mongoose.model('User', userSchema);
    
    mongoose.connect(url);
}

DB.prototype.all = callbackify (async function() {
    return await this._user.find();
});

DB.prototype.get = callbackify(async function(username) {
    const user = await this._user.findOne({username});
    return user;
});

DB.prototype.create = callbackify(async function(data) {
    const User = this._user;
    
    const user = new User(data);
    
    user.save(user);
    return user;
});

DB.prototype.update = callbackify(async function(username, data) {
    return await this._user.findOneAndUpdate({username}, data);
});

DB.prototype.remove = callbackify(async function(username) {
    return await this._user.findOneAndRemove({username});
});
