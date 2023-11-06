import {Link} from 'react-router-dom'
const HealthPackageDetails = ({hpackage}) => {
    const pageLink = "/HealthPackageInfo?id="+hpackage._id
    return (
        <Link to={pageLink}>
            <div className='details'>
                <h4>{hpackage.name}</h4>
                <p><b>Price:</b> {hpackage.price} L.E</p>
            </div>
        </Link>
    )
}

export default HealthPackageDetails