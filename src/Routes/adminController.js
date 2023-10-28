const adminModel = require('../Models/Admin.js');
const doctorModel = require('../Models/Doctor.js');

const viewDocInfo = async(req,res) =>{
    try
    {
        const doctors = doctorModel.find({pendingApproval:true}).populate().then((doctors) => res.json(doctors))
    }
    catch(err)
    {
        res.json({message:err.message})
    }
}
module.exports = {viewDocInfo};