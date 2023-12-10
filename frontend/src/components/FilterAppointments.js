import {useState} from 'react'
import axios from 'axios'

const FilterAppointments  = ({apiLink}) => {

    const [status , setStatus] = useState('');
    const [date , setDate] = useState('');
    const [appointments , setAppointments] = useState('');
    const [message , setMessage] = useState(null);

    
    const handleSubmit = async(e) => {
        e.preventDefault()
        const FilterData = {}
        if(status !=="")
        FilterData['status'] = status;
        if (date !== "")
        FilterData['date']=date;

        try {
            const response = await axios.get(apiLink, {params : FilterData});
            const apps = response.data;
            if (typeof apps == 'string') {
              setMessage(apps);
            } else {
              setAppointments(apps);
              setMessage("Filtered Appointments Results:");
            }
          } catch (error) {
            
            setMessage("An error occurred while fetching data.");
          }
    }


    return (
        <form className='FilterAppointments'>
            <h3>Filter Appointments </h3>

            <label>status:</label>
            <input
             type="text" 
             value={status}
             onChange={(e)=>setStatus(e.target.value)}
            />
             <label>date:</label>
            <input
             type="date" 
             value={date}
             onChange={(e)=>setDate(e.target.value)}
            />

        <button onClick={handleSubmit}>Filter Appointments</button>
        {message && <h3>{message}</h3>}
        {appointments.length > 0 && (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <div>Status: {appointment.status}</div>
              <div>Date: {appointment.date}</div>
              <div>Doctor: {appointment.doctor && appointment.doctor.name}</div>
            </li>
          ))}
        </ul>
      )}
        </form>
    )
}

export default FilterAppointments ;