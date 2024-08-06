const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error");
const jtw = require("jsonwebtoken");
require("dotenv").config();

const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password, estado, modulo } = req.body;
  try {
    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = new User({ 
      username, 
      email, 
      password, 
      estado, 
      modulo 
    });

    await newUser.save();
    res.status(201).json("Usuario creado exitosamente");
  } catch (error) {
    next(errorHandler(500, error.message));
  }
});

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "NO EXISTE ESTE USUARIO"));
    //comparar en caso de usar hash
    // const validPasswrod = bcryptjs.compareSync(password,validUser.password)

    // Comparar contraseñas directamente
    const isValidPassword = password === validUser.password;
    // Comparar contraseñas usando bcrypt
    //const isValidPassword = await bcryptjs.compare(password, validUser.password);

    if (!isValidPassword) {
      return next(errorHandler(400, "CONTRASEÑA INCORRECTA"));
    }

    const token = jtw.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res.cookie("acces_token", token,  { httpOnly: false,sameSite:"none",secure:true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
});

const profile = asyncHandler(async (req, res) => {
  console.log(req.user);
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
  });
});

const verifyToken = asyncHandler((req, res) => {

  const jwtSecret = process.env.JWT_SECRET;
  const { acces_token } = req.cookies;

  if (!acces_token) return res.status(401).json({ message: "Unauthorized" });

  jtw.verify(acces_token, jwtSecret, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
});


const signOut = async (req, res, next) => {  
  try {
    res.clearCookie('acces_token');
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  profile,
  verifyToken,
  signOut
};
