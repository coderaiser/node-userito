'use strict';

const mongoose = require('mongoose');
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

DB.prototype.all = function(callback) {
    this._user.find(callback);
};

DB.prototype.get = function(username, callback) {
    this._user.findOne({username}, callback);
};

DB.prototype.create = function(data, callback) {
    const User = this._user;
    
    User.findOne({
        username: data.username,
    }, (error, item) => {
        if (error || item)
            return callback(error, item);
        
        const user = new User(data);
        user.save(user, callback);
    });
};

DB.prototype.update = function(username, data, callback) {
    this._user.findOneAndUpdate({
        username,
    }, data, callback);
};

DB.prototype.remove = function(username, callback) {
    this._user.findOneAndRemove({username}, callback);
};

