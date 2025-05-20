const connection = require("../../../DATABASE/mysqlConnection");
const {
  propagateResponse,
  propagateError,
} = require("../../../utils/responsehandler");
const logger = require("../../../utils/logger");
const query = require("../../queries/jobs/jobsQueries");
const { checkConnection } = require("../../../utils/supportDatabase");

//Get all jobs list service
const allJobsService = async (req) => {
  let mysqlConn;
  const response = {
    errorCode: null,
    isError: false,
    total: 0,
    data: null,
  };

  try {
    // Pagination
    const page = req?.body?.skip || 0;
    const limit = req?.body?.take || 10;
    const offset = limit * page;

    // Initialize queries
    let mainQuery = query.allJobsListQuery;
    let countQuery = query.totalJobsListQuery;
    const queryParams = [];

    // ---------------------------
    //Add filter logic here

    // ---------------------------

    // Apply pagination
    mainQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    // DB connection
    const connectionStatus = await checkConnection();
    if (connectionStatus?.isError) {
      return connectionStatus;
    }

    mysqlConn = connectionStatus.mysqlConn;

    // Execute queries
    response.data = await connection.query(mysqlConn, mainQuery, queryParams);
    const totalResult = await connection.query(
      mysqlConn,
      countQuery,
      queryParams
    );
    response.total = totalResult?.[0]?.total || 0;
  } catch (error) {
    logger.error(error);
    response.errorCode = "SERVICE-ALL-JOBS-1";
    response.isError = true;
  } finally {
    if (mysqlConn && typeof mysqlConn.release === "function") {
      mysqlConn.release();
    }
  }

  return response;
};

//Get all job details by ID
const jobDetailsByID = async (req) => {
  let mysqlConn;
  let data = {
    errorCode: null,
    isError: false,
    jobDetails: null,
    companyDetails:null
  };
  try {
    let jobID = req?.body?.id || 0;

    // Initialized  job details query
    let jobQuery = query.jobDetailsByIdQ;

    // Initialized job params
    let jobParams = [jobID];

    // Initialized mysql connection
    let sqlConn = await checkConnection();
    mysqlConn = sqlConn?.mysqlConn;

    if (!sqlConn?.isError) {
      //execute job details query
      let dataSet = await connection.query(mysqlConn, jobQuery, jobParams);
      
      // extracing for job details
      data.jobDetails = dataSet.map((job) => ({
        jobId: job.jobId,
        job_name: job.job_name,
        job_description: job.job_description,
        job_vacancies: job.job_vacancies,
        job_type: job.job_type,
        job_sector: job.job_sector,
        min_salary: job.min_salary,
        max_salary: job.max_salary,
        job_location_state: job.job_location_state,
        job_location_dist: job.job_location_dist,
        min_exp: job.min_exp,
        max_exp: job.max_exp,
        min_age: job.min_age,
        req_gender: job.req_gender,
        startDate: job.startDate,
        endDate: job.endDate,
        req_qualification: job.req_qualification,
        req_skills: job.req_skills,
        companyId: job.companyId,
      }));

      // extracing for company details
      data.companyDetails = dataSet.map((company) => ({
        companyId: company.companyId,
        company_name: company.company_name,
        company_area: company.company_area,
        company_city: company.company_city,
        company_PIN: company.company_PIN,
        company_description: company.company_description,
        company_state: company.company_state,
        company_dist: company.company_dist,
        hr_name: company.hr_name,
        hr_mobile: company.hr_mobile,
        hr_email: company.hr_email,
      }));

    } else {
      data = sqlConn;
    }
  } catch (error) {
    logger.error(error);
    data.errorCode = `Service-Job-by-ID-1`;
    data.isError = true;
  } finally {
    if (mysqlConn && typeof mysqlConn.release === "function") {
      mysqlConn.release();
    }
  }
  return data;
};

module.exports = {
  allJobsService,
  jobDetailsByID,
};
