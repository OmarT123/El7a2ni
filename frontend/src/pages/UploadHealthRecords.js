import {useEffect, useState} from 'react';
import axios from 'axios';

const UploadHealthRecords = () => {
    const [documents, setDocuments] = useState([]);
    var base64;
    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get('id')
    function convertToBase64(e) {
        e.preventDefault();
        //Read File
        var selectedFile = document.getElementById("inputFile").files;
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
        }
    }

    const sendToBackEnd = async() => {
    if(base64.substring(0,20) != "data:application/pdf")
      alert('Please upload your documents in the PDF format only.');
    else{
      const body = {id: id,base64}
       await axios.put("/uploadHealthRecord",body).then(res=> {
        alert(res.data);
        window.location.reload();
        }).catch(err=>console.log(err))
    }
    }

    useEffect(() => 
    {
    const loadDocuments = async() => {
        const apiLink = "/getHealthRecords?id=" + id;

        await axios.get(apiLink).then(
            (res)=>{
            setDocuments(res.data);
            })

            .catch(err=>console.log(err))
        }
        loadDocuments();
        },[])
    return(
        <div className='home'>
      <h2>Health Records</h2>
      <div>
          {documents && documents.map((document, index) => (
            <div key={index}>
              <h3>Document {index + 1}</h3>
              <iframe title='PDF Viewer' src={document} width="100%" height="600px"/>
            </div>
          ))}
    </div>
    <label>Upload Health Record</label>
                <input
                id = "inputFile"
                type="file"
                className="form-control"
                accept='application/pdf'
                required
                onChange={(e) => convertToBase64(e)}
                style={{marginTop:"7px"}}
                />
    </div>
    )
}
export default UploadHealthRecords