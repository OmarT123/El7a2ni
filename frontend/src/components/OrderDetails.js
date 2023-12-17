const OrderDetails = ({ Order }) => {
    return (
        <div className="">
            <h4>Order ID: {Order._id}</h4>
            <p><strong>Status: </strong>{Order.status}</p>
            <p><strong>Address: </strong>{Order.address}</p>
            <p><strong>First Name: </strong>{Order.First_Name}</p>
            <p><strong>Last Name: </strong>{Order.Last_Name}</p>
            
                <h4>Items:</h4>
            <div>
                <ul>
                    {Order.items.map((item, index) => (
                        <li key={index}>
                            <p><strong>Medicine: </strong>{item.medicine.name}</p>
                            <p><strong>Quantity: </strong>{item.quantity}</p>
                            <p><strong>Price: </strong>{item.medicine.price}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <p><strong>Total: </strong>{Order.total}</p>
            <p><strong>Payment method: </strong>{Order.paymentMethod}</p>
        </div>
    );
};


export default OrderDetails