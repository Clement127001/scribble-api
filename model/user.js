const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../utils/uploadImage");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide user name"],
    maxlength: 25,
    minlength: 3,
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
    unique: [true, "User already exists"],
  },
  profile: {
    type: String,
  },
  role: {
    type: String,
    required: [true, "please provide role"],
  },
  description: {
    type: String,
    minlength: [20, "please provide description with atleast 20 characters"],
  },
  githubUrl: {
    type: String,
    unique: true,
  },
  linkedinUrl: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: [6, "please provide password with atleast 6 characters"],
  },
});

//mongo middleware
//storing the hashed password
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.profile = await uploadImage(this.profile);
});

//generate token
UserSchema.methods.createJWTToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: "10d" }
  );
};

UserSchema.methods.comparePassword = function (userPassword) {
  const isPasswordmatch = bcrypt.compare(userPassword, this.password);

  return isPasswordmatch;
};

// UserSchema.methods.comparePassword = function (userPassword) {
//   const isMatch = bcrypt.compare(this.password, userPassword);
//   return isMatch;
// };

module.exports = mongoose.model("User", UserSchema);
