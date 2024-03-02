const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    prenom: { type: String, required: true },
    nom: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    genre: {type: String, required: true},
    dn: {type: Date, required: true},
    tel:{type :String, required:true},
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
