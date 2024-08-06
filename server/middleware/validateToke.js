const jtw = require("jsonwebtoken");
require("dotenv").config();

const authRequired = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  console.log("validating token ");
  console.log("request headers", req.headers);
  console.log(req.cookies);
  try {
    // const { token } = req.cookies;
    const { acces_token } = req.cookies;

    if (!acces_token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    jtw.verify(acces_token, jwtSecret, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      console.log(user);
      req.user = user;
      return next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = authRequired;
