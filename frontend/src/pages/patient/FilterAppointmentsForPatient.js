
import FilterAppointments from '../../components/FilterAppointments';

const FilterAppointmentsForPatient = () => {
    const id = "654965e73fe9729145b6ddbd";

    return (
        <div className="Appointments-container">
            <div className="appointmentsForPatient">
                <FilterAppointments apiLink={"/filterAppointmentsForPatient?id="+id} />
                
            </div>
        </div>
    )
}

export default FilterAppointmentsForPatient ;