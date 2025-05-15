const connection = require("../../DATABASE/mysqlConnection");
const {
  propagateResponse,
  propagateError,
} = require("../../utils/responsehandler");
const logger = require("../../utils/logger");
const query = require("../queries/master/masterQueries");
const { checkConnection } = require("../../utils/supportDatabase");

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

  // Inilized mysql connection
  let sqlConn = await checkConnection();
  mysqlConn = sqlConn?.mysqlConn;

  if (!sqlConn?.isError) {
    try {

      // execute any mastr query 
      data.data = await connection.query(mysqlConn, query, queryParams);
    } catch (error) {
      logger.error(error);
      data.errorCode = `Service-MS-${type}-1`;
      data.isError = true;
    } finally {
      if (mysqlConn && typeof mysqlConn.release === "function") {
        mysqlConn.release();
      }
    }
  }else{
    data=sqlConn;
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
const registrationType = async (req) => {
  const registrationTypes = await masterService(
    "RegistrationType",
    query.allregistrationTypeQ
  );
  return registrationTypes;
};

//Get all schemes
const schemeService = async (req) => {
  const schemes = await masterService("Schemes", query.schemesQuery);
  return schemes;
};

//Get all sector
const sectorService = async (req) => {
  const sectors = await masterService("sectors", query.sectorsQuery);
  return sectors;
};

//Get all sector
const courseCategoryService = async (req) => {
  const courseCategories = await masterService(
    "courseCategories",
    query.courseCategoryQuery
  );
  return courseCategories;
};

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
  countryService,
  assesmblyService,
  registrationType,
  schemeService,
  sectorService,
  courseCategoryService,
};
