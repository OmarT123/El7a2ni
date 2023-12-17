import {useEffect, useState} from 'react';
import axios from 'axios';
import PatientAuthorization from '../../components/PatientAuthorization';

const Checkout = ({user}) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [apartmentNum, setApartmentNum] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [oldAddresses, setOldAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState('')
    const [amount, setAmount] = useState(0)
    const [wallet, setwallet] = useState(0)
    const [message, setMsg] = useState("done");
    

    useEffect(() => {
        const getOldAddressesAndCartValue = async () => {
            const response = await axios.get('/viewMyCart');
            setwallet(response.data.wallet);
            setAmount(response.data.cart.amountToBePaid);
            await axios.get("/getAllAddresses").then(res => setOldAddresses(res.data))
        }
        
        getOldAddressesAndCartValue()
    }, [message])

    const checkout = async() => {
        if (firstName === '' || lastName === '' || streetAddress === '' || city === '' || state === '' || zipCode === '' || paymentMethod === '')
            alert('Please fill all fields')
        else
        {
            const body = {}
            body['address'] = `${streetAddress},${apartmentNum},${city},${state},${zipCode}`
            body['firstName'] = `${firstName}`
            body['lastName'] = `${lastName}`
            if (paymentMethod === 'card')
            {
                axios.get("/payWithCard",{params:body}).then(res => window.location.href = res.data.url)
            }
            else if (paymentMethod === 'wallet') {
             axios.get("/payWithWallet",{ params: body }).then(
           (res) => {
            if (res.data.message === "done") {
                window.location.href = res.data.url;
            } else {
                setMsg(res.data.message);
            }
        }
    )
}

            else if (paymentMethod === "cash")
            {
                axios.get("/cashOnDelivery",{params:body}).then(res => window.location.href = res.data.url)
            }
            else{
                alert('Please fill all fields')
            }
        }
    }

    const changeAddress = async () => {
        const address = selectedAddress.split(",")
        setStreetAddress(address[0])
        setApartmentNum(address[1])
        setCity(address[2])
        setState(address[3])
        setZipCode(parseInt(address[4]))
    }

    const handleAddressSelect = (event) => {
        const selectedValue = event.target.value;
        setSelectedAddress(selectedValue);
      }

  return (

    <div className='checkout'>
        <h3>Shipping Address</h3>
        <p>wallet: {wallet} </p>
        <hr></hr>
        <div className='checkout-address'>
            <form className='address'>
                <div className='address-name'>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e)=>setFirstName(e.target.value)}
                        placeholder='First Name *'
                    />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e)=>setLastName(e.target.value)}
                        placeholder='Last Name *'
                    />
                </div>
                <input
                    type="text"
                    value={streetAddress}
                    onChange={(e)=>setStreetAddress(e.target.value)}
                    placeholder='Street Address *'
                />
                <input
                    type="text"
                    value={apartmentNum}
                    onChange={(e)=>setApartmentNum(e.target.value)}
                    placeholder='Apartment/Suite #'
                />
                <input
                    type="text"
                    value={city}
                    onChange={(e)=>setCity(e.target.value)}
                    placeholder='City *'
                />
                <input
                    type="text"
                    value={state}
                    onChange={(e)=>setState(e.target.value)}
                    placeholder='State *'
                />
                <input
                    type="number"
                    value={zipCode}
                    onChange={(e)=>setZipCode(e.target.value)}
                    placeholder='Zip Code *'
                />
                <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
                        <option value="NON">Select Payment Method</option>
                        <option value="card">Card</option>
                        <option value="wallet">Wallet</option>
                        <option value="cash">Cash On Delivery</option>
                    </select>
            </form>
            <div className='address order-details'>
                <h3>Order Summary</h3>
                <hr></hr>
                <h5>You have to Pay:</h5>
                <p>{amount}</p>
                {/* <p>Some Item</p>
                <hr />
                <p><strong>Total</strong></p>
                <p>+add promo code</p> */}
            </div>
        </div>
        <div>
            <select onChange={handleAddressSelect} value={selectedAddress}>
                <option value="">Previous Delivery Addresses</option>
                {oldAddresses.length > 0 && oldAddresses.map((address, index) => {
                    return <option key={index} value={address}>{address}</option>
                }
                    )}
            </select>
            <button onClick={changeAddress}>Use Address</button>
        </div>
        <br></br>
        <button onClick={checkout}>Checkout</button>
        {message!=="done" && (
        <p>{message}</p>
      )}
    </div>
  )
}

export default PatientAuthorization(Checkout) 
