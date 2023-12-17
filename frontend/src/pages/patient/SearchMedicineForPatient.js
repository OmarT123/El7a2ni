import SearchMedicine from '../../components/SearchMedicine'
import PatientAuthorization from '../../components/PatientAuthorization'

const SearchMedicineForPatient = ({user}) => {
    return (
        <div className="Medicine-container">
            <div className="SearchMedicinePatient">
                <SearchMedicine apiLink={"/searchMedicinePatient"} />
            </div>
        </div>
    )
}

export default PatientAuthorization(SearchMedicineForPatient)  ;