const moment = require("moment/moment");
const connection = require("../../DATABASE/mysqlConnection");
const { propagateError } = require("../../utils/responsehandler");
const query=require('../queries/candidate/candidateQuery');
// const mailService = require('./emailService'); // You'll need to adjust this path
// const smsService = require('./smsService'); // You'll need to adjust this path
// Validation function
exports.validateObj = async (postParam, mysqlCon) => {
  try {
    const emailExists = await email1DuplicateCheck(postParam.email1, mysqlCon);
    if (emailExists) {
      return propagateError(501, "Candidate-Registration-1", "Email already registered");
    }

    const mobileExists = await mobile1DuplicateCheck(
      postParam.mobile1,
      mysqlCon
    );
    if (mobileExists) {
      return propagateError(501, "Candidate-Registration-1", "Mobile number already registered");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// Duplicate check functions
email1DuplicateCheck = async (email1,mysqlCon) => {
  try {
    const result = await connection.query(mysqlCon,query.email1DuplicateCheck, [email1]);
    return result[0].candidateCount > 0;
  } catch (error) {
    throw error;
  }
};

// *** Duplicate Check ****
mobile1DuplicateCheck=async (mobile1, mysqlCon) => {
    try {
        const result = await connection.query(mysqlCon,query.mobile1DuplicateCheck, [mobile1])
        return result[0].candidateCount > 0
    } catch (error) {
        throw error
    }
};

// Generate reference number

exports.generateReferenceNo = async (mysqlCon) => {
    const date = moment().format('YYYYMMDD');
    const count = await getCandidateCount(mysqlCon);

    const paddedCount = count.toString().padStart(4, '0');
    return `ASDM${date}${paddedCount}`;
};

// Get candidate count
getCandidateCount = async(mysqlCon)=>  {
    const result = await connection.query(mysqlCon, query.getCandidateCount, []);
    console.log("Cand Count ",result[0].rowCount);
    return result[0].rowCount + 1;
};

// Save registration
exports.saveRegistration =async(postParam, mysqlCon)=> {
    // Save basic details
    const basicResult = await connection.query(mysqlCon, query.saveBasicDetails, [
        postParam.jvId,
        postParam.firstName,
        postParam.middleName,
        postParam.lastName,
        postParam.certName,
        postParam.fatherName,
        postParam.motherName,
        postParam.empExchangeNo,
        postParam.dob,
        postParam.uuid,
        postParam.gender,
        postParam.religionId,
        postParam.registrationTypeId,
        postParam.registrationDate,
        postParam.isBPLCardHolder,
        postParam.isAntodayaCardHolder,
        postParam.isNregaCardHolder,
        postParam.isMinority,
        postParam.isBoCw,
        postParam.isTeaTribeMinoriy,
        postParam.idType,
        'ACTIVE'
    ]);

    const candidateId = basicResult.insertId;

    // *** Save Caste Details ***

    await connection.query(mysqlCon,query.saveCastDetails,[
        candidateId,
        postParam.fklCasteCategoryId
    ]);

    // Save contact details
    await connection.query(mysqlCon, query.saveContactDetails, [
        candidateId,
        postParam.mobileCountryCode,
        postParam.mobile1,
        postParam.otherMobileNo,
        postParam.email1,
        new Date()
    ]);

    // Save qualification details
    if (postParam.qualificationId) {
        await connection.query(mysqlCon, query.saveQualificationDetails, [
            candidateId,
            postParam.qualificationId
        ]);
    }

    // Save course preferences
    if (postParam.selectedPreferenceArr && postParam.selectedPreferenceArr.length > 0) {
        for (const preference of postParam.selectedPreferenceArr) {
            await connection.query(mysqlCon, query.saveCoursePreference, [
                postParam.jvId,
                candidateId,
                preference.interestedDistrictId,
                preference.interestedTalukaId,
                preference.interestedCourseId,
                new Date()
            ]);
        }
    }

    // Save disability details
    await connection.query(mysqlCon, query.saveDisabilityDetails, [
        candidateId,
        postParam.isDisability || false,
        new Date()
    ]);

    // Save address details
    await connection.query(mysqlCon, query.saveAddressDetails, [
        candidateId,
        new Date(),
        postParam.countryId,
        postParam.stateId,
        postParam.districtId,
        postParam.talukaId,
        postParam.ulbId,
        postParam.areaType,
        postParam.address,
        postParam.cityName,
        postParam.policeStation,
        postParam.pinCode,
        postParam.addressType,
        postParam.assemblyConstituencyId,
        postParam.loksabhaConstituencyId,
        postParam.postOffice
    ]);

    return candidateId;
};

// Get district name
exports.getDistrictName = async(districtId, mysqlCon) =>{
    const result = await connection.query(mysqlCon, query.getDistrictName, [districtId]);
    return result?.[0]?.districtName ?? null;
};

// Get sector name
exports.getSectorName = async (jvId, sectorId, mysqlCon)=> {
    const result = await connection.query(mysqlCon, query.getSectorName, [jvId, sectorId]);
    return result?.[0]?.sectorName ?? null;
};

// Send email
exports.sendEmail = async(fromEmail, toEmail, name, referenceNo, districtName, sectorName) => {
    const subject = "Registration Successful - ASDM";
    const body = `Dear ${name},\n\nYour registration has been successful.\nReference No: ${referenceNo}\nDistrict: ${districtName}\nSector: ${sectorName}\n\nPlease keep this reference number for future correspondence.\n\nRegards,\nASDM Team`;
    
    try {
        // await mailService.sendMail(fromEmail, toEmail, subject, body);
        return true;
    } catch (error) {
        console.error("Email sending failed:", error);
        return false;
    }
};

// Send SMS
exports.sendSms = async (mobile, name, referenceNo, districtName, sectorName)=> {
    const message = `Dear ${name}, your registration is successful. Ref No: ${referenceNo}, District: ${districtName}, Sector: ${sectorName}. Keep this ref no for future correspondence. -ASDM`;
    
    try {
        // await smsService.sendSms(mobile, message);
        return true;
    } catch (error) {
        console.error("SMS sending failed:", error);
        return false;
    }
};