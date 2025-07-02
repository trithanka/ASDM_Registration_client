const query = {
    saveLomsLogin: `INSERT INTO nw_loms_login (vsLoginName, vsPassword, fklJvId, bEnabled, dtModifiedDate) 
             VALUES (?, ?, 14, 0, NOW())`,
    saveEntity: `INSERT INTO nw_enms_entity (fklJvId, fklRoleId, fklOrganizationTypeId, vsEntityName, vsEmail1, vsMobile1, vsPan, fklLoginId, dtModifiedDate) 
             VALUES (14, 58, ?, ?, ?, ?, ?, ?, NOW())`,
    saveLomsLoginRole: `INSERT INTO nw_loms_login_role (fklJvId, fklLoginId, fklRoleId, fklUserId, dtModifiedDate) 
             VALUES (14, ?, 58, ?, NOW())`,
    saveEmployerDetails: `INSERT INTO nw_emms_employer_details (fklEntityId, fklEmployerType, vsArea, vsPINCode, dtModifiedDate) 
             VALUES (?, ?, ?, ?,  NOW())`,
}

module.exports = query;

