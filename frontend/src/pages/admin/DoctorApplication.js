import { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorApplication = () => {
    const [id, setId] = useState(false);
    const [degree, setDegree] = useState(false);
    const [license, setLicense] = useState(false);
    const [Doctor, setDoctor] = useState(null);
    const doctorId = "6574ba9399c7ac25ed46c98f";

    useEffect(() => {
        const getDoctor = async () => {
            try {
                const response = await axios.get("/getADoctor?id=" + doctorId);
                setDoctor(response.data);
            } catch (error) {
                console.log(error.message);
            }
        };
        getDoctor();
    }, []);

    const accept = async () => {
        try {
            const responseBackEnd = await axios.put("/acceptDoctor?doctorId=" + doctorId);
        } catch (error) {
            console.log(error.message);
        }
    };

    const reject = async () => {
        try {
            const responseBackEnd = await axios.put("/rejectDoctor?doctorId=" + doctorId);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='application'>
            {Doctor && (
                <div>
                    <div className='doctor-info'>
                        <p><strong>Name: </strong>{Doctor.name}</p>
                        <p><strong>Birth Date: </strong>{new Date(Doctor.birthDate).toLocaleDateString()}</p>
                        <p><strong>Affiliation: </strong>{Doctor.affiliation}</p>
                        <p><strong>Email: </strong>{Doctor.email}</p>
                        <p><strong>Background Education: </strong>{Doctor.educationalBackground.join(', ')}</p>
                        <p><strong>Hourly Rate: </strong>{Doctor.hourlyRate}</p>
                        <p><strong>Speciality: </strong>{Doctor.speciality}</p>
                        {/* Add more details as needed */}
                    </div>

                    <div className='horizontal'>
                        {id ? <iframe title="PDF Viewer" src={Doctor.idPDF} width="90%" height="600px" /> : <button onClick={() => { setId(true); setLicense(false); setDegree(false) }}>View ID</button>}
                        {degree ? <iframe title="PDF Viewer" src={Doctor.degreePDF} width="90%" height="600px" /> : <button onClick={() => { setId(false); setLicense(false); setDegree(true) }}>View Degree</button>}
                        {license ? <iframe title="PDF Viewer" src={Doctor.licensePDF} width="90%" height="600px" /> : <button onClick={() => { setId(false); setLicense(true); setDegree(false) }}>View License</button>}
                    </div>

                    <div className='horizontal'>
                        <button onClick={accept}>Accept</button>
                        <button onClick={reject}>Reject</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorApplication;
