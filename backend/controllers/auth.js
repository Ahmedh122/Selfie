import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Quota from "../models/quota.js";

export const register = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json("User already exists!");
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    await newUser.save();


    const newQuota = new Quota({
      userId: newUser._id,

    });

    // Save the new quota document
    await newQuota.save();



    return res.status(200).json("User has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("Invalid username or password");
    }

    // Check the password
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!checkPassword) {
      return res.status(400).json("Invalid username or password");
    }



    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, "secretkey");

    // Exclude sensitive information like password before sending the response
    const { password, ...others } = user.toObject();

    // Set the JWT token as a cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
    });


    const existsQuota = await Quota.findOne({ userId: user._id });
    if (!existsQuota) {
      const newQuota = new Quota({
        userId: user._id,
      });


      await newQuota.save();

    }



    return res.status(200).json(others);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};

export const logout = (req, res) => {
  // Clear the accessToken cookie
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
