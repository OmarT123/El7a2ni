import {Link} from 'react-router-dom'
const PatientDetail = ({patient}) => 
{
    // console.log(patient)
    const link="/patient?id="+patient._id
    // console.log(link)
    return (
        <Link to={link}>
        <div className="details">
            <h4>{patient.name}</h4>
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
    
          {patient.healthPackage && patient.healthPackage.map((healthPack) => (
             <div key={healthPack._id} className="healthPack-card">
              <p> Health Package Name: {healthPack.name}</p>
            </div>
         ))}
        </div>
    </Link>
     
    )
}
export default PatientDetail