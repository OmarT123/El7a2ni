const MedicineDetails = ({medicine, show}) => 
{
    return (
        <div className="medicine-details">
            <h4>{medicine.name}</h4>
            <p><strong>Price: </strong>{medicine.price} L.E</p>
            <p><strong>Description: </strong>{medicine.medicinalUse}</p>
            <p><strong>Active Ingredient: </strong>{medicine.activeIngredient}</p>
            {!show && <p><strong>Availability: </strong>{medicine.stockQuantity>0?"Available":"Sold Out"}</p>}
            {show && 
            <div>
                <p><strong>Stock Quantity: </strong>{medicine.stockQuantity}</p>
                <p><strong>Amount Sold: </strong>{medicine.amountSold}</p>
                <p><strong>Archived: </strong>{medicine.archived?"archived":"not archived"}</p>
            </div>}
            {/*picture here*/}
            <br></br>
            <img
            src={medicine.picture}
            alt="Medicine image"
            style={{ maxWidth: '200px', maxHeight: '300px', objectFit: 'contain' }}
            />
        </div>
    )
}
export default MedicineDetails