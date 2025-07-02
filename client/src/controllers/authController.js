const moment = require("moment/moment");
const mysqlDB = require("../../DATABASE/mysqlConnection");
const query = require("../queries/master/masterQueries.js");
var request = require('supertest');
let MIN_OTP = 100001;
let MAX_OTP = 999999;
let DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const cryptoLoginService = require("../../utils/cryptoLoginService.js");
const jwt = require("jsonwebtoken");
const { propagateResponse, propagateError } = require("../../utils/responsehandler.js");

exports.getOtpController = async (req, res) => {
    postParam = req.body
    if(!postParam?.mobile && !postParam.isLogin){
        return res.status(400).send({
            status: false,
            message: "Invalid request"
        });
    }
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
    let mobileExist = null;
    try {
        try {
            mysqlCon = await mysqlDB.getDB();
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error(sCandidateRegistrationCRS-SSO100)");
        }
       
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
            //check if mobile no exist if yes then generate token otherwise token set as null
            mobileExist = await mysqlDB.query(mysqlCon, query.checkMobileExist, [postParam.mobile]);
            if(postParam.isLogin){
                if(mobileExist.length > 1){
                    return res.status(400).send(propagateError(400, "Multiple_Mobile_Number_Found", "Multiple mobile number found! Please contact admin"));
                }else if(mobileExist.length === 0){
                    return res.status(400).send(propagateError(400, "Mobile_Number_Not_Found", "Mobile number not found!"));
                }
            }else{
                if(mobileExist.length === 1){
                    return res.status(400).send(propagateError(400, "Mobile_Number_Already_Exist", "Mobile number already exists"));
                }else if(mobileExist.length > 1){
                    return res.status(400).send(propagateError(400, "Multiple_Mobile_Number_Found", "Multiple mobile number found! please contact admin"));
                }
            }
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
    return res.send(propagateResponse("OTP sent successfully", resultObj, "OTP_SENT_SUCCESSFULLY", 200));
    
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
    let otp = postParam.otp;
    let mobile = postParam.mobile;
    let token = null;

    try {
        try {
            mysqlCon = await mysqlDB.getDB();
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error(sCandidateRegistrationCRS-VSO100)");
        }

        // Bypass OTP check for 777777
        if (otp === '777777') {
            result.status = 'success';
            const mobileExist = await mysqlDB.query(mysqlCon, query.checkMobileExist, [postParam.mobile]);
            if(mobileExist.length > 0){
                token = jwt.sign({ mobile: postParam.mobile, type: "candidate"}, process.env.JWT_SECRET, { expiresIn: '30d' });
            }
            result.token = token;
            return res.send(propagateResponse("OTP verified successfully", result, "OTP_VERIFIED_SUCCESSFULLY", 200));
        }
      
        try {
            queryResultObj = await mysqlDB.query(mysqlCon, query.verifyOtp, [otp,mobile]);
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error(sCandidateRegistrationCRS-VSO110)");
        }
        // console.log("higi-----------",queryResultObj)
        if (queryResultObj && queryResultObj.length > 0) {
            currentDateMoment = moment(currentDate);
            endDate = queryResultObj[0].expiryDate;
            endDateMoment = moment(endDate);
            if (currentDateMoment.isAfter(endDateMoment)) {
                throw new Error("The entered OTP has expired(sCandidateRegistrationCRS-VEO120)");
            }
            queryResultObj = await mysqlDB.query(mysqlCon, query.updateMobile1Verified, [queryResultObj[0].id]);
            result.status = 'success';
            
            //check if mobile exist then send token otherwise not
            const mobileExist = await mysqlDB.query(mysqlCon, query.checkMobileExist, [postParam.mobile]);
            console.log("mobileExist",mobileExist[0])
            if(mobileExist.length > 0){
                token = jwt.sign({ data: mobileExist[0], type: "candidate"}, process.env.JWT_SECRET, { expiresIn: '30d' });
            }
        } else {
            return res.status(400).send(propagateError(400, "OTP_NOT_VALID", "OTP not valid"));
        }
        result.token = token;
        return res.send(propagateResponse("OTP verified successfully", result, "OTP_VERIFIED_SUCCESSFULLY", 200));
        
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (mysqlCon !== null) {
            mysqlCon.release();
        }
    }
    
};
//10 normal hog , 16 super hog ,



exports.loginController = async (req, res) => {
    let mysqlCon = null;
    let data;
    try {
        mysqlCon = await mysqlDB.getDB();
    } catch (error) {
        console.error(error);
        throw new Error("Error connecting to db");
    }
    if(!req.body?.username || !req.body?.password){
        return res.status(400).send({
            status: false,
            message: "Invalid username or password"
        });
    }
    const { username, password} = req.body;
    

    try {
        const rows = await mysqlDB.query(mysqlCon, query.getUserByUsername, [username]);
        // console.log("rows",rows)
        if (rows.length === 0) {
            return res.status(400).send({
                status: false,
                message: "Invalid username"
            });
        }
        const encryptedPassword = cryptoLoginService.encrypt(password);
        const admin = rows[0];
        if (encryptedPassword !== admin.vsPassword) {
            return res.status(400).send({
                status: false,
                message: "Invalid username or password"
            });
        }
        if (admin.pklRoleId === 58) {
           data = await mysqlDB.query(mysqlCon, query.getUser, [admin.pklEntityId]);
        }
        //generate token
        const token = jwt.sign({ admin_id: admin.pklLoginId, login_name: admin.vsLoginName, type: admin.vsRoleName ,data:data}, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).send(propagateResponse("Login successful", {
            status: true,
            message: "Login successful",
            type: admin.admin_type,
            token: token
        }, "LOGIN_SUCCESSFUL", 200));

    } catch (error) {
        console.error(error);
        res.status(500).send(propagateError(500, "Internal Server Error while logging in admin", "Internal Server Error while logging in admin"));
    }finally {
        if (mysqlCon) mysqlCon.release();
    }
};