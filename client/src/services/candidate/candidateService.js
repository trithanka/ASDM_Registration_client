const connection = require("../../../DATABASE/mysqlConnection");
const response = require("api-response-wrapper");
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
  let basicDetails = null;
  let jobDetails = null;
  let melaDetails = null;
  try {
    mysqlCon = await connection.getDB();
    //basic details
    basicDetails = await connection.query(mysqlCon, query.getCandidateById, [candidateId]);
    if(basicDetails.length < 1){
      return resultObj = {
        status: "error",
        message: "Candidate not found",
      };
    }
    //mela details
    melaDetails = await connection.query(mysqlCon, query.getMelaDetails, [candidateId]);

    jobDetails = await connection.query(mysqlCon, query.getJobDetails, [candidateId]);
 
    //mela details inside job details which is applied by candidate
    const jobMelaDetails = melaDetails.map(mela => {
      const melaId = mela.melaId;    
      return {
        mela,
        job: jobDetails.filter(job => job.melaId === melaId)
      };
    });

    //address details
    addressDetails = await connection.query(mysqlCon, query.getAddressDetails, [candidateId]);

    //skill details
    skillDetails = await connection.query(mysqlCon, query.getSkillDetails, [candidateId]);

    resultObj = {
      status: "success",
      data: {
        basicDetails,
        jobMelaDetails,
        addressDetails,
        skillDetails,
      },
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
