import {Link} from 'react-router-dom'

const PrescriptionDetails = ({prescription}) => 
{
    const pageLink = "/prescription?id="+prescription._id
    return (
        <Link to={pageLink}>
            <div className="details">
                    <p><strong>status: </strong>{prescription.filled? "filed":"not filled"}</p>
                    <p><strong>doctor: </strong>{prescription.doctor && prescription.doctor.name}</p>
                    <p><strong>medicine: </strong>{prescription.medicines.map(med=><p>{med.medId && med.medId.name} {med.dosage}</p>)}</p>
            </div>
        </Link>
    )
}
export default PrescriptionDetails