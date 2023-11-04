const DoctorDetails = ({doctor}) => 
{
    return (
        <div className="details">
            <h4>{doctor.name}</h4>
            <p><strong>email: </strong>{doctor.email}</p>
            <p><strong>birthDate: </strong>{doctor.birthDate}</p>
            <p><strong>hourlyRate: </strong>{doctor.hourlyRate}</p>
            <p><strong>affiliation: </strong>{doctor.affiliation}</p>
            <p><strong>speciality: </strong>{doctor.speciality}</p>
            {doctor.sessionPrice && <p><strong>session price: </strong>{doctor.sessionPrice}</p>}
        </div>
    )
}
export default DoctorDetails