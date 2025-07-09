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

    getCandidateById: `SELECT 
        basic.vsFirstName as firstName,
        basic.vsMiddleName as middleName,
        basic.vsLastName as lastName,
        basic.dtDOB as dob,
        basic.vsGender as gender,
        basic.vsFatherName as fatherName,
        basic.vsMotherName as motherName,
        basic.idType,
        religion.vsReligionName as religion,
        caste.vsCasteName as caste,
        qual.vsQualification as qualification,
        contact.vsPrimaryMobileNo as mobile,
        contact.vsOtherMobileNo as mobile2,
        contact.vsPrimaryEmail as email,
        basic.pklCandidateId
    FROM
        nw_candidate_basic_dtl basic
    LEFT JOIN 
        nw_mams_religion religion ON basic.fklRelegionId = religion.pklReligionId
    LEFT JOIN 
        nw_candidate_caste_dtl candidateCaste ON candidateCaste.fklCandidateId = basic.pklCandidateId 
    LEFT JOIN 
        nw_mams_caste caste ON candidateCaste.fklCasteCategoryId = caste.pklCasteId
    LEFT JOIN 
        nw_candidate_qualification_dtl candidateQual ON candidateQual.fklCandidateId = basic.pklCandidateId
    LEFT JOIN 
        nw_mams_qualification qual ON qual.pklQualificationId = candidateQual.fklQualificationId
    LEFT JOIN 
        nw_candidate_contact_dtl contact ON contact.fklCandidateId = basic.pklCandidateId
    WHERE basic.pklCandidateId=? `,

    getMelaDetails: ` SELECT distinct 
        mela.pklMelaId as melaId,
        mela.vsVenueName as melaName
        FROM nw_jobmela_applicant_dtl applicant
        INNER JOIN nw_jobmela_job_dtl job ON applicant.fklJobId = job.pklJobId
        LEFT JOIN nw_jobmela_mela_dtl mela ON job.fklMelaId= mela.pklMelaId

        WHERE applicant.fklcandidateId = ? `,

        getJobDetails: ` SELECT 
            mela.pklMelaId AS melaId,
            mela.vsVenueName as melaName,
            job.vsPostName as postname,
            job.vsSelectionProcedure,
            applicant.vsStatus as status,
            DATE(applicant.dtCreatedDate) as appliedDate,
            entity.vsEntityName as companyName,
            entity.pklEntityId as companyId
        FROM nw_jobmela_applicant_dtl applicant
        INNER JOIN nw_jobmela_job_dtl job ON applicant.fklJobId = job.pklJobId
        LEFT JOIN nw_jobmela_mela_dtl mela ON job.fklMelaId= mela.pklMelaId
        left join nw_enms_entity entity on job.fklEmployerId = entity.pklEntityId

        WHERE  applicant.fklcandidateId = ? `,
        getAddressDetails: `
                select 
                    address.fklCandidateId,
                    address.vsAddressType as addressType,
                    address.vsAreaType,
                    address.vsAddress as address,
                    address.vsCityName as city,
                    address.vsPostOffice as postOffice,
                    address.vsPinCode as pinCode,
                    address.vsPoliceStation as policeStation,
                    state.vsStateName as state,
                    state.pklStateId as stateId,
                    district.vsDistrictName as district,
                    district.pklDistrictId as districtId,
                    taluka.vsTalukaName as taluka,
                    taluka.pklTalukaId as talukaId,
                    ulb.vsUlbName as ulb,
                    ulb.pklUlbId as ulbId,
                    assembly.vsConstituencyName as assemblyConstituency,
                    assembly.pklAssemblyConstituencyId as assemblyConstituencyId,
                    loksabha.vsConstituencyName as loksabhaConstituency,
                    loksabha.pklLoksabhaConstituencyId as loksabhaConstituencyId,
                    address.vsNationality as nationality
                from
                    nw_candidate_address_dtl address
                left join nw_mams_state state on address.fklStateId= state.pklstateId
                left join nw_mams_district district on address.fklDistrictId = district.pklDistrictId
                left join nw_mams_taluka taluka on address.fklTalukaId = taluka.pklTalukaId
                left join nw_mams_ulb ulb on address.fklUlbId = ulb.pklUlbId
                left join nw_mams_constituency_assembly assembly on address.fklAssemblyConstituencyId = assembly.pklAssemblyConstituencyId
                left join nw_mams_constituency_loksabha loksabha on address.fklLoksabhaConstituencyId =  loksabha.pklLoksabhaConstituencyId
                where address.fklCandidateId = ? `,
        getSkillDetails: `select 
                skill.pklCandidateSkill as skillId,
                skill.vsSkill as skill,
                skill.fklCandidateId as candidateId
                from nw_jpms_candidate_skills skill
                where skill.fklcandidateId = ? `,
};

module.exports = query;
