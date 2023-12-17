import SearchMedicinalUse from '../../components/SearchMedicinalUse'
import PharmacistAuthorization from '../../components/PharmacistAuthorization';

const SearchMedicinalUsePharmacist = () => {
    return (
        <div>
            <SearchMedicinalUse apiLink={"/filterByMedicinalUsePharmacist"} show={true}/>
        </div>
    )
}

export default PharmacistAuthorization(SearchMedicinalUsePharmacist)  ;