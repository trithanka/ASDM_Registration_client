const express = require("express");
const router = express.Router();
const {allCourseListController, courseByIdController, allJobsListController, jobDetailsController, candDetailController, companyDetailController} = require("../controllers/getDataController");

//all course route
router.post("/course", allCourseListController);

//course by id with TC
router.post('/course-by-id',courseByIdController);

// all jobs list route
router.post("/jobs", allJobsListController);

// all jobs details route
router.post("/job-by-id", jobDetailsController);

//get by candidate
router.post("/get-by-candidate", candDetailController);

//get by company
router.post("/get-by-company", companyDetailController);

module.exports = router;
