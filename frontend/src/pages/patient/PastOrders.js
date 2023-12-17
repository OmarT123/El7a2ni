import {useEffect, useState} from 'react';
import axios from 'axios';
import OrderDetails from '../../components/OrderDetails'
import PatientAuthorization from '../../components/PatientAuthorization';



const PastOrders = () => {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/pastOrders');
        setOrders(response.data.orders);
      } catch (error) {
        console.log('Error fetching previous orders:', error);
      }
    };
    fetchOrders();
  }, [orders]);
 
  const cancelOrder = async (Id) => {
    try {
      const response = await axios.put('/cancelOrder', { orderId: Id });
    } catch (error) {
      console.error('Error cancelling the order:', error);
    }
  };
  return (
      <div className="Orders">
        {orders && orders.map((order) => (
         <div key={order._id} >
         <OrderDetails  Order = {order} />
            <div>
              <button   style={{backgroundColor: 'red', color: 'white' }} onClick={() => cancelOrder(order._id)} >Cancel</button>
            </div>
         </div>
        ))}
        {orders.length===0 && (
          <h3>NO Previous Orders To Show</h3>)}
      
      </div>
   
   
  )
}

export default PatientAuthorization(PastOrders)
