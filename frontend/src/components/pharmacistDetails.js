//import for date
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Link } from 'react-router-dom'

const PharmacistDetails = ({pharmacist}) => 
{    const pageLink = "/PharmacistApplication?id=" + pharmacist._id

    return (
        <Link to={pageLink}>
        <div className="pharmacist-details">
            <h4>{pharmacist.name}</h4>
            <p><strong>Username: </strong>{pharmacist.username}</p>
            <p><strong>Email: </strong>{pharmacist.email}</p>
            <p><strong>Date of birth: </strong>{pharmacist.birthDate}</p>
            <p><strong>Hourly Rate: </strong>{pharmacist.hourlyRate}</p>
            <p><strong>Affiliation: </strong>{pharmacist.affiliation}</p>
            <p><strong>Educational Background: </strong>{pharmacist.educationalBackground}</p>
            <p>Date/Time registered: {formatDistanceToNow(new Date(pharmacist.createdAt),{addSuffix: true})}</p>
        </div>
        </Link>


    )
}
export default PharmacistDetails