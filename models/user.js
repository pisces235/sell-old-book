var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userChema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    fullname: { type: String },
    phonenumber: { type: String },
    adddress: { type: Array},
    orders: { type:Array },
});

userChema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
userChema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userChema);