
const { save } = require("../services/candidate/candidateService")

exports.candidateRegistrationController=async(req,res)=>{
    const postParams=req.body || {};
    const result=await save(postParams);
    return res.send(result);
}