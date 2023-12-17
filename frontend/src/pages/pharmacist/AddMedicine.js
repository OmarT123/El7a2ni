import axios from 'axios'
import {useState} from 'react'
import PharmacistAuthorization from '../../components/PharmacistAuthorization'

const AddMedicine = ({user}) => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [stockQuantity, setStockQuantity] = useState(0)
    const [medicinalUse, setMedicinalUse] = useState('')
    const [activeIngredient, setActiveIngredient] = useState('')

    
    const createMedicine = async(e) => {
        e.preventDefault()

        if (name === '' || price === 0 || medicinalUse === '' || activeIngredient === '')
            alert('Please Fill all fields')
        else {
            const body = {name, price,stockQuantity, medicinalUse, activeIngredient}
            await axios.post("/addMedicine",body).then((res)=>alert(res.data)).catch(err=>console.log(err))
        }

    }

    return (
        <form className='edit'>
            <h3>Add Medicine</h3>

            <label>Name:</label>
            <input 
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />


            <label>Price:</label>
            <input 
            type="number"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            />

            
            <label>Stock Quantity:</label>
            <input 
            type="number"
            value={stockQuantity}
            onChange={(e)=>setStockQuantity(e.target.value)}
            />

            
            <label>Medicinal Use:</label>
            <input 
            type="text"
            value={medicinalUse}
            onChange={(e)=>setMedicinalUse(e.target.value)}
            />

            
            <label>Active Ingredient:</label>
            <input 
            type="text"
            value={activeIngredient}
            onChange={(e)=>setActiveIngredient(e.target.value)}
            />

            <button onClick={createMedicine}>Add</button>

        </form>
    )
    
}

export default PharmacistAuthorization(AddMedicine) ;