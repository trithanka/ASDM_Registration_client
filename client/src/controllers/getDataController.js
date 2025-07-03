const logger = require("../../utils/logger");
const {
  propagateResponse,
  propagateError,
} = require("../../utils/responsehandler");

const { allCoursesService, courseDetailsByID } = require("../services/courses/courseService");
const { allJobsService, jobDetailsByID } = require("../services/jobs/JobService");
const { getCandidateByIdService } = require("../services/candidate/candidateService");
const { getCompanyByIdService } = require("../services/company/companyService");

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

//Get job details by id with company details
const jobDetailsController = async (req, res) => {
  let result = {};
  let response = null;

  try {
    result = await jobDetailsByID(req);
    response = propagateResponse("Fetched jobs details with company details", result, 200);
  } catch (error) {
    console.log(error);
    logger.error("Job Controller: Error in job details", error.message);
    response = propagateError(
      501,
      "Controller-Jobs-Details-1",
      "failed in all jobs details section"
    );
  }
  res.send(result);
};

// Get candidate details by candidateId
const candDetailController = async (req, res) => {
  const { candidateId } = req.body;
  if (!candidateId) {
    return res.status(400).json(propagateError(400, "CANDIDATE_ID_REQUIRED", "candidateId is required"));
  }
  try {
    const result = await getCandidateByIdService(candidateId);
    if (result.status === "success" && result.data) {
      return res.status(200).json(propagateResponse("Fetched candidate details", result.data, "CANDIDATE_FETCH_SUCCESS", 200));
    } else {
      return res.status(404).json(propagateError(404, "CANDIDATE_NOT_FOUND", "Candidate not found"));
    }
  } catch (error) {
    return res.status(500).json(propagateError(500, "CANDIDATE_FETCH_ERROR", error.message || "Failed to fetch candidate details"));
  }
};

// Get company details by entityId
const companyDetailController = async (req, res) => {
  const { entityId } = req.body;
  if (!entityId) {
    return res.status(400).json(propagateError(400, "ENTITY_ID_REQUIRED", "entityId is required"));
  }
  try {
    const result = await getCompanyByIdService(entityId);
    if (result.status === "success" && result.data) {
      return res.status(200).json(propagateResponse("Fetched company details", result.data, "COMPANY_FETCH_SUCCESS", 200));
    } else {
      return res.status(404).json(propagateError(404, "COMPANY_NOT_FOUND", "Company not found"));
    }
  } catch (error) {
    return res.status(500).json(propagateError(500, "COMPANY_FETCH_ERROR", error.message || "Failed to fetch company details"));
  }
};

module.exports = {
  allCourseListController,
  courseByIdController,
  allJobsListController,
  jobDetailsController,
  candDetailController,
  companyDetailController
};
