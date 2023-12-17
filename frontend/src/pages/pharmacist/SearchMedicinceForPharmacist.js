
import SearchMedicine from '../../components/SearchMedicine'
import PharmacistAuthorization from '../../components/PharmacistAuthorization'

const SearchMedicineForPharmacist = () => {
    return (
        <div className="Medicine-container">
            <div className="SeachMedicinePharmacist">
                <SearchMedicine apiLink={"/searchMedicinePharmacist"} />
            </div>
        </div>
    )
}

export default PharmacistAuthorization(SearchMedicineForPharmacist)  ;