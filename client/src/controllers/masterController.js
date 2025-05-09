const logger = require("../../utils/logger");
const {
  propagateResponse,
  propagateError,
} = require("../../utils/responsehandler");
const {
  masterService,
  testService,
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
} = require("../services/masterService");

/**
 * @swagger
 * /client/master:
 *   get:
 *     summary: Get master data
 *     description: Retrieves master data information from the service
 *     tags: [Master]
 *     responses:
 *       200:
 *         description: Master data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MasterResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// all master data
const masterController = async (req, res, next) => {
  let result = {};
  let response = null;
  try {
    //fetched all state
    result.state = await stateService(req);

    // fetched all districts
    result.districts = await districtService(req);

    //fetched all gender
    result.gender = await genderService(req);

    // fetched all ID card type
    result.IDCardType = await IDCardTypeService(req);

    // fetched all religion
    result.religions = await religionService(req);

    // fetched all categories
    result.categories = await categoryService(req);

    // fetched all qualification
    result.qualification = await qualificationService(req);

    // fetched all council
    result.councils = await councilService(req);

    // fetched all course categories
    result.courseCategories = await courseCategoryService(req);

    // fetched all country
    result.country = await countryService(req);

    logger.info("Master Controller: Successfully process master data", result);
    response = propagateResponse("Fetched all master data", result, 200);
  } catch (error) {
    console.log(error);
    logger.error("Master Controller: Error in master data", error.message);
    response = propagateError(501, "MS-main-1", "failed in master section");
  }
  res.send(response);
};

// Id by master data

const masterPostController = async (req, res, next) => {

};


module.exports = {
  masterController,
  masterPostController
};
