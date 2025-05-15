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
  assesmblyService,
  registrationType,
  schemeService,
  sectorService,
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

// Get master service
const masterController = async (req, res) => {
  let result = {};
  let response = null;
  try {
    //fetched all state
    result.state = await stateService(req);

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

    // fetched all country
    result.country = await countryService(req);

    //fetched all registration type 
    result.registrationTypes=await registrationType(req);

    // fetched all schemes 
    result.schemes=await schemeService(req);

    // fetched all sectors 
    result.sectors=await sectorService(req);

    // fetched all course category  
    result.courseCategries=await courseCategoryService(req);

    // logger.info("Master Controller: Successfully process master data", result);
    response = propagateResponse("Fetched all master data", result, 200);
  } catch (error) {
    console.log(error);
    logger.error("Master Controller: Error in master data", error.message);
    response = propagateError(501, "Controller-MS-main-1", "failed in master section");
  }
  res.send(response);
};

// Post master service

const masterPostController = async (req, res) => {
  let result = {};
  let response = null;
  let expectItem = req?.body?.expectItem || null;
  console.log(expectItem);
  try {
    switch (expectItem) {
      case "districts":
        // fetched all districts
        result.districts = await districtService(req);
        break;
      case "assembly":
        // fetched all assembly
        result.assembly = await assesmblyService(req);
        break;
      
      default:
        response = propagateError(501, "MS-post-case", "expectItem needed in the body");
        return res.send(response);

    }
    // logger.info("Master Controller: Successfully process master data", result);
    response = propagateResponse("Fetched all master data", result, 200);
  } catch (error) {
    console.log(error);
    logger.error("Master Controller: Error in master data", error.message);
    response = propagateError(501, "Controller-MS-main-2", "failed in master section");
  }
  res.send(response);
};

module.exports = {
  masterController,
  masterPostController,
};
