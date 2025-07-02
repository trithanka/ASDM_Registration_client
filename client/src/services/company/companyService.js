const connection = require("../../../DATABASE/mysqlConnection");
const { companyDetails } = require("../../validation/companyValidation");
const {
  propagateResponse,
  propagateError,
} = require("../../../utils/responsehandler");
const logger = require("../../../utils/logger");


const query=require('../../queries/company/companyQuery');

const { encrypt } = require('../../utils/encryption');


exports.registerCompany = async (companyData) => {
    try {
        // Start transaction
        mysqlCon = await connection.getDB();
        await connection.beginTransaction(mysqlCon);

        // 1. Insert into nw_loms_login
        const encryptedPassword = encrypt(companyData.password);
        const loginResult = await connection.query(mysqlCon,query.saveLomsLogin,
            [companyData.username, encryptedPassword]
        );
        const loginId = loginResult.insertId;

        // 2. Insert into nw_enms_entity
        const entityResult = await connection.query(mysqlCon,query.saveEntity,
            [
                companyData.fklOrganizationTypeId,
                companyData.companyName,
                companyData.companyEmail,
                companyData.companyMobile,
                companyData.pan,
                loginId
            ]
        );
        const entityId = entityResult.insertId;

        // 3. Insert into nw_loms_login_role
        await connection.query(mysqlCon,query.saveLomsLoginRole,
            [loginId, entityId]
        );

        // 4. Insert into nw_emms_employer_details
        await connection.query(mysqlCon,query.saveEmployerDetails,
            [
                entityId,
                companyData.companyType,
                companyData.companyAddress,
                companyData.pinCode
            ]
        );
        // Commit transaction
        await mysqlCon.commit();

        return {
            success: true,
            message: 'Company registered successfully',
            data: { loginId, entityId }
        };

    } catch (error) {

        // Rollback transaction in case of error
        await mysqlCon.rollback();
        return propagateError(error);
    }finally{
        if (mysqlCon) {
            await mysqlCon.release(); // Ensure connection is released
          }
    }
};