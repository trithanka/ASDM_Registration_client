const { save } = require("../services/candidate/candidateService")
const { registerCompany } = require("../services/company/companyService")

exports.candidateRegistrationController=async(req,res)=>{
    const postParams=req.body || {};
    const result=await save(postParams);
    return res.send(result);
}

exports.companyRegistrationController=async(req,res)=>{
    const postParams=req.body || {};
    const result=await registerCompany(postParams);
    return res.send(result);
}