import {Link} from 'react-router-dom'
const PatientDetail = ({patient}) => 
{
    // console.log(patient)
    const link="/patient?id="+patient._id
    // console.log(link)
    return (
            <Link to= {link}>
        <div className="details">
            <h4>{patient.name}</h4>
            <p><strong>birthDate: </strong>{patient.birthDate}</p>
            <p><strong>Gender: </strong>{patient.gender}</p>
            <p><strong>mobileNumber: </strong>{patient.mobileNumber}</p>
        </div>
           </Link>       
    )
}
export default PatientDetail