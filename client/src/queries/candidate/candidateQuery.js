"use strict";

const query = {
  email1DuplicateCheck: `SELECT COUNT(DISTINCT contactDtl.fklCandidateId) AS candidateCount
        FROM nw_candidate_contact_dtl contactDtl
        WHERE contactDtl.vsPrimaryEmail=?`,

  mobile1DuplicateCheck: `SELECT COUNT(DISTINCT contactDtl.fklCandidateId) AS candidateCount
        FROM nw_candidate_contact_dtl contactDtl
        WHERE contactDtl.vsPrimaryMobileNo = ?`,
  getCandidateCount: `SELECT COUNT(openPool.pklOpenPoolId) AS rowCount 
        FROM nw_candidate_open_pool openPool FOR UPDATE`,
  saveBasicDetails: `INSERT INTO nw_candidate_basic_dtl
        (fklJvId, vsFirstName, vsMiddleName, vsLastName,
        vsCertName, vsFatherName, vsMotherName, vsEmpExchangeNo, dtDOB,
        UUID, vsGender, fklRelegionId, fklRegistrationTypeId,
        dtRegistrationDate, bIsBPLCardHolder, bIsAntodayaCardHolder, bIsNregaCardHolder,
        bIsMinority, bIsBoCw, bIsTeaTribeMinoriy, idType, vsStatus)
        VALUES
        (?,?,?,?,
        ?,?,?,?,
        ?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?)`,
        saveCastDetails:`INSERT INTO nw_candidate_caste_dtl (fklCandidateId,fklCasteCategoryId) VALUES (?,?) `,
  saveContactDetails: `INSERT INTO nw_candidate_contact_dtl
        (fklCandidateId, vsPrimaryMobileCountryCode, vsPrimaryMobileNo, 
        vsOtherMobileNo, vsPrimaryEmail, dtModified) 
        VALUES(?,?,?,?,?,?)`,
  saveQualificationDetails: `INSERT INTO nw_candidate_qualification_dtl
        (fklCandidateId, fklQualificationId)
        VALUES(?,?)`,
        saveCoursePreference: `INSERT INTO nw_candidate_course_preference
        (fklJvId, fklCandidateId, fklDistrictId, fklTalukaId, 
        fklCourseId, dtModifiedDate) 
        VALUES(?,?,?,?,?,?)`,
        saveDisabilityDetails: `INSERT INTO nw_candidate_disability_dtl
        (fklCandidateId, bIsDisability, dtModified) 
        VALUES (?,?,?)`,
        saveAddressDetails: `INSERT INTO nw_candidate_address_dtl
        (fklCandidateId, dtModified, fklCountryId, fklStateId, 
        fklDistrictId, fklTalukaId, fklUlbId, vsAreaType, vsAddress,
        vsCityName, vsPoliceStation, vsPinCode, vsAddressType,
        fklAssemblyConstituencyId, fklLoksabhaConstituencyId,
        vsPostOffice)
        VALUES
        (?,?,?,?,
        ?,?,?,?,?,
        ?,?,?,?,
        ?,?,?)`,
        getDistrictName: `SELECT district.vsDistrictName AS districtName 
        FROM nw_mams_district district 
        WHERE district.pklDistrictId IN (?) 
        ORDER BY district.pklDistrictId `,
        getSectorName: `SELECT sector.vsSectorName AS sectorName 
        FROM nw_coms_sector sector 
        WHERE sector.fklJvId=? and sector.pklSectorId in (?) 
        ORDER BY sector.pklSectorId `,

        // Notification related queries
    updateNotificationStatus: `UPDATE nw_candidate_basic_dtl basic 
    SET basic.bSMSSent = ?,
        basic.bMailSent = ?,
        basic.vsReferenceNumber = ? 
    WHERE basic.pklCandidateId = ?`,
};

module.exports = query;
