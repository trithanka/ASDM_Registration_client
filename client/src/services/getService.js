const {
    propagateResponse,
    propagateError,
  } = require("../../utils/responsehandler");
  const logger = require("../../utils/logger");
  const query = require("../queries/getQuery");
  const supportDatabase = require("../../utils/supportDatabase");
  
  //Get all course service
  const allCoursesService = async (req) => {
    
    // Inilized main query
    let mainQuery = query.allCourseQuery;
  
    // Inilized query params
    let queryParams = [];
  
    // Initilized support database class
    const supportDatabaseObj = new supportDatabase();
  
    // call connection and execute query methods
  
    let db = await supportDatabaseObj.checkConnection();
    let supportData = await db.executeQuery(mainQuery, queryParams);
  
    return supportData.struct.data;
  };
  
  module.exports = {
    allCoursesService,
  };
  