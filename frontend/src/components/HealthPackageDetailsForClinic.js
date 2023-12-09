import {Link} from 'react-router-dom'
const HealthPackageDetailsForClinic = ({hpackage}) => {
    const pageLink = "/HealthPackageInfo?id="+hpackage._id
    return (
        <Link to={pageLink}>
            <div className='details'>
                <h4>{hpackage.name}</h4>
                <p><b>Price:</b> {hpackage.price} L.E</p>
                <p><b>Doctor Discount:</b> {hpackage.doctorDiscount} %</p>
                <p><b>Family Discount:</b> {hpackage.familyDiscount} %</p>
            </div>
        </Link>
    )
}

export default HealthPackageDetailsForClinic