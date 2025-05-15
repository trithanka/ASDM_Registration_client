const express = require("express");
const router = express.Router();
const { allCourseListController } = require("../controllers/courseController");

router.post("/all-list",allCourseListController);

module.exports = router;
