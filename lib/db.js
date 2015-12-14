(function() {
    'use strict';
    
    var mongoose    = require('mongoose'),
        Schema      = mongoose.Schema,
        env         = process.env,
        
        UserSchema = new Schema({
            username: String,
            password: String,
        }),
        
        User    = mongoose.model('User', UserSchema);
        Schema  = getSchema() || ['username', 'password'];
    
    function getSchema() {
        var schema,
            str = env.USERITO_SCHEMA;
        
        if (str)
            schema = str.split(',');
        
        return schema;
    }
    
    module.exports  = function(url) {
        if (!url)
            throw(Error('url could not be empty!'));
        
        return DB(url);
    };
    
    function DB(url) {
        if (!(this instanceof DB))
            return new DB(url);
        
        mongoose.connect(url);
    }
    
    DB.prototype.all      = function(callback) {
        User.find(callback);
    };
    
    DB.prototype.get      = function(id, callback) {
        User.findOne({ id: id }, callback);
    };
    
    DB.prototype.create   = function(data, callback) {
        User.findOne({
            name: data.name
        }, function(error, item) {
            var user;
            console.log(error, item)
            if (error || item) {
                callback(error, item);
            } else {
                user = new User(data);
                user.save(user);
            }
        });
    };
    
    DB.prototype.modify   = function(id, data, callback) {
        User.findOne({
            id: id
        }, function(error, user) {
            if (error || !user) {
                callback(error, user);
            } else {
                Object.keys(data).forEach(function(name) {
                    user[name] = data[name];
                });
                
                user.save(user);
            }
        });
    };
    
    DB.prototype.remove   = function(id, callback) {
        User.findByIdAndRemove(id, callback);
    };
    
})();
