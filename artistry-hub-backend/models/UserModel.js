const mongoose = require("mongoose");

//Schema for User

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Artist", "Viewer/Student", "Institution", "Service Provider"],
      required: true,
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpiry: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

//model
const User = mongoose.model("User", UserSchema);

module.exports = User;
