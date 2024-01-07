
const FreeAppointment = ({ appointment }) => {
    
    const reserveAppointment = () => {
        // console.log('here')
        localStorage.setItem('appointment', appointment.appointment._id)
        window.location.href = '/CheckoutAppointment'
    }

    return (
        <div>
            <div>Status: {appointment.appointment.status}</div>
            <div>Date: {appointment.appointment.date.substr(0, 10)}</div>
            <div>Time: {appointment.appointment.date.substr(11, 5)}</div>
            <div>Doctor: {appointment.appointment.doctor && appointment.appointment.doctor.name}</div>
            <div>Price: {appointment.appointment.price}</div>
            <button onClick={reserveAppointment}>Reserve</button>
            <hr/>
        </div>
    )
}

export default FreeAppointment