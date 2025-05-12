const connection = require("../../DATABASE/mysqlConnection");
const {
  propagateResponse,
  propagateError,
} = require("../../utils/responsehandler");
const logger = require("../../utils/logger");
const query = require("../queries/master/masterQueries");

/**
 * Utility function to fetch master data from database
 * @param {string} type - Type of data being fetched
 * @param {string} query - SQL query to execute
 * @param {Array} queryParams - Parameters for the query
 * @returns {Object} Data object with result or error information
 */

const masterService = async (type, query, queryParams = []) => {
  let mysqlConn;
  let data = {
    data: null,
    errorCode: null,
    isError: false,
  };

  // Initialize mysql connection
  try {
    mysqlConn = await connection.getDB();
  } catch (error) {
    data.errorCode = "MS-SQL-1";
    data.isError = true;
    data.statusCode = 501;
    data.message = "Mysql connection error";
  }

  // Process main data
  try {
    data.data = await connection.query(mysqlConn, query, queryParams);
  } catch (error) {
    logger.error(error);
    data.errorCode = `MS-${type}-1`;
    data.isError = true;
  } finally {
    if (mysqlConn && typeof mysqlConn.release === "function") {
      mysqlConn.release();
    }
  }

  return data;
};

/**
 * Service to get all states
 */
const stateService = async (req) => {
  const state = await masterService("state", query.stateQuery);
  return state;
};

/**
 * Service to get all genders
 */
const genderService = async (req) => {
  const gender = await masterService("gender", query.genderQuery);
  return gender;
};

/**
 * Service to get all ID card types
 */
const IDCardTypeService = async (req) => {
  const IDCard = await masterService("IDCard", query.IDCardTypeQuery);
  return IDCard;
};

/**
 * Service to get all religions
 */
const religionService = async (req) => {
  const religions = await masterService("religions", query.religionQuery);
  return religions;
};

/**
 * Service to get all categories
 */
const categoryService = async (req) => {
  const categories = await masterService("categories", query.categoryQuery);
  return categories;
};

/**
 * Service to get all qualifications
 */
const qualificationService = async (req) => {
  const qualification = await masterService(
    "qualification",
    query.qualificationQuery
  );
  return qualification;
};

/**
 * Service to get all councils
 */
const councilService = async (req) => {
  const councils = await masterService("council", query.councilQuery);
  return councils;
};


/**
 * Service to get all countries
 */
const countryService = async (req) => {
  const country = await masterService("country", query.countryQuery);
  return country;
};

// Get all registration type 
const registrationType=async(req)=>{
  const registrationTypes=await masterService("RegistrationType",query.allregistrationTypeQ);
  return registrationTypes;
}

// ---- start post master services -----

/**
 * Service to get all districts
 */
const districtService = async (req) => {
  const districts = await masterService("districts", query.districtsQuery, [
    req?.body?.stateID,
  ]);
  return districts;
};

// Get all assesmbly by council ID
const assesmblyService = async (req) => {
  if (req?.body?.councilID) {
    const assembly = await masterService("assembly", query.assemblyQuery, [
      req?.body?.councilID,
    ]);
    return assembly;
  } else {
    let data = {
      data: null,
      isError: true,
      message: "Council ID is required",
    };
    return data;
  }
};

/**
 * Service to get all course categories
 */
const courseCategoryService = async (req) => {
  let jvId = req?.body?.jvId || 14;
  const courseCategories = await masterService(
    "courseCategory",
    query.courseCategoriesQuery,
    [jvId]
  );
  return courseCategories;
};


// ---- end post master services ----

module.exports = {
  stateService,
  districtService,
  genderService,
  IDCardTypeService,
  religionService,
  categoryService,
  qualificationService,
  councilService,
  courseCategoryService,
  countryService,
  assesmblyService,
  registrationType
};
