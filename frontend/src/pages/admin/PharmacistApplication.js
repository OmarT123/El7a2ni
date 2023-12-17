import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminAuthorization from '../../components/AdminAuthorization';

const PharmacistApplication = () => {
    const [id, setId] = useState(false)
    const [degree, setDegree] = useState(false)
    const [license, setLicense] = useState(false)
    const [pharmacist, setPharmacist] = useState(null)
    const [pharmacistId  ,setPharmacistId ] = useState(null)
    const [message , setMessage] = useState('');
    useEffect(() => {
        const getPharmacist = async() => {
            const queryParams = new URLSearchParams(window.location.search)
            const id =queryParams.get('id')
            setPharmacistId(id)
            await axios.get("/viewPharmacist?id="+id).then(res => {setPharmacist(res.data); console.log(res.data)})
            
        }
        getPharmacist()
    }, [])
    const accept = async () => {
        try {
            const responseBackEnd = await axios.put("/acceptPharmacist?pharmacistId="+pharmacistId);
            setMessage(responseBackEnd.data.message);
            if(responseBackEnd){
                window.location.href = '/unApprovedPharmacists'
            }
        } catch (error) {
          console.log(error.message);
        }
      };

      const reject = async () => {
        try {
            const responseBackEnd = await axios.put("/rejectPharmacist?pharmacistId="+pharmacistId);
            setMessage(responseBackEnd.data.message);
            if(responseBackEnd){
                window.location.href = '/unApprovedPharmacists'
            }

        } catch (error) {
          console.log(error.message);
        }
      };

    return (
        <div className='application'>
            <div className='horizontal'>
                {id ? <iframe title="PDF Viewer" src={pharmacist.idPDF} width="70%" height="600px" />: <button onClick={()=>{setId(true);setLicense(false);setDegree(false)}}>View ID</button>}
                {degree? <iframe title="PDF Viewer" src={pharmacist.degreePDF} width="70%" height="600px" />: <button onClick={()=>{setId(false);setLicense(false);setDegree(true)}}>View Degree</button>}
                {license? <iframe title="PDF Viewer" src={pharmacist.licensePDF} width="70%" height="600px" />: <button onClick={()=>{setId(false);setLicense(true);setDegree(false)}}>View License</button>} 
            </div>
            <div className='horizontal'>
                <button onClick={accept }>Accept</button>
                <button onClick={reject}>Reject</button>

            </div>
            {message && <div style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}

        </div>
    );


}
export default AdminAuthorization(PharmacistApplication) ;