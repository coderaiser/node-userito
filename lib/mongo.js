import mongoose from 'mongoose';

const {Schema} = mongoose;

export const createMongo = (url, schema) => {
    if (!url)
        throw Error('url could not be empty!');
    
    return Mongo(url, schema);
};

function Mongo(url, schema) {
    if (!(this instanceof Mongo))
        return new Mongo(url, schema);
    
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

Mongo.prototype.all = async function() {
    return await this._user.find();
};

Mongo.prototype.get = async function(username) {
    return await this._user.findOne({
        username,
    });
};

Mongo.prototype.create = async function(data) {
    const User = this._user;
    
    const item = await User.findOne({
        username: data.username,
    });
    
    if (item)
        return item;
    
    const user = new User(data);
    
    return await user.save(user);
};

Mongo.prototype.update = async function(username, data) {
    return this._user.findOneAndUpdate({
        username,
    }, data);
};

Mongo.prototype.remove = async function(username) {
    return await this._user.findOneAndRemove({
        username,
    });
};
