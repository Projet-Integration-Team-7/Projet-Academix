const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const imagePath = path.join(__dirname, "..", "images", "default_profile_picture.jpg");
const imageBuffer = fs.readFileSync(imagePath);

const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true, trim: true },
  nom: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        // eslint-disable-next-line no-useless-escape
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(value);
      },
      message: 'Invalid email address',
    },
  },
  password: { type: String, required: true },
  genre: { type: String, required: true },
  dn: { type: Date, required: true },
  tel: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        // Check if phone number is a valid format
      },
      message: 'Invalid phone number',
    },
  },
  createdAt: { type: Date, default: Date.now },
  hasProfile: { type: Boolean, default: false },
  username: { type: String, required: false, unique: true},
  bio: { type: String, required: false },
  picture: {
    data: {
      type: Buffer,
      required: false,
    },
    contentType: {
      type: String,
      required: false,
      enum: [
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/gif',
      ],
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
