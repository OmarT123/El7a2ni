import { Link } from 'react-router-dom'

const PharmacistDetailsList = ({pharmacist}) => 
{
    const pageLink = "/pharmacist?id=" + pharmacist._id
    return (
        <Link to={pageLink}>
        <div className="pharmacist-details">
            <h4>{pharmacist.name}</h4>
            <p><strong>Username: </strong>{pharmacist.username}</p>
            <p><strong>Affiliation: </strong>{pharmacist.affiliation}</p>
        </div>
        </Link>
    )
}
export default PharmacistDetailsList