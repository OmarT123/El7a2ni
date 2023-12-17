import axios from 'axios'
import {useState} from 'react'
import PrescriptionDetails from '../../components/doctor/PrescriptionDetails'


/*
********
*******
******
FIX MEDICINE NOT SHOWING NAME
******
*******
********
*/





const Prescription = () => {
    const [prescriptions, setPrescriptions] = useState(null)


    const viewAllPrescription = async (e) => {
        e.preventDefault()
        //temporary id
        const id = "654965e73fe9729145b6ddbd"
        await axios.get("/viewMyPrescriptions?id="+id)
        .then((res)=>{
            setPrescriptions(res.data)
            console.log(res.data)
        }).catch((err)=>console.log(err))
    }

    const filterPrescriptionByDateDoctorStatus = async (e) => {
        e.preventDefault()

        const id="6546851fd349b37530412e8d"
        await axios.get("/filterPrescriptionByDateDoctorStatus")
    }

    return (
        <div className='search-container'>
            <div className='form-container'>
                <form className='create'>
                    <button onClick={viewAllPrescription}>View My Prescription</button>
                </form>
                <form className='create'>
                    <label></label>
                </form>
            </div>
            <div className='search-results'>
                {prescriptions && prescriptions.map((prescription)=>(
                    <PrescriptionDetails key={prescription._id} prescription={prescription}/>
                ))}
            </div>
        </div>
    )
}

export default Prescription