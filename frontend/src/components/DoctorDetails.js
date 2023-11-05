import {Link} from 'react-router-dom'

const DoctorDetails = ({doctor}) => 
{
    const pageLink = "/doctor?id="+doctor._id
    return (
        <Link to={pageLink}>
            <div className="details">
                    <h4>{doctor.name}</h4>
                    <p><strong>email: </strong>{doctor.email}</p>
                    <p><strong>birthDate: </strong>{doctor.birthDate}</p>
                    <p><strong>hourlyRate: </strong>{doctor.hourlyRate}</p>
                    <p><strong>affiliation: </strong>{doctor.affiliation}</p>
                    <p><strong>speciality: </strong>{doctor.speciality}</p>
                    {doctor.sessionPrice && <p><strong>session price: </strong>{doctor.sessionPrice}</p>}
            </div>
        </Link>
    )
}
export default DoctorDetails