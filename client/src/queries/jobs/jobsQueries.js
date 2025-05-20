let query={
    //All jobs list query
    allJobsListQuery:`SELECT job.pklJobid AS jobId, 
    job.vsJobName AS job_name, 
    company.pklEntityId AS companyId,
    company.vsEntityName AS company_name,
    dist.vsDistrictName AS company_district,
    job.iMinSalary AS min_salary,
    job.iMaxSalary AS max_salary
    FROM nw_emms_jobs job
    LEFT JOIN nw_emms_employer_details employer ON employer.fklEntityId = job.fklEmployerId
    LEFT JOIN nw_enms_entity company ON company.pklEntityId = employer.fklEntityId
    LEFT JOIN nw_emms_job_location location ON location.fkljobId = job.pklJobid
    LEFT JOIN nw_mams_district dist ON dist.pklDistrictId = location.fklDistrictId
    WHERE job.bEnabled = 1 AND company.bEnabled = 1
    ORDER BY job.dtCreationDate DESC `,

    //Total jobs list count query
    totalJobsListQuery:`SELECT COUNT(DISTINCT job.pklJobid) AS total
    FROM nw_emms_jobs job
    LEFT JOIN nw_emms_employer_details employer ON employer.fklEntityId = job.fklEmployerId
    LEFT JOIN nw_enms_entity company ON company.pklEntityId = employer.fklEntityId
    WHERE job.bEnabled = 1 AND company.bEnabled = 1 `,

    //job details by ID with company details
    jobDetailsByIdQ:` SELECT 
    job.pklJobid AS jobId,
    job.vsJobName AS job_name,
    job.vsJobDescription AS job_description,
    job.iVacancies AS job_vacancies,
    job.vsEmploymentType AS job_type,
    sector.vsSectorName AS job_sector,
    job.iMinSalary AS min_salary,
    job.iMaxSalary AS max_salary,
    state.vsStateName AS job_location_state,
    dist.vsDistrictName AS job_location_dist,
    eligibility.iMinExperience AS min_exp,
    eligibility.iMaxExperience AS max_exp,
    eligibility.iAgeOnDate AS min_age,
    gender.vsGenderName AS req_gender,
	DATE(job.dtRecruitmentStart) AS startDate,
    DATE(job.dtRecruitmentEnd) AS endDate,
    qualification.vsQualification AS req_qualification,
	eligibility.vsSkillRequired AS req_skills,
    company.pklEntityId AS companyId,
    company.vsEntityName AS company_name,
    employer.vsArea AS company_area,
    employer.vsCityName AS company_city,
    employer.vsPINCode AS company_PIN,
	employer.vsOrganisationDescription AS company_description,
	company_state.vsStateName AS company_state,
    company_dist.vsDistrictName AS company_dist,
    hr.vsHRName AS hr_name,
	hr.vsMobileNumber AS hr_mobile,
    hr.vsEmailId AS hr_email
FROM nw_emms_jobs job
LEFT JOIN nw_coms_sector sector ON sector.pklSectorId = job.fklSectorId
LEFT JOIN nw_emms_job_location location ON location.fkljobId = job.pklJobid
LEFT JOIN nw_mams_state state ON state.pklStateId = location.fklStateId
LEFT JOIN nw_mams_district dist ON dist.pklDistrictId = location.fklDistrictId
LEFT JOIN nw_emms_job_eligibility eligibility ON eligibility.fklJobId = job.pklJobid
LEFT JOIN nw_mams_gender gender ON gender.pklGenderId = eligibility.fklGenderId
LEFT JOIN nw_mams_qualification qualification ON qualification.pklQualificationId = eligibility.fklQualification
LEFT JOIN nw_emms_employer_details employer ON employer.fklEntityId = job.fklEmployerId
LEFT JOIN nw_enms_entity company ON company.pklEntityId = employer.fklEntityId
LEFT JOIN nw_mams_district company_dist ON company_dist.pklDistrictId = employer.fklDistrictId
LEFT JOIN nw_mams_state company_state ON company_state.pklStateId = employer.fklStateId
LEFT JOIN (
    SELECT fklEntityId, MIN(vsHRName) AS vsHRName, MIN(vsMobileNumber) AS vsMobileNumber, MIN(vsEmailId) AS vsEmailId
    FROM nw_emms_employer_hr
    GROUP BY fklEntityId
) hr ON hr.fklEntityId = company.pklEntityId
WHERE job.pklJobid = ? `,
}

module.exports=query;