const connection = require("../../../DATABASE/mysqlConnection");
const {
  propagateResponse,
  propagateError,
} = require("../../../utils/responsehandler");
const logger = require("../../../utils/logger");
const {
  validateObj,
  generateReferenceNo,
  saveRegistration,
  getDistrictName,
  getSectorName,
  sendEmail,
  sendSms,
} = require("../../helpers/candidateHelper");
const { basicDetails } = require("../../validation/candidateValidator");
const query=require('../../queries/candidate/candidateQuery');
let FROMEMAIL = "";

// *** Candidate Registration Service  ***
exports.save = async (postParam) => {
  let queryResultObj = {};
  let resultObj = {};
  let mysqlCon = null;
  let registrationId = null;
  let mailStatus = false;
  let smsStatus = false;
  let districtName = "";
  let sectorName = "";

  try {
    mysqlCon = await connection.getDB();
    await connection.beginTransaction(mysqlCon);


    // Validate Candidate Basic Details
    let { error, value } = basicDetails.validate(postParam, {
      abortEarly: false,
    });
    if (error) {
      return propagateError(
        501,
        "Candidate-Registration-1",
        error.details.map((e) => e.message)
      );
    }

    const isValidate = await validateObj(postParam, mysqlCon);

    // Generate reference number
    const referenceNo = await generateReferenceNo(mysqlCon);

    // Save registration
    registrationId = await saveRegistration(postParam, mysqlCon);

    // Get location names
    districtName = await getDistrictName(postParam.districtId, mysqlCon);
    sectorName = await getSectorName(
      postParam.jvId,
      postParam.sectorId,
      mysqlCon
    );

    // Send notifications
    const name = `${postParam.firstName} ${postParam.lastName}`;
    // mailStatus = await sendEmail(
    //   FROMEMAIL,
    //   postParam.email1,
    //   name,
    //   referenceNo,
    //   districtName,
    //   sectorName
    // );
    smsStatus = await sendSms(
      postParam.mobile1,
      name,
      referenceNo,
      districtName,
      sectorName
    );

    // Update notification status
    await connection.query(mysqlCon,query.updateNotificationStatus, [
      smsStatus,
      mailStatus,
      referenceNo,
      registrationId,
    ]);

    await connection.commit(mysqlCon);

    resultObj = {
      status: "success",
      message: "Registration successful",
      data: {
        registrationId,
        referenceNo,
        mailStatus,
        smsStatus,
      },
    };
  } catch (error) {
    console.log(error);
    if (mysqlCon) {
      await connection.rollback(mysqlCon);
    }
    resultObj = {
      status: "error",
      message: error.message || "Registration failed",
    };
  }finally {
    if (mysqlCon) {
      await mysqlCon.release(); // Ensure connection is released
    }
  }

  return resultObj;
};

// *** Get Candidate By ID Service ***
exports.getCandidateByIdService = async (candidateId) => {
  let mysqlCon = null;
  let resultObj = {};
  try {
    mysqlCon = await connection.getDB();
    const result = await connection.query(mysqlCon, query.getCandidateById, [candidateId]);
    resultObj = {
      status: "success",
      data: result && result.length > 0 ? result[0] : null,
    };
  } catch (error) {
    console.log(error);
    resultObj = {
      status: "error",
      message: error.message || "Failed to fetch candidate details",
    };
  } finally {
    if (mysqlCon) {
      await mysqlCon.release();
    }
  }
  return resultObj;
};
