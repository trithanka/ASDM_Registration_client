const express = require("express");
const router = express.Router();
const {getOtpController,verifyOtpController} = require("../controllers/authController");


//get otp
router.post("/get-otp",getOtpController);

//verify otp
router.post("/verify-otp",verifyOtpController)

module.exports = router;
