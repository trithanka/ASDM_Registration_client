const express = require("express");
const router = express.Router();
const {candidateRegistrationController, companyRegistrationController} = require("../controllers/postDataController");

//candidate registration
router.post("/candidate-registration", candidateRegistrationController);

//company registration
router.post("/company-registration", companyRegistrationController);




module.exports = router;
