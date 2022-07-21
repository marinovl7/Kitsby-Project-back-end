const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Sign JWT
const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const { email, password, userReferralLink } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (userReferralLink !== "notValid") {
      const existingLink = await User.findOne({
        referralLink: userReferralLink,
      });

      if (!existingLink) {
        return res.status(400).json({ msg: "Invalid referral link" });
      }
    }

    let newUser;
    // generate 8 random characters
    const newReferralLink = Math.random().toString(36).substring(2, 12);
    if (!userReferralLink || userReferralLink === "notValid") {
      newUser = new User({
        email,
        password,
        referralLink: newReferralLink,
        balance: 10.0,
      });
    } else {
      newUser = new User({
        email,
        password,
        referralLink: newReferralLink,
        signedUpReferralLink: userReferralLink,
        balance: 10.0,
      });
    }

    await newUser.save();
    const token = signJWT(newUser._id);
    res.status(201).json({ userId: newUser.id, token });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = signJWT(user._id);
    res.status(200).json({ userId: user.id, token });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Invalid user id" });
    } else {
      res.status(500).json({
        message: err.message,
      });
    }
  }
};

exports.addBalance = async (req, res) => {
  try {
    const { userId, balance } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    user.balance += balance;
    await user.save();
    res.status(200).json({ userId: user.id, balance: user.balance });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    res.status(200).json({ userId: user.id, balance: user.balance });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.addPassLevel = async (req, res) => {
  try {
    const { userId, passLevel } = req.body;
    if (passLevel > 3) {
      return res
        .status(400)
        .json({ msg: "Pass level cannot be greater than 3" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    user.passLevel = passLevel;
    await user.save();

    res.status(200).json({ userId: user.id, passLevel: user.passLevel });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password -__v");
  res.status(200).json(users);
};

exports.getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    await user.remove();
    res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
