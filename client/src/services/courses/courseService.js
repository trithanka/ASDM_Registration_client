const connection = require("../../../DATABASE/mysqlConnection");
const {
  propagateResponse,
  propagateError,
} = require("../../../utils/responsehandler");
const logger = require("../../../utils/logger");
const query = require("../../queries/courses/courseQueries");
const { checkConnection } = require("../../../utils/supportDatabase");

//Get all course service
const allCoursesService = async (req) => {
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
    let mainQuery = query.allCourseQuery;
    let countQuery = query.totalCourseQuery;
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
    response.errorCode = "SERVICE-ALL-COURSE-1";
    response.isError = true;
  } finally {
    if (mysqlConn && typeof mysqlConn.release === "function") {
      mysqlConn.release();
    }
  }

  return response;
};

//Get all course details by id service
const courseDetailsByID = async (req) => {
  let mysqlConn;
  let data = {
    errorCode: null,
    isError: false,
    courseDetails: null,
    totalTcs: 0,
    allTcs: null,
  };
  try {
    let courseID = req?.body?.id || 0;

    let skip = req?.body?.skip || 0;
    let take = req?.body?.take || 10;
    skip = take * skip;

    // Initialized  course details query
    let courseQuery = query.courseDetailsByIdQ;

    // Initialized TC details query
    let TcQuery = query.TCDetailsByCourseIDQ;

    // Initialized total TCs query
    let totalTcQuery = query.totalTcsByCourseIDQ;

    // Initialized course params
    let courseParams = [courseID];

    // Initialized course params
    let tcParams = [courseID];

    // Initialized mysql connection
    let sqlConn = await checkConnection();
    mysqlConn = sqlConn?.mysqlConn;

    if (!sqlConn?.isError) {
      //execute course details query
      data.courseDetails = await connection.query(
        mysqlConn,
        courseQuery,
        courseParams
      );

      // apply pagination on Tc query
      TcQuery += ` LIMIT ${take} OFFSET ${skip} `;

      //execute TC details by course query
      data.allTcs = await connection.query(mysqlConn, TcQuery, tcParams);

      //execute total Tcs by course ID query
      let total = await connection.query(mysqlConn, totalTcQuery, tcParams);
      data.totalTcs = total?.[0]?.total;
    } else {
      data = sqlConn;
    }
  } catch (error) {
    logger.error(error);
    data.errorCode = `Service-Course-by-ID-1`;
    data.isError = true;
  } finally {
    if (mysqlConn && typeof mysqlConn.release === "function") {
      mysqlConn.release();
    }
  }
  return data;
};

module.exports = {
  allCoursesService,
  courseDetailsByID,
};
