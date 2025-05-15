let query = {
    //All course list query
    allCourseQuery: `SELECT course.pklCourseId AS courseId, 
      course.vsCourseName AS courseName, 
      sector.vsSectorName AS sector,
      config.vsMinQualification AS qualification, 
      config.iTotalCourseDurationInHours AS duration_in_hourse
      FROM nw_coms_course course 
      LEFT JOIN nw_coms_course_config config ON config.fklCourseId = course.pklCourseId
      LEFT JOIN nw_coms_sector sector ON sector.pklSectorId = course.fklSectorId
      WHERE course.bEnabled = 1 AND config.bEnabled = 1
      ORDER BY course.vsCourseName ASC `,
  };
  
  module.exports = query;
  