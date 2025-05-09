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
    religionQuery:`SELECT 
	religion.pklReligionId AS religionId, religion.vsReligionName AS religionName 
  	FROM
	nw_mams_religion religion `,

    //all category query 
    categoryQuery:`SELECT caste.pklCasteId AS categoryId,caste.vsCasteName AS categoryName FROM nw_mams_caste caste ORDER BY caste.vsCasteName `,

    //all qualifications query 
    qualificationQuery:`SELECT qualification.pklQualificationId AS qualificationId,
    qualification.vsQualification AS qualificationName 
    FROM nw_mams_qualification qualification 
    order by qualification.vsQualification `,

    //all council query 
    councilQuery:`SELECT loksabha.pklLoksabhaConstituencyId AS constituencyId ,
    loksabha.vsConstituencyName AS constituencyName
    FROM nw_mams_constituency_loksabha loksabha 
    ORDER BY loksabha.vsConstituencyName `,

    // all course categories
    courseCategoriesQuery:`SELECT courseCategory. pklCourseCategoryId  AS courseCategoryId,
	courseCategory. vsName  AS courseCategoryName
	FROM nw_coms_course_category courseCategory 
    where courseCategory.fklJvId= ? 
    order by courseCategory.vsName`,

    countryQuery:`SELECT country.pklCountryId,
		country.vsCountryName
		 FROM nw_mams_country as country 
		 WHERE country.pklCountryId = 97 `

};
module.exports = query;
