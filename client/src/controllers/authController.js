const moment = require("moment/moment");
const mysqlDB = require("../../DATABASE/mysqlConnection");
const query = require("../queries/master/masterQueries.js");
var request = require('supertest');
let MIN_OTP = 100001;
let MAX_OTP = 999999;
let DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";


exports.getOtpController = async (req, res) => {
    postParam = req.body
    let mobile1OTP = 777777;
    let otpExpireMinutes = 10;
    let startMoment = null;
    let startDate = null;
    let endMoment = null;
    let endDate = null;
    let smsStatus = false;
    let resultObj = {};
    let mysqlCon = null;
    let insertedId = null;
    let queryResultObj = {};
    let endDateServerFormat = null;
    let endDateServerFormatMoment = null;

    try {
        try {
            mysqlCon = await mysqlDB.getDB();
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error(sCandidateRegistrationCRS-SSO100)");
        }
        // if (postParam.insertedId) {} else {
        //     throw new Error(`Please Register Email First.`);
        // }
        await validateMobile(postParam, mysqlCon);
        mobile1OTP = await randomOTP(MIN_OTP, MAX_OTP);
        startMoment = moment();
        startDate = startMoment.toDate();
        endMoment = moment().add(otpExpireMinutes, 'minutes');
        endDate = endMoment.toDate();
        endDateServerFormat = moment(endDate).format(DATE_TIME_FORMAT);

        // begin transaction 
        try {
            await mysqlDB.beginTransaction(mysqlCon);
        } catch (error) {
            console.error(error);
            throw new Error(`Internal Server Error(sCandidateRegistrationCRS-SSO110)`)
        }

        try {
            queryResultObj = await mysqlDB.query(mysqlCon, query.insertSmsOtp,
                [postParam.mobile, mobile1OTP, "CANDIDATE_PUBLIC_REGISTRATION_CONTACT_VERIFICATION",
                    startDate, endDate, startDate, startDate
                ]);
            insertedId = queryResultObj.insertId;
            if (insertedId !== undefined && insertedId !== null && insertedId.toString().trim().length > 0) {} else {
                throw new Error("Internal Server Error(OTP Cannot Send Now. Please try After Some Time)" +
                    "(sCandidateRegistrationCRS-SSO130)");
            }
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error(sCandidateRegistrationCRS-SSO120)");
        }

         smsStatus = await sendSmsForOtp(postParam.mobile, mobile1OTP, endDateServerFormat);

        try {
            queryResultObj = await mysqlDB.query(mysqlCon, query.updateSmsOtp,
                [smsStatus, new Date(), insertedId]);
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error(sCandidateRegistrationCRS-SSO130) " + error);
        }

        try {
            await mysqlDB.commit(mysqlCon);
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error(sCandidateRegistrationCRS-SSO140)");
        }
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (mysqlCon !== null) {
            mysqlCon.release();
        }
    }
    resultObj.status = 'success';
    resultObj.mobile1 = postParam.mobile;
    resultObj.insertedId = insertedId;
    resultObj.mobile1OTP = mobile1OTP;

    return res.send(resultObj);
};

let validateMobile = async (postParam, mysqlCon) => {
    let regex = new RegExp(/^\d+$/);
    if (postParam.mobile !== undefined &&
        postParam.mobile !== null &&
        postParam.mobile.toString().trim().length > 0) {
        if (!postParam.mobile.toString().trim().match(regex)) {
            throw new Error("Please Enter MOBILE NUMBER ");
        }
        if (postParam.mobile.toString().trim().length !== 10) {
            throw new Error("MOBILE NUMBER  Must Be Equal To 10 Numeric Characters");
        }
        postParam.mobile = postParam.mobile.toString().trim();
        await mobile1DuplicateCheck(postParam.mobile, mysqlCon);
    } else {
        throw new Error("Please Enter MOBILE NUMBER");
    }
};
let randomOTP = async (min, max) => {
    let OTP = Math.floor(Math.random() * (max - min)) + min;
    return OTP;
};
let sendSmsForOtp = async (mobile1, mobile1OTP, endDate) => {
    
    let message = `OTP is ${mobile1OTP} for mobile number verification and valid till 10mins`;
    let smsObj = {};
    try {
        smsObj.toMobileNumber = mobile1;
        smsObj.message = message;
        smsObj.smsTemplateId = '1407165674833300216';
        // await sendSMS(smsObj);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
let sendSMS = function (smsObject) {
    return new Promise(function (resolve, reject) {
        let mobileNo = smsObject.toMobileNumber;
        request('http://sms.amtronindia.in/form_/send_api_master_get.php?')
            .get("agency=AMTRON&password=skill@123&district=ALL&app_id=ASDM&sender_id=ASDMSM&unicode=false&to=" +
                mobileNo + "&te_id=" + smsObject.smsTemplateId + "&msg=" + encodeURIComponent(smsObject.message))
        .end(function (error, res) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.stringify(res));
            });
    });
};

/****************************************************************************************/
exports.verifyOtpController = async (req, res) => {
    postParam= req.body
    let mysqlCon = null;
    let result = {};
    let queryResultObj = {};
    let currentDate = new Date();
    let currentDateMoment = null;
    let endDate = null;
    let endDateMoment = null;
    let insertedId = postParam.insertedId;
    let mobile1Verified = postParam.obj.mobile1Verified;
    try {
        try {
            mysqlCon = await mysqlDB.getDB();
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error(sCandidateRegistrationCRS-VSO100)");
        }
        if (mobile1Verified) {
            try {
                queryResultObj = await mysqlDB.query(mysqlCon, query.verifyOtp, [insertedId]);
            } catch (error) {
                console.error(error);
                throw new Error("Internal Server Error(sCandidateRegistrationCRS-VSO110)");
            }
            if (queryResultObj && queryResultObj.length > 0) {
                currentDateMoment = moment(currentDate);
                endDate = queryResultObj[0].expiryDate;
                endDateMoment = moment(endDate);
                if (currentDateMoment.isAfter(endDateMoment)) {
                    throw new Error("The entered OTP has expired(sCandidateRegistrationCRS-VEO120)");
                }
            } else {
                throw new Error("Register Email First (sCandidateRegistrationCRS-VSO130)")
            }
            queryResultObj = await mysqlDB.query(mysqlCon, query.updateMobile1Verified, [mobile1Verified, insertedId]);
        }
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (mysqlCon !== null) {
            mysqlCon.release();
        }
    }
    result.status = 'success';
    res.send(result)
};