const logger = require("../../utils/logger");
const {
  propagateResponse,
  propagateError,
} = require("../../utils/responsehandler");

const { allCoursesService, courseDetailsByID } = require("../services/courses/courseService");
const { allJobsService } = require("../services/jobs/JobService");

//Get all courses
const allCourseListController = async (req, res) => {
  let result = {};
  let response = null;

  try {
    result = await allCoursesService(req);
    response = propagateResponse("Fetched all courses", result, 200);
  } catch (error) {
    console.log(error);
    logger.error("Course Controller: Error in all course List", error.message);
    response = propagateError(
      501,
      "Controller-Course-List-1",
      "failed in all course section"
    );
  }
  res.send(result);
};

// Course details by course ID with TC
const courseByIdController = async (req, res) => {
  let result={}
  let response=null;
  try {
    result=await courseDetailsByID(req);
    response = propagateResponse("Fetched course details ", result, 200);
  } catch (error) {
    console.log(error);
    logger.error("Course Controller: Error in course by ID with TC", error.message);
    response = propagateError(
      501,
      "Controller-Course-by-ID-1",
      "failed in course details section"
    );
  }
  res.send(result);
};

//Get all jobs list
const allJobsListController = async (req, res) => {
  let result = {};
  let response = null;

  try {
    result = await allJobsService(req);
    response = propagateResponse("Fetched all jobs", result, 200);
  } catch (error) {
    console.log(error);
    logger.error("Job Controller: Error in all jobs List", error.message);
    response = propagateError(
      501,
      "Controller-Jobs-List-1",
      "failed in all jobs section"
    );
  }
  res.send(result);
};

module.exports = {
  allCourseListController,
  courseByIdController,
  allJobsListController
};
