let query = {
  //All course list query
  allCourseQuery: `SELECT distinct(course.pklCourseId) AS courseId, 
    course.vsCourseName AS courseName, 
    sector.vsSectorName AS sector,
    config.vsMinQualification AS qualification, 
    config.iTotalCourseDurationInHours AS duration_in_hourse
    FROM nw_coms_course course 
    LEFT JOIN nw_coms_course_config config ON config.fklCourseId = course.pklCourseId
    LEFT JOIN nw_coms_sector sector ON sector.pklSectorId = course.fklSectorId
    WHERE course.bEnabled = 1 AND config.bEnabled = 1 
    ORDER BY course.vsCourseName ASC `,

  //total course count
  totalCourseQuery: `SELECT COUNT(distinct course.pklCourseId) AS total
    FROM nw_coms_course course
    LEFT JOIN nw_coms_course_config config ON config.fklCourseId = course.pklCourseId
    WHERE course.bEnabled = 1 AND config.bEnabled = 1 
    `,

  //course details with tc details by courseID
  courseDetailsByIdQ: `SELECT course.pklCourseId AS courseId, 
    course.vsCourseName AS course_name, 
    course.vsCourseCode AS QPNOS,
    course.vsCourseDescription AS course_description, 
    category.vsName AS course_category, 
    sector.vsSectorName AS sector, 
    config.vsMinQualification AS min_qualification, 
    config.iTotalCourseDurationInHours AS duration,
    COUNT(candidate.fklCandidateId) AS enrolled_candidate
    FROM nw_coms_course course
    LEFT JOIN nw_coms_course_category category ON category.pklCourseCategoryId = course.fklCourseCategoryId
    LEFT JOIN nw_coms_sector sector ON sector.pklSectorId = course.fklSectorId
    LEFT JOIN nw_coms_course_config config ON config.fklCourseId = course.pklCourseId
    LEFT JOIN nw_bams_master_batch master_batch ON master_batch.fklCourseId = course.pklCourseId
    LEFT JOIN nw_bams_batch batch ON batch.fklMasterBatchId = master_batch.pklMasterBatchId
    LEFT JOIN nw_bams_batch_candidate candidate ON candidate.fklBatchId = batch.pklBatchId
    WHERE course.pklCourseId = ? `,

    //TC details by course ID
    TCDetailsByCourseIDQ:`SELECT tc.pklEntityId AS TCId, 
    tc.vsEntityName AS training_center, 
    tc.vsSpocName AS spoc_name,
    tc.vsEmail1 AS spco_email, 
    tc.vsMobile1 AS spoc_mobile, 
    address.vsAddress AS tc_address,
    dist.vsDistrictName AS tc_district
    FROM nw_enms_entity tc
    LEFT JOIN nw_enms_entity_address address ON address.fklEntityId = tc.pklEntityId AND tc.fklRoleId = 4
    LEFT JOIN nw_mams_district dist ON dist.pklDistrictId = address.fklDistrictId 
    LEFT JOIN nw_bams_batch batch ON batch.fklCenterId = tc.pklEntityId AND tc.fklRoleId = 4
    LEFT JOIN nw_bams_master_batch master ON master.pklMasterBatchId = batch.fklMasterBatchId
    LEFT JOIN nw_coms_course course ON course.pklCourseId = master.fklCourseId
    WHERE course.pklCourseId = ?
    GROUP BY tc.pklEntityId 
    ORDER BY tc.vsEntityName `,

    //Total TCs by course ID
    totalTcsByCourseIDQ:`SELECT COUNT(distinct tc.pklEntityId) AS total
    FROM nw_enms_entity tc
    LEFT JOIN nw_enms_entity_address address ON address.fklEntityId = tc.pklEntityId AND tc.fklRoleId = 4
    LEFT JOIN nw_mams_district dist ON dist.pklDistrictId = address.fklDistrictId 
    LEFT JOIN nw_bams_batch batch ON batch.fklCenterId = tc.pklEntityId AND tc.fklRoleId = 4
    LEFT JOIN nw_bams_master_batch master ON master.pklMasterBatchId = batch.fklMasterBatchId
    LEFT JOIN nw_coms_course course ON course.pklCourseId = master.fklCourseId
    WHERE course.pklCourseId = ? `,
};

module.exports = query;
