import axios from 'axios';
import { useState , useEffect } from 'react';


const RegisterPharmacist = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [hourlyRate, setHourlyRate] = useState(0)
    const [affiliation, setAffiliation] = useState('')
    const [education1, setEducation1] = useState('')
    const [education2, setEducation2] = useState('')
    const [education3, setEducation3] = useState('')
    const [idPDF, setidPDF] = useState('')
    const [degreePDF, setDegreePDF] = useState('')
    const [licensePDF, setLicensePDF] = useState('')
    const [flashMessage, setFlashMessage] = useState('');
  const [showContent, setShowContent] = useState(false)

     useEffect(() => {
    const userToken = localStorage.getItem('userToken');

    if (userToken) {
      window.location.href = '/Home';
    } else {
      setShowContent(true);
    }
  }, []);

    function convertToBase64(type, c) {
        //Read File
        var selectedFile = document.getElementById("inputFile"+c).files;
        //Check File is not Empty
        if (selectedFile.length > 0) {
            // Select the very first file from list
            var fileToLoad = selectedFile[0];
            // FileReader function for read the file.
            var fileReader = new FileReader();
            var base64;
            // Onload of file read the file content
            fileReader.onload = function(fileLoadedEvent) {
                base64 = fileLoadedEvent.target.result;
                if(type === "id")
                {
                    setidPDF(base64);
                }
                else if(type === "degree")
                {
                    setDegreePDF(base64);
                }
                else
                {
                    setLicensePDF(base64);
                }
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);
        }
    }
    
    
    const register = async(e) => {
        e.preventDefault()
        

        const educationalBackground = []
        if (education1 !== '')
            educationalBackground.push(education1)
        if (education2 !== '')
            educationalBackground.push(education2)
        if (education3 !== '')
            educationalBackground.push(education3)
        if(!name || !username || !email || !password || !birthDate || !hourlyRate || !affiliation || educationalBackground.length === 0)
            alert('Please fill all the fields.')
        else if(idPDF.substring(0,20) != "data:application/pdf" || degreePDF.substring(0,20) != "data:application/pdf" || licensePDF.substring(0,20) != "data:application/pdf"){
            alert('Please upload your documents in the PDF format only.')
        }
        else{
            const body = {name,username,email,password,birthDate,hourlyRate,affiliation,educationalBackground, idPDF, degreePDF, licensePDF}
            try {
            const response = await axios.post('/addPharmacist', body);
              setFlashMessage(response.data); // Set the flash message from the server response
            } catch (err) {
              setFlashMessage('Registration failed. Please try again.'); // Set a generic error message
          }
        }
  };

    return (
        <div className="search-container">
          {showContent &&
            <form className='create'>
                <h3>Create new Account (Pharmacist):</h3>

                <label>Name:</label>
                <input
                type="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <br/>

                <label>Username:</label>
                <input
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                />
                <br/>

                <label>Email:</label>
                <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <br/>

                <label>Password:</label>
                <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <br/>

                <label>Birth Date:</label>
                <input
                type="date"
                value={birthDate}
                onChange={(e)=>setBirthDate(e.target.value)}
                />
                <br/>

                <label>Hourly Rate:</label>
                <input
                type="number"
                value={hourlyRate}
                onChange={(e)=>setHourlyRate(e.target.value)}
                />
                <br/>
                
                <label>Affiliation:</label>
                <input
                type="text"
                value={affiliation}
                onChange={(e)=>setAffiliation(e.target.value)}
                />
                <br/>

                <label>Educational Background:</label>
                <input
                type="text"
                value={education1}
                onChange={(e)=>setEducation1(e.target.value)}
                style={{marginBottom:"15px"}}
                />
                <input
                type="text"
                value={education2}
                onChange={(e)=>setEducation2(e.target.value)}
                style={{marginBottom:"15px"}}
                />
                <input
                type="text"
                value={education3}
                onChange={(e)=>setEducation3(e.target.value)}
                style={{marginBottom:"15px"}}
                />
                <br/>
                <label>Upload Identification (ID):</label>
                <input
                id = "inputFile1"
                type="file"
                className="form-control"
                accept='application/pdf'
                required
                onChange={(e) => convertToBase64("id",1)}
                style={{marginTop:"7px"}}
                />
                <br/>
                <label>Upload Pharmacy Degree:</label>
                <input
                id = "inputFile2"
                type="file"
                className="form-control"
                accept='application/pdf'
                required
                onChange={(e) => convertToBase64("degree",2)}
                style={{marginTop:"7px"}}
                />
                <br/>
                <label>Upload Working License:</label>
                <input
                id = "inputFile3"
                type="file"
                className="form-control"
                accept='application/pdf'
                required
                onChange={(e) => convertToBase64("license",3)}
                style={{marginTop:"7px"}}
                />
                <br/>



                <button onClick={register}>Register</button>
          
                {flashMessage && <h3>{flashMessage.success ? 'Success: ' : 'Error: '}{flashMessage.message}</h3>}
      </form>
}
      <div className="search-results"></div>
    </div>
    )

}

export default RegisterPharmacist