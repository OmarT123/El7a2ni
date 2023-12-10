
import FilterAppointments from '../../components/FilterAppointments';
import PatientAuthorization from '../../components/PatientAuthorization';

const FilterAppointmentsForPatient = ({user}) => {
    const id = user._id;

    return (
        <div className="Appointments-container">
            <div className="appointmentsForPatient">
                <FilterAppointments apiLink={"/filterAppointmentsForPatient"} />
                
            </div>
        </div>
    )
}

export default PatientAuthorization(FilterAppointmentsForPatient)  ;