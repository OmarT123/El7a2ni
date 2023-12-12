import axios from 'axios'
import {useState , useEffect} from 'react'
import PatientAuthorization from '../../components/PatientAuthorization';

const ViewMyWallet = ({user}) => {

    const [Wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchWallet= async () => {
      try {
        await axios.get("/ViewMyWallet")
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
  }, []);

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


export default PatientAuthorization(ViewMyWallet);
