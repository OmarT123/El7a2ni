import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminAuthorization from '../../components/AdminAuthorization';

const DeleteAdmin = ({user}) => {
  const [message, setMessage] = useState(null);
  const [adminList, setAdminList] = useState([]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("/getAllAdmins");
      setAdminList(response.data);
      console.log(response.data)
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleRemovePatient = async (adminId) => {
    try {
      const responseBackEnd = await axios.delete("/deleteAdmin?id="+adminId);
      fetchAdmins()
 
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <div className="delete-admin-container">
               <h3>Admin List</h3>
           {adminList && adminList.map((admin) => (
                <div key={admin._id} className="admin-card">
                     <p>Username: {admin.username}</p>
      <button onClick={() => handleRemovePatient(admin._id)}>Remove</button>
      </div>
        ))}
             {message && <h3>{message}</h3>}
     </div>

    </div>
 );
};

export default AdminAuthorization(DeleteAdmin) ;
