import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";


export const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json("User already exists!");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ 
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: hashedPassword,
     
    });
    await newUser.save();
    return res.status(200).json("User has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message || "Internal Server Error");
  }
};




export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("Invalid email or password");
    }
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!checkPassword) {
      return res.status(400).json("Invalid email or password");
    }
    const token = jwt.sign({ id: user._id }, "secretkey");
    const { password, ...others } = user.toObject();
    res.cookie("accessToken", token, {
      httpOnly: true,
    });
    return res.status(200).json(others);
  } catch (error) {
    console.error(error);
  
    return res.status(500).json(error.message || "Internal Server Error");
  }
};





export const logout = (req, res) => { 
  res.clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    }).status(200).json("User has been logged out.");
};
