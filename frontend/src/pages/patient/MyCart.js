import { useEffect, useState } from 'react';
import axios from 'axios';
import PatientAuthorization from '../../components/PatientAuthorization';
const MyCart = ({user}) => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMsg] = useState("");
  const [amount, setAmount] = useState(0);
  const [wallet, setwallet] = useState(0);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/viewMyCart');
        const cartData = response.data.cart;
        setwallet(response.data.wallet);
        setCartItems(cartData.items);
        setAmount(cartData.amountToBePaid);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [cartItems,amount,message]);


  const removeFromCart = async (medicineId) => {
    try {
      const response = await axios.put('/removeFromCart', { medicineId });
      setMsg(response.data.message);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const increaseQuantity = async (medicineId) => {
    try {
      const response = await axios.put('/increaseByOne', { medicineId });
      setMsg(response.data.message);
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const decreaseQuantity = async (medicineId) => {
    try {
      const response = await axios.put('/decreaseByOne', { medicineId });
      setMsg(response.data.message);
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const checkout = async() => {
    console.log('clicked')
    window.location.href = '/checkout'
  }

  return (
    <div className="cart">
      <h2>Your Cart  </h2>
      <p>wallet: {wallet} </p>
      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="medicine-details">
                <h4>{item.medicine.name}</h4>
                <p><strong>Price: </strong>{item.medicine.price} L.E</p>
                <p><strong>Quantity: </strong>{item.quantity}</p>
                <br></br>
                <img
                src={item.medicine.picture}
                alt="Medicine image"
                style={{ maxWidth: '200px', maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
              <button   style={{ marginRight: '10px' , backgroundColor: 'grey', color: 'black' }} onClick={() => increaseQuantity(item.medicine._id)}>+</button>
              <button   style={{ marginRight: '10px' , backgroundColor: 'grey', color: 'black' }} onClick={() => decreaseQuantity(item.medicine._id)}>-</button>
              <button   style={{backgroundColor: 'red', color: 'white' }} onClick={() => removeFromCart(item.medicine._id)}>Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty</p>
       
      )}
        {cartItems.length > 0 && (
        <p>{message}</p>
      )}
      <br></br>
      {
      cartItems.length > 0 && (
        <h5>Total amount</h5>)
      }
      {
      cartItems.length > 0 && (
        <p>{amount}</p>)
      }
      
      <br></br>
      {cartItems.length > 0 && (
        <button className="proceed-to-checkout-btn" style={{ backgroundColor: 'green', color: 'white' }} onClick={checkout}>
          Proceed to Checkout
        </button>
      )}
           <br></br>
        <a href="/PatientGetMedicine">
          <button>Back</button>
        </a>
    </div>
  );
};

export default PatientAuthorization(MyCart);
