import axios from 'axios'
import {useState,useEffect} from 'react'

import FamilyMemberForm from '../components/FamilyMemberForm'
import FamilyMemberDetails from '../components/FamilyMemberDetails'

const FamilyMembers = () => {
    const [familyMembers, setFamilyMembers] = useState(null)


    const getFamilyMembers = async () => {
        // temporarily hard coded id until a user is logged in
        const id = "6547e768dcd67a6e8e1d04bb";

        await axios.get('/getFamilyMembers?id='+id).then(
       (res) => {
           const members = res.data
           console.log(members)
           setFamilyMembers(members)
           console.log(familyMembers)
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

export default FamilyMembers