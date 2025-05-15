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
      const totalResult = await connection.query(mysqlConn, countQuery, queryParams);
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

module.exports={
    allJobsService
}