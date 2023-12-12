import React, { useState } from "react";
import axios from "axios";
import PatientAuthorization from "../PatientAuthorization";

const LinkFamilyMember = ({user}) => {
  // const hardcodedPatientId = '6576608bf09d11bc630c6d2f';

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    relationToPatient: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(`/linkFamilyMember?id=${user._id}`, formData);

      setSuccessMessage(response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while linking family member.");
      }
    }
  };

  return (
    <div>
      <h2>Link Family Member</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Relation to Patient:</label>
          <select
            name="relationToPatient"
            value={formData.relationToPatient}
            onChange={handleChange}
            required
          >
            <option value="">Select Relation</option>
            <option value="wife">Wife</option>
            <option value="husband">Husband</option>
            <option value="children">Children</option>
          </select>
        </div>
        <button type="submit">Link Family Member</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default PatientAuthorization(LinkFamilyMember);
