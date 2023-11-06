import axios from 'axios'
import {useState,useEffect} from 'react'
import FilterAppointments from '../components/FilterAppointments'

const FilterAppointmentsForDoctor = () => {
    const id = "653e568a25a9d07a9ad10789";

    return (
        <div className="Appointments-container">
            <div className="appointmentsForDoctor">
                <FilterAppointments apiLink={"/filterAppointmentsForDoctor?id="+id} />
            </div>
        </div>
    )
}

export default FilterAppointmentsForDoctor ;
