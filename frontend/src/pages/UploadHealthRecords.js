import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UploadHealthRecords = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  var base64;
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get('id');

  function convertToBase64(e) {
    e.preventDefault();
    // Read File
    var selectedFile = document.getElementById("inputFile").files;
    // Check File is not Empty
    if (selectedFile.length > 0) {
      // Select the very first file from list
      var fileToLoad = selectedFile[0];
      // FileReader function for read the file.
      var fileReader = new FileReader();
      // Onload of file read the file content
      fileReader.onload = function (fileLoadedEvent) {
        base64 = fileLoadedEvent.target.result;
        sendToBackEnd();
      };
      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);
    }
  }

  const sendToBackEnd = async () => {
    if (base64.substring(0, 20) !== "data:application/pdf")
      alert('Please upload your documents in the PDF format only.');
    else {
      const body = { id: id, base64 };
      await axios.put("/uploadHealthRecord?id=" + id, body)
        .then(res => {
          alert(res.data);
          window.location.reload();
        })
        .catch(err => console.log(err))
    }
  }

  const deleteHealthRecord = async (index) => {
    try {
      const body = {index : index};
      const response = await axios.put("/deleteHealthRecord?id=" + id, body);
      alert(response.data);
      // Reload the documents after deletion
      loadDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  const loadDocuments = async () => {
    const apiLink = "/getHealthRecords?id=" + id;
    try {
      const res = await axios.get(apiLink);
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [id]);

  const renderDocuments = () => {
    if (loading) {
      return <p>Loading health records...</p>;
    }

    if (documents.length === 0) {
      return <p>No health records uploaded yet.</p>;
    }

    return documents.map((document, index) => (
      <div key={index} className="document-container">
        <h3>Document {index + 1}</h3>
        <iframe title={`PDF Viewer ${index + 1}`} src={document} width="100%" height="600px" />
        {!id && (
          <button onClick={() => deleteHealthRecord(index)}>Delete</button>
        )}

        <hr/>
      </div>
    ));
  };

  return (
    <div className='upload-health-records'>
      <h2>Health Records</h2>

      <div className="document-list">{renderDocuments()}</div>

      <label htmlFor="inputFile">Upload Health Record</label> <br />
      <input
        id="inputFile"
        type="file"
        className="form-control"
        accept="application/pdf"
        required
        onChange={(e) => convertToBase64(e)}
        style={{ marginTop: "7px" }}
      />
    </div>
  );
}

export default UploadHealthRecords;