import axios from 'axios';
import { useRef } from 'react';

const MedicineDetailsPharmacist = ({medicine}) => 

{
    var base64;
    const inputFileRef = useRef(null);

    const handleButtonClick = () => {
        // Trigger the click event on the hidden file input
        inputFileRef.current.click();
    };

    const handleFileChange = () => {
        //Read File
        var selectedFile = document.getElementById(`inputFile_${medicine._id}`).files;
        //Check File is not Empty
        if (selectedFile.length > 0) {
            // Select the very first file from list
            var fileToLoad = selectedFile[0];
            // FileReader function for read the file.
            var fileReader = new FileReader();
            
            // Onload of file read the file content
            fileReader.onload = function(fileLoadedEvent) {
                base64 = fileLoadedEvent.target.result;
                sendToBackEnd();
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);
            
    };
    }

    const sendToBackEnd = async(e) => {
       const body = {id: medicine._id,base64}
       if(base64.substring(0,15) != "data:image/jpeg" && base64.substring(0,14) != "data:image/jpg")
        alert("Only JPEG and JPG formats are allowed for medicine images.");
       else{
       await axios.put("/uploadMedicineImage",body).then(res=> {
        alert(res.data);
        window.location.reload();
        }).catch(err=>console.log(err))
    }
    }

    return (
        <div className="medicine-details">
            
            <h4>{medicine.name}</h4>
            <p><strong>Price: </strong>{medicine.price} L.E</p>
            <p><strong>Description: </strong>{medicine.medicinalUse}</p>
            <p><strong>Stock Quantity: </strong>{medicine.stockQuantity}</p>
            <p><strong>Amount sold: </strong>{medicine.amountSold}</p>
            <strong><p>{medicine.prescriptionMedicine? "This a prescription medicine" : "This is non-prescription medicine" }</p></strong>
            {/*picture here*/}
            <br></br>
            <img
            src={medicine.picture}
            alt="Medicine image"
            style={{ maxWidth: '200px', maxHeight: '300px', objectFit: 'contain' }}
            />
           
           <div>
            <input
                id={`inputFile_${medicine._id}`}
                type="file"
                className="form-control"
                accept="image/jpeg, image/png"
                required
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={inputFileRef}
            />
            <button
                type="button"
                onClick={handleButtonClick}
                style={{ marginTop: '7px' }}
            >
                Upload/Replace Medicine Image
            </button>
            </div>
        </div>
    )
}
export default MedicineDetailsPharmacist

