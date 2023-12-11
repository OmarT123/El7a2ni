
import FilterAppointments from '../../components/FilterAppointments'
import DoctorAuthorization from '../../components/DoctorAuthorization';

const FilterAppointmentsForDoctor = ({user}) => {
    const id = user._id;

    return (
        <div className="Appointments-container">
            <div className="appointmentsForDoctor">
                <FilterAppointments apiLink={"/filterAppointmentsForDoctor"} />
            </div>
        </div>
    )
}

export default DoctorAuthorization(FilterAppointmentsForDoctor)  ;
