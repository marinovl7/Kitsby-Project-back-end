const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  referralLink: {
    type: String,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  passLevel: {
    type: Number,
    default: -1,
  },
  signedUpReferralLink: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
});

module.exports = mongoose.model("User", userSchema);
