import mongoose from 'mongoose';

const {Schema} = mongoose;

export default (url, schema) => {
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

DB.prototype.all = async function() {
    return await this._user.find();
};

DB.prototype.get = async function(username) {
    return await this._user.findOne({
        username,
    });
};

DB.prototype.create = async function(data) {
    const User = this._user;
    
    const item = await User.findOne({
        username: data.username,
    });
    
    if (item)
        return item;
    
    const user = new User(data);
    
    return await user.save(user);
};

DB.prototype.update = async function(username, data) {
    return this._user.findOneAndUpdate({
        username,
    }, data);
};

DB.prototype.remove = async function(username) {
    return await this._user.findOneAndRemove({
        username,
    });
};
