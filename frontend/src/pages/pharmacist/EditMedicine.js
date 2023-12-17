import {useState} from 'react'
import axios from 'axios'
import PharmacistAuthorization from '../../components/PharmacistAuthorization';

const EditMedicine  = ({user}) => {


    const [name , setName] = useState('');
    const [price, setPrice] = useState(0);
    const [stockQuantity, setStockQuantity] = useState(0);
    const [message , setMessage] = useState(null);

    const handleSubmit = async(e) => {
        e.preventDefault()


        const MedicineData = {}
        if(name !=="")
        MedicineData['name'] = name;
        if (price !== 0)
        MedicineData['price']=price;
        if (stockQuantity !== 0)
        MedicineData['stockQuantity']=stockQuantity;
 
        const response = await axios.put("/editMedicine",MedicineData)
        setMessage(response.data);


    }

    return (
        <form className='edit'>
            <h3>Edit Medicine</h3>

            <label>Name :</label>
            <input
             type="text" 
             value={name}
             onChange={(e)=>setName(e.target.value)}
            />

            <label>Price :</label>
            <input
             type="number" 
             value={price}
             onChange={(e)=>setPrice(e.target.value)}
            />

            <label> stockQuantity :</label>
            <input
             type="number" 
             min={0}
             value={stockQuantity}
             onChange={(e)=>setStockQuantity(e.target.value)}
            />

           <p/>

            <button onClick={handleSubmit}>Edit Medicine</button>
            {message && <h3>{message}</h3>}
        </form>
    )
}

export default PharmacistAuthorization(EditMedicine)  ;