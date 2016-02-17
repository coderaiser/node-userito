(function() {
    'use strict';
    
    var mongoose    = require('mongoose'),
        Schema      = mongoose.Schema,
        env         = process.env;
    
    module.exports  = function(url, schema) {
        if (!url)
            throw(Error('url could not be empty!'));
        
        return DB(url, schema);
    };
    
    function DB(url, schema) {
        if (!(this instanceof DB))
            return new DB(url);
        
        let userSchema;
        
        if (schema)
            userSchema = new Schema(schema);
         else
             userSchema = new Schema({
                username: String,
                password: String
            });
        
        this._user = mongoose.model('User', userSchema);
         
        mongoose.connect(url);
    }
    
    DB.prototype.all      = function(callback) {
        this._user.find(callback);
    };
    
    DB.prototype.get      = function(username, callback) {
        this._user.findOne({username: username}, callback);
    };
    
    DB.prototype.create   = function(data, callback) {
        let User = this._user;
        
        User.findOne({
            username: data.username
        }, function(error, item) {
            var user;
            
            if (error || item) {
                callback(error, item);
            } else {
                user = new User(data);
                user.save(user, callback);
            }
        });
    };
    
    DB.prototype.modify   = function(username, data, callback) {
        this._user.findOneAndUpdate({
            username: username
        }, data, callback);
    };
    
    DB.prototype.remove   = function(username, callback) {
        this._user.findOneAndRemove({username: username}, callback);
    };
    
})();
