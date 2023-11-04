const DoctorDetails = ({doctor}) => 
{
    return (
        <div className="doctor-details">
            <h4>{doctor.name}</h4>
            <p><strong>Username: </strong>{doctor.username}</p>
            <p><strong>Email: </strong>{doctor.email}</p>
            <p><strong>Date of birth: </strong>{doctor.birthDate}</p>
            <p><strong>Speciality: </strong>{doctor.speciality}</p>
            <p><strong>Hourly Rate: </strong>{doctor.hourlyRate}</p>
            <p><strong>Affiliation: </strong>{doctor.affiliation}</p>
            <p><strong>Educational Background: </strong>{doctor.educationalBackground}</p>
            <p>Date registered: {doctor.createdAt}</p>
        </div>
    )
}
export default DoctorDetails