const express = require('express');
const authRequired = require("../middleware/validateToke");
const {signup,signin,profile,verifyToken,signOut} = require('../controllers/authController');
const { route } = require('./productRoute');

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.get("/verify", verifyToken)
router.get("/profile", authRequired, profile)
router.post("/signout", signOut)

module.exports = router;