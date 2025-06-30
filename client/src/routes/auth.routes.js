const express = require("express");
const router = express.Router();
const {getOtpController,verifyOtpController,loginController} = require("../controllers/authController");


//get otp
router.post("/get-otp",getOtpController);

//verify otp
router.post("/verify-otp",verifyOtpController)

//login 
router.post("/login",loginController)


module.exports = router;
