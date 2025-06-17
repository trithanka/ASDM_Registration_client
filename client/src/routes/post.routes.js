const express = require("express");
const router = express.Router();
const {candidateRegistrationController} = require("../controllers/postDataController");

//candidate registration
router.post("/candidate-registration", candidateRegistrationController);




module.exports = router;
    