import axios from 'axios'
import {useState,useEffect} from 'react'

import FamilyMemberForm from '../../components/patient/FamilyMemberForm'
import FamilyMemberDetails from '../../components/patient/FamilyMemberDetails'
import PatientAuthorization from '../../components/PatientAuthorization'

const FamilyMembers = ({user}) => {
    const [familyMembers, setFamilyMembers] = useState(null)


    const getFamilyMembers = async () => {
        const id = user._id

        await axios.get('/getFamilyMembers').then(
       (res) => {
           const members = res.data
           setFamilyMembers(members)
        }
        )
    }
    useEffect(() => 
    {
          getFamilyMembers();
  },[])
    


    return (
        <div class="family-container">
            <div className="family-members">
                {familyMembers && familyMembers.map((member)=>(
                    <FamilyMemberDetails key={member._id} member={member}/>
                ))}
            </div>
            <FamilyMemberForm handleClick={getFamilyMembers}/>
        </div>
    )
}

export default PatientAuthorization(FamilyMembers) 