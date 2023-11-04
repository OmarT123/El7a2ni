const PatientDetail = ({patient}) => 
{
    return (
        <div className="details">
            <h4>{patient.name}</h4>
            <p><strong>birthDate: </strong>{patient.birthDate}</p>
            <p><strong>Gender: </strong>{patient.gender}</p>
            <p><strong>mobileNumber: </strong>{patient.mobileNumber}</p>
        </div>
    )
}
export default PatientDetail