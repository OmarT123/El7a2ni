import {Link} from 'react-router-dom'

const PatientDetail = ({patient}) => 
{
    const link="/patient?id="+patient._id
    
    return (
        <Link to={link}>
        <div className="details">
            <h4><strong> Name: </strong>{patient.name}</h4>
            <p><strong>Birth Date: </strong>{patient.birthDate}</p>
            <p><strong>Gender: </strong>{patient.gender}</p>
            <p><strong>Mobile Number: </strong>{patient.mobileNumber}</p>
            <p><strong>Emergency Contact: </strong>{patient.emergencyContact.name},
             {patient.emergencyContact.mobileNumber}, 
             {patient.emergencyContact.relation}</p>
                
            {patient.familyMembers && patient.familyMembers.map((familyMember) => (
            <div key={familyMember._id} className="familyMember-card">
            <p>Family Member Name: {familyMember.name}</p>
            <p>Family Member Relation: {familyMember.relationToPatient}</p>
            </div>
                ))}

            <Link to={`/uploadHealthRecords?id=${patient._id}`}>
                <button>Upload Health Records</button>
            </Link>

            <Link to={`/AddAppointmentSlot?id=${patient._id}`}>
                <button>Schedule Followup</button>
            </Link>
            
        </div>
    </Link>
     
    )
}
export default PatientDetail