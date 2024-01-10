import axios from 'axios';
import {
    Button,
    Box,
    TextField,
} from "@mui/material";

const AddToCartForm = ({ medicine, setAlert }) => {

    const addToCart = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        try {
            const response = await axios.post('/addToCart', { medicineId: medicine._id, quantity: data.get("quantity") });
            setAlert(response.data);
        } catch (error) {
            console.error('Error increasing quantity:', error);
        }
    };

    return (
        <Box component={"form"} onSubmit={addToCart} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                id="quantity"
                label="Enter quantity here"
                type="number"
                placeholder="Enter quantity here"
                required
                name="quantity"
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{ width: "70%", marginLeft: '200px', marginTop: '25px' }}
            />
            <Button variant="contained" sx={{ m: "30px", marginTop: '54px' }} type="submit">
                Submit
            </Button>
        </Box>
    )
}
export default AddToCartForm