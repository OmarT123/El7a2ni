
import FilterAppointments from '../../components/FilterAppointments';

const FilterAppointmentsForPatient = () => {
    const id = "65412e405d731e77c33fbc4b";

    return (
        <div className="Appointments-container">
            <div className="appointmentsForPatient">
                <FilterAppointments apiLink={"/filterAppointmentsForPatient?id="+id} />
                
            </div>
        </div>
    )
}

export default FilterAppointmentsForPatient ;