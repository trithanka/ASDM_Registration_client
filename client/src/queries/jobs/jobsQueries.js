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
    WHERE job.bEnabled = 1 AND company.bEnabled = 1 `
}

module.exports=query;