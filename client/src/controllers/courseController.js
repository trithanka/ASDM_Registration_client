const logger = require("../../utils/logger");
const {
  propagateResponse,
  propagateError,
} = require("../../utils/responsehandler");

const { allCoursesService } = require("../services/courses/courseService");

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
      "course-list-1",
      "failed in all course section"
    );
  }

  res.send(result);
};

module.exports = {
  allCourseListController,
};
