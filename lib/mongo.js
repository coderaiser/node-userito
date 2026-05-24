import mongoose from 'mongoose';

export const createMongo = (url, schema, overrides = {}) => {
    if (!url)
        throw Error('url could not be empty!');
    
    return Mongo(url, schema, overrides);
};

export function Mongo(url, schema, overrides = {}) {
    const {mongoose: nm = mongoose} = overrides;
    
    if (!(this instanceof Mongo))
        return new Mongo(url, schema, overrides);
    
    const {Schema} = nm;
    let userSchema;
    
    if (schema)
        userSchema = new Schema(schema);
    else
        userSchema = new Schema({
            username: String,
            password: String,
        });
    
    this._user = nm.model('User', userSchema);
    
    nm.connect(url);
}

Mongo.prototype.all = async function(overrides = {}) {
    const {_user = this._user} = overrides;
    return await _user.find();
};

Mongo.prototype.get = async function(username, overrides = {}) {
    const {_user = this._user} = overrides;
    
    return await _user.findOne({
        username,
    });
};

Mongo.prototype.create = async function(data, overrides = {}) {
    const {_user = this._user} = overrides;
    const User = _user;
    
    const item = await User.findOne({
        username: data.username,
    });
    
    if (item)
        return item;
    
    const user = new User(data);
    
    return await user.save(user);
};

Mongo.prototype.update = async function(username, data, overrides = {}) {
    const {_user = this._user} = overrides;
    
    return _user.findOneAndUpdate({
        username,
    }, data);
};

Mongo.prototype.remove = async function(username, overrides = {}) {
    const {_user = this._user} = overrides;
    
    return await _user.findOneAndRemove({
        username,
    });
};
