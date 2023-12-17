
const HealthPackageDetailsForClinic = ({hpackage}) => {
    
    const subscribe = async () => {
        localStorage.setItem('healthPackage', hpackage._id)
        window.location.href = '/CheckoutHealthPackage'
    }

    return (
        <div className='details'>
            <h4>{hpackage.name}</h4>
            <p><b>Price:</b> {hpackage.price} L.E</p>
            <p><b>Doctor Discount:</b> {hpackage.doctorDiscount} %</p>
            <p><b>Family Discount:</b> {hpackage.familyDiscount} %</p>
            <p><b>Medicine Discount:</b> {hpackage.medicineDiscount} %</p>
            <button onClick={subscribe}>Subscribe</button>
        </div>
    )
}

export default HealthPackageDetailsForClinic