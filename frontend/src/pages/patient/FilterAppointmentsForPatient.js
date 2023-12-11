
import FilterAppointments from '../../components/FilterAppointments';

const FilterAppointmentsForPatient = () => {
    const id = "656cb41125a74d947f10e349";

    return (
        <div className="Appointments-container">
            <div className="appointmentsForPatient">
                <FilterAppointments apiLink={"/filterAppointmentsForPatient?id="+id} />
                
            </div>
        </div>
    )
}

export default FilterAppointmentsForPatient ;