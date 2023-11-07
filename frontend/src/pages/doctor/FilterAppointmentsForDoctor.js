import axios from 'axios'
import {useState,useEffect} from 'react'
import FilterAppointments from '../../components/FilterAppointments'

const FilterAppointmentsForDoctor = () => {
    const id = "65496e4a5c31c981636dc271";

    return (
        <div className="Appointments-container">
            <div className="appointmentsForDoctor">
                <FilterAppointments apiLink={"/filterAppointmentsForDoctor?id="+id} />
            </div>
        </div>
    )
}
export default FilterAppointmentsForDoctor ;
