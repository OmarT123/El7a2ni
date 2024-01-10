# El7a2ni

## Table of Contents
- [Project Title](#project-title)
- [Motivation](#motivation)
- [Build Status](#build-status)
- [Code Style](#code-style)
- [Screenshots](#screenshots)
- [Tech/Framework used](#techframework-used)
- [Features](#features)
- [Code Examples](#code-examples)
- [Installation](#installation)
- [API References](#api-references)
- [Tests](#tests)
- [How to Use](#how-to-use)
- [Contribute](#contribute)
- [Credits](#credits)
- [License](#license)

## Project Title
"El7a2ni"

## Motivation
This project is driven by the vision of improving the overall healthcare experience by fostering communication and accessibility among all stakeholders. The goal of the "El7a2ni" project is to create a clinic website that serves as a seamless platform connecting doctors, pharmacists, and patients. The aim is to establish a comprehensive digital space where healthcare professionals can collaborate, patients can easily access medical services, and pharmacists can efficiently provide medications.

## Build Status
patients cannot add family members 

## Code Style
The project is formatted using Prettier. It follows the MVC design pattern, commonly used for developing user interfaces. MVC divides the program logic into three interconnected elements: Models (M), representing the core of the database; Controllers (C), containing functions for routes; and Views (V), represented by the React frontend server in the MERN stack. Routes in the project are abstracted from controller functions (see API References).

## Screenshots
## Sign in as a patient 
![Alt text](<WhatsApp Image 2024-01-10 at 22.09.10_8f0a620c.jpg>)
## medicines
 ![Alt text](<WhatsApp Image 2024-01-10 at 22.09.33_cc097fc3.jpg>)
## Information about doctor
![Alt text](<WhatsApp Image 2024-01-10 at 22.09.50_3cacb29f.jpg>)


## Tech/Framework used
- **React:** A JavaScript library for building interactive and user-friendly web interfaces.
- **Node.js:** A server-side runtime for executing JavaScript code on the server, enabling scalable backend development.
- **Express:** A minimalist Node.js web application framework for building robust and efficient APIs.
- **MongoDB:** A NoSQL database for flexible and scalable data storage, commonly used in web applications.
- **Mongoose:** An elegant MongoDB object modeling tool for simplified interaction with the database in Node.js applications.
- **Stripe:** A secure payment processing platform for handling online transactions and billing functionalities.
- **Git:** A distributed version control system for tracking changes and facilitating collaborative software development.
- **Postman:** An API testing and development tool used for debugging and ensuring smooth integration between frontend and backend.
- **VSCode:** A lightweight yet powerful code editor with extensive plugin support, enhancing the development experience.
- **JWT (JSON Web Tokens):** A compact and secure method for representing claims between parties, commonly used for authentication and authorization in web applications.

# Features


<summary>Our Website User Types</summary>

- Admin
- Doctor
- Patient
- Guest

</details>

<details>
<summary>Admin Features</summary>

- Login with username and password.
- Logout.
- Add another administrator with a set username and password.
- Remove a pharmacist/patient from the system.
- View information uploaded by a pharmacist to apply to join the platform.
- Accept or reject the request of a pharmacist to join the platform.
- Change your password.
- Reset a forgotten password through OTP sent to email.
- View a list of all available medicines (including picture, price, description).
- Search for medicine based on name.
- Filter medicines based on medicinal use.
- View a total sales report based on a chosen month.
- View a pharmacist's information.

</details>

<details>
<summary>Doctor Features</summary>

- Login with username and password.
- Logout.
- Change your password.
- Reset a forgotten password through OTP sent to email.
- Edit/update email, hourly rate, or affiliation (hospital).
- View and accept the employment contract.
- Add available time slots for appointments.
- View uploaded health records.
- View information and health records of registered patients.
- View all new and old prescriptions and their statuses (filled/not filled).
- View a list of all patients.
- Search for a patient by name.
- Filter patients based on upcoming appointments.
- Select a patient from the list.
- Receive notification of appointments via the system and email.
- View a list of upcoming/past appointments.
- Reschedule an appointment for a patient.
- Cancel an appointment for oneself or a family member.
- Receive notifications of appointment changes via the system and email.
- Schedule a follow-up for a patient.
- Add/delete medicine to/from the prescription from the pharmacy platform.
- Download selected prescription (PDF).
- Start/end a video call with the doctor/patient.
- Add new health records for a patient.
- Update a patient's prescription before submission to the pharmacy.
- Accept or revoke a follow-up session request from a patient.
- View the amount in the wallet.
- Chat with a doctor/patient.
- View all new and old prescriptions and their statuses (filled/not filled).

</details>

<details>
<summary>Patient Features</summary>

- Upload/remove documents (PDF, JPEG, JPG, PNG) for medical history.
- Login with username and password.
- Logout.
- Change your password.
- Reset a forgotten password through OTP sent to email.
- Add family members using name, National ID, age, gender, and relation to the patient.
- Link another patient's account as a family member using email or phone number, stating relation to the patient.
- Choose to pay for an appointment using wallet or credit card.
- Enter credit card details and pay for an appointment using Stripe.
- View registered family members.
- Filter appointments by date/status.
- View uploaded health records.
- View all new and old prescriptions and their statuses (filled/not filled).
- View health package options and details.
- Subscribe to a health package for oneself and family members (if any).
- Choose to pay for the chosen health package using wallet or credit card.
- View subscribed health package for oneself and family members (if any).
- View the status of health care package subscription for oneself and family members.
- Cancel a subscription of a health package for oneself and family members (if any).
- View all details of a selected doctor, including specialty, affiliation (hospital), educational background.
- View all available appointments of a selected doctor.
- Select an appointment date and time for oneself or a family member.
- Receive notification of appointments via the system and email.
- View a list of all upcoming/past appointments.
- Reschedule an appointment for oneself or a family member.
- Cancel an appointment for oneself or a family member.
- Receive notifications of appointment changes via the system and email.
- View a list of all prescriptions.
- Select a prescription from the list.
- View the details of the selected prescription.
- Choose to pay directly for prescription items with the wallet or credit card.
- Download selected prescription (PDF).
- Request a follow-up to a previous appointment for oneself or a family member.
- Receive a refund in the wallet when a doctor cancels an appointment.
- View the amount in the wallet.
- Chat with a doctor/patient.
- Add a prescription medicine to the cart based on the prescription.
- Change the amount of an item in the cart.
- Choose to pay with the wallet, credit card (using Stripe), or cash on delivery.
- View current and past orders.
- Cancel an order.
- View alternatives to a medicine that is out of stock based on the main active ingredient.

</details>

<details>
<summary>Guest Features</summary>

- Register as a patient using username, name, email, password, date of birth, gender, mobile number, emergency contact (full name, mobile number).
- Upload and submit required documents upon registration as a doctor, such as ID, medical licenses, and medical degree.
- Submit a request to register as a doctor using username, name, email, password, date of birth, hourly rate, affiliation (hospital), educational background.

</details>






## Installation


<summary>Clone the Project</summary>


git clone https://github.com/OmarT123/Virtual-Clinic_Team03.git

### How to Run

#### Back-End Terminal

1. To install packages (You need to change the directory to backend first: `cd .\backend\`)


2. npm i
3. npm run el7a2ni-start

#### front-End Terminal
1. To install packages (You need to change the directory to backend first: `cd .\frontend\`)


2. npm i
3. npm start



## API References

Here are all of the main API routes used in the project:

### 1. Home Page

- **Route:** `/`
- **Description:** Landing page for the application.


### 2. Login

- **Route:** `/login`
- **Description:** Page for user login.


### 3. Sign Up

- **Route:** `/signup`
- **Description:** Page for user registration.


### 4. Reset Password

- **Route:** `/resetPassword`
- **Description:** Page for resetting the user password.


### 5. Doctor Contract

- **Route:** `/doctorContract`
- **Description:** Page for viewing the doctor's employment contract.


### 6. Successful Checkout

- **Route:** `/SuccessfulCheckout`
- **Description:** Page for successful credit card checkout after buying medecines.


### 7. Cancel Checkout

- **Route:** `/CancelCheckout`
- **Description:**  Page for cancelled credit card transaction.


### 8. Successful Checkout Package

- **Route:** `/SuccessfulCheckoutPackage`
- **Description:** Page for successful credit card checkout after buying health packages.









## Testing

The API routes were tested using Postman, Postman is an application used for API testing. It is an HTTP client that tests HTTP requests, utilizing a graphical user interface, through which we obtain different types of responses that need to be subsequently validated. Postman offers many endpoint interaction methods. The following are some of the most used, including their functions:

### - GET:  Obtain information
### - POST: Add information
### - PUT: Replace information
### - PATCH: Update certain information
### - DELETE: Delete information


## How to Use
You can use our website as one of four main users (Admin , Doctor or Patient), you can sign up for an account from the sign up page to the website as any of user types then you can login and change your password and use all of our features.

## how to Contribute
Anyone who would like to contribute to the project please send me an E-mail on eyad.shams00@gmail.com

## Credits

**React.js**

**Mongoose docs**

**Express docs**

**NodeJs docs**

**Restful**

__Clean code__

## License

This project is licenced under Apache Licence 2.0

## Example of Code

Here is an example of a React component for medicine selection in a prescription system.

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorAuthorization from '../../components/DoctorAuthorization';

const MedicineSelection = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedDosage, setSelectedDosage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('/viewAllMedicines');
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error.message);
      }
    };

    fetchMedicines();
  }, []); 

  const handleMedicineSelect = (event) => {
    const selectedMedicineId = event.target.value;
    setSelectedMedicine(selectedMedicineId);
  };

  const handleDosageSelect = (event) => {
    const selectedDosage = event.target.value;
    setSelectedDosage(selectedDosage);
  };

  const handleAddMedicine = async () => {
    if (selectedMedicine && selectedDosage) {
      try {
        
        const response = await axios.post('/addToPrescription', {
          prescriptionId: id,
          medId: selectedMedicine,
          dosage: selectedDosage,
        });

        setSuccessMessage(response.data.message); 
        window.location.href = '/ViewPatientPrescriptions';
      } catch (error) {
        console.error('Error adding medicine to prescription:', error.message);
      }
    } else {
      alert('Please select both medicine and dosage.');
    }
  };

  return (
    <div>
      <label> Select Medicine: </label>
      <select value={selectedMedicine} onChange={handleMedicineSelect}>
        <option value="">Select an option</option>
        {medicines.map((medicine) => (
          <option key={medicine._id} value={medicine._id}>
            {medicine.name}
          </option>
        ))}
      </select>

      <label> Enter Dosage: </label>
      <input
        type="number"
        value={selectedDosage}
        onChange={(event) => setSelectedDosage(event.target.value)}
        min="1"
        step="1"
        placeholder="Enter dosage"
      />

      <button style={{ marginLeft: '5px' }} onClick={handleAddMedicine}>Add Medicine</button>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};
export default DoctorAuthorization(MedicineSelection);

