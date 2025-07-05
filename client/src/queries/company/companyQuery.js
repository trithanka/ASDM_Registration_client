const query = {
    checkUsername: `SELECT * FROM nw_loms_login WHERE vsLoginName = ?`,
    saveLomsLogin: `INSERT INTO nw_loms_login (vsLoginName, vsPassword, fklJvId, bEnabled, dtModifiedDate) 
             VALUES (?, ?, 14, 0, NOW())`,
    saveEntity: `INSERT INTO nw_enms_entity (fklJvId, fklRoleId, fklOrganizationTypeId, vsEntityName, vsEmail1, vsMobile1, vsPan, fklLoginId, dtModifiedDate) 
             VALUES (14, 58, ?, ?, ?, ?, ?, ?, NOW())`,
    saveLomsLoginRole: `INSERT INTO nw_loms_login_role (fklJvId, fklLoginId, fklRoleId, fklUserId, dtModifiedDate) 
             VALUES (14, ?, 58, ?, NOW())`,
    saveEmployerDetails: `INSERT INTO nw_emms_employer_details (fklEntityId, fklEmployerType, vsArea, vsPINCode, dtModifiedDate) 
             VALUES (?, ?, ?, ?,  NOW())`,
    getCompanyById: `SELECT 
        entity.vsEntityName as companyName,
        entity.pklEntityId,
        entity.fklRoleId as roleId,
        entity.vsEmail1 as companyEmail,
        entity.vsMobile1 as companyMobile,
        entity.fklOrganizationTypeId as organizationTypeId,
        orgType.vsOrganizationTypeName as organizationTypeName,
        login.vsLoginName as userName,
        emp.fklEmployerType as empTypeId,
        empType.vsEmployerType as empTypeName,
        emp.vsArea as companyAddress,
        emp.vsPINCode as companyPinCode,
        emp.dtModifiedDate as createdAt
    from nw_enms_entity entity 
    left join nw_mams_organization_type orgType on entity.fklOrganizationTypeId = orgType.pklOrganizationTypeId
    left join nw_loms_login login on entity.fklLoginId = login.pklLoginId
    left join nw_emms_employer_details emp on entity.pklEntityId = emp.fklENtityId
    left join nw_mams_employer_type empType on emp.fklEmployerType = empType.pklEmployerId
    where entity.pklEntityId = ?;`,
}

module.exports = query;

