const express = require("express");
const router = express.Router();
const {masterController,masterPostController} = require("../controllers/masterController");

router.get("/", masterController);

router.post("/", masterPostController);

module.exports = router;
