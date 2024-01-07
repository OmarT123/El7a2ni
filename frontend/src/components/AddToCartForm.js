import {useEffect, useState} from 'react';
import axios from 'axios';

const AddToCartForm = ({medicine}) => 
{
    const [amount, setAmount] = useState(0)
    const [responseMessage, setResponseMessage] = useState('');

    const addToCart = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('/addToCart', { medicineId:medicine._id, quantity: amount });
          setResponseMessage(response.data.message);
        } catch (error) {
          console.error('Error increasing quantity:', error);
        }
      };

    return (
      <div>
        <form>
            <button key={medicine._id} style={{ marginRight: '10px' }}  onClick={addToCart}> Add to cart</button>
            <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                />
          </form>
          {responseMessage && <div>{responseMessage}</div>}
      </div>
    )
}
export default AddToCartForm