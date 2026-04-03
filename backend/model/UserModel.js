const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should have more than 8 characters"],
      select: false, // never returned in query results unless explicitly selected
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    bio: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// FIX 2: isModified is a METHOD on the document — it must be called as a
// function: this.isModified("password").
// The original code compared the function reference to false
// (this.isModified === false), which is ALWAYS falsy, so the guard never
// triggered and the password was re-hashed on every save, even when only
// a non-password field like `name` was updated.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // password unchanged — skip hashing
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT Token method
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
