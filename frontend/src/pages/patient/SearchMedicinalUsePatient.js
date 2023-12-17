import SearchMedicinalUse from '../../components/SearchMedicinalUse';
import PatientAuthorization from '../../components/PatientAuthorization';

const SearchMedicinalUsePatient = ({ user }) => {
  return (
    <div>
        <SearchMedicinalUse apiLink={"/filterByMedicinalUsePatient"} show={false} />
    </div>
  );
};

export default PatientAuthorization(SearchMedicinalUsePatient) ;
