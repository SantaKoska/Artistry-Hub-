const mongoose = require("mongoose");
const Follower = require("./FollowerModels");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
    profilePicture: {
      type: String,
      default: "/dp/default-profile.png",
    },
    description: {
      type: String,
      default: "",
    },
    posts: [
      {
        postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual for counting the number of posts
UserSchema.virtual("numberOfPosts").get(function () {
  return this.posts.length;
});

// method for counting the number of followers
UserSchema.methods.getNumberOfFollowers = async function () {
  const count = await Follower.countDocuments({ followingId: this._id });
  return count;
};

// Model
const User = mongoose.model("User", UserSchema);

module.exports = User;
