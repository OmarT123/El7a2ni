import axios from 'axios'
import {useState , useEffect} from 'react'


const ViewMyWallet = () => {

    const [Wallet, setWallet] = useState(null);
    const id = "6574ba9399c7ac25ed46c98f"

  useEffect(() => {
    const fetchWallet= async () => {
      try {
        await axios.get("/ViewDoctorWallet?id="+id)
        .then((res)=>{
            setWallet(res.data)
            console.log(res.data)
        }).catch((err)=>console.log(err))
    

      } catch (error) {
        console.error('Error Wallet:', error.message);
      }
    };
    fetchWallet()
    ;
  }, [id]);

  return (
    <div>
      <h2>view my wallet</h2>
      {Wallet !== null ? (
      <div>
        <p>Amount in Wallet: {Wallet}</p>
      </div>
    ) : (
      <p>No money in Wallet</p>
    )}
  </div>
  );
};


export default ViewMyWallet
