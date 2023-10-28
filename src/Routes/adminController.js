const adminModel = require('../Models/Admin.js');
const doctorModel = require('../Models/Doctor.js');

const viewDocInfo = async(req,res) =>{
    try{
        const doctors = await doctorModel.find({}).sort({createdAt: -1})
        for (let index = 0; index < doctors.length; index++) {
            const element = doctors[index];
            console.log(element.id);
        }
        res.status(200).json(doctors)
    
    }catch(error){
        res.status(400).json({error:error.message})
    }
}
module.exports = {viewDocInfo};