const express  = require("express");
const { registerUser, loginController, allSearchUser, updateProfile } = require("../controller/userController");
const { authentication } = require("../middleWare/auth");
const router = express.Router();


router.route("/").post(registerUser)
router.route("/login").post(loginController);
router.route("/").get(authentication , allSearchUser);
router.route("/profile").patch(authentication, updateProfile);

module.exports = router
