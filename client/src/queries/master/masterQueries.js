// All Master queries
let query = {
 
  //all state query
  stateQuery:
    "SELECT state.pklStateId AS stateId, state.vsStateName AS stateName FROM nw_mams_state state WHERE state.fklCountryId=97 ORDER BY state.vsStateName",

  //all district query by state ID
  districtsQuery:
    "SELECT district.vsDistrictName,district.pklDistrictId FROM nw_mams_district AS district WHERE  district.fklStateId = ? ",

  //all gender query
  genderQuery:
    "SELECT gender.pklGenderId AS genderId,gender.vsGenderName AS genderName FROM nw_mams_gender gender ORDER BY gender.vsGenderName ",

  // all ID card type
  IDCardTypeQuery:
    "SELECT idType.pklIdType AS categoryId,idType.vsIdTypeDisplayName AS categoryName FROM nw_mams_id_type idType WHERE idType.pklIdType = 3 ",

  //all religions query
  religionQuery: `SELECT 
	religion.pklReligionId AS religionId, religion.vsReligionName AS religionName 
  	FROM
	nw_mams_religion religion `,

  //all category query
  categoryQuery: `SELECT caste.pklCasteId AS categoryId,caste.vsCasteName AS categoryName FROM nw_mams_caste caste ORDER BY caste.vsCasteName `,

  //all qualifications query
  qualificationQuery: `SELECT qualification.pklQualificationId AS qualificationId,
    qualification.vsQualification AS qualificationName 
    FROM nw_mams_qualification qualification 
    order by qualification.vsQualification `,

  //all council query
  councilQuery: `SELECT loksabha.pklLoksabhaConstituencyId AS constituencyId ,
    loksabha.vsConstituencyName AS constituencyName
    FROM nw_mams_constituency_loksabha loksabha 
    ORDER BY loksabha.vsConstituencyName `,

    //All country query
  countryQuery: `SELECT country.pklCountryId,
		country.vsCountryName
		 FROM nw_mams_country as country 
		 WHERE country.pklCountryId = 97 `,

  //all assembly query by council ID
  assemblyQuery: `SELECT  
	assembly.pklAssemblyConstituencyId AS assemblyId,
	assembly.vsConstituencyName AS assemblyName
	FROM nw_mams_constituency_assembly assembly
	INNER JOIN nw_mams_constituency_loksabha lokasbha ON lokasbha.pklLoksabhaConstituencyId = assembly.fklLoksabhaConstituencyId
	WHERE lokasbha.pklLoksabhaConstituencyId= ?`,

  //all registration type query
  allregistrationTypeQ: `SELECT reg_type.pklRegistrationTypeId,
  reg_type.vsRegistrationSource 
  FROM nw_mams_registration_type AS reg_type`,

  // all schemes query
  schemesQuery: `SELECT scheme.pklSchemeId,
  scheme.vsSchemeName,
  scheme.vsSchemeShortName 
  FROM nw_scms_scheme AS scheme `,

  //all sectors query
  sectorsQuery: `SELECT sector.pklSectorId,
  sector.fklJvId,
  sector.vsSectorName,
  sector.fklOldSectorId 
  FROM nw_coms_sector AS sector `,

  //all course category 
  courseCategoryQuery:`SELECT course_cate.pklCourseCategoryId,
  course_cate.fklJvId,
  course_cate.vsName,
  course_cate.vsCode,
  course_cate.vsProjectTypeId 
  FROM nw_coms_course_category as course_cate 
  ORDER BY course_cate.vsName`,
  /*********************************************************************************************/
	insertSmsOtp: `INSERT INTO nw_public_registration(vsMobileNumber, iSmsOTP, vsOTPType, dtStartDate, 
  dtEndDate, dtCreatedDate, dtModifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  /*********************************************************************************************/
	updateSmsOtp: `UPDATE nw_public_registration 
  SET bSMSSent=?, dtModifiedDate=? 
  WHERE pklPublicRegistrationId=?`,

  verifyOtp: `SELECT publicRegistration.dtEndDate AS expiryDate ,publicRegistration.pklPublicRegistrationId as id
  FROM nw_public_registration publicRegistration 
  WHERE publicRegistration.iSmsOTP=? and publicRegistration.vsMobileNumber =? and publicRegistration.bSmsVerified= 0`,
  updateMobile1Verified: `UPDATE nw_public_registration 
		SET  bSmsVerified=1 
		WHERE pklPublicRegistrationId=?`,
};
module.exports = query;
