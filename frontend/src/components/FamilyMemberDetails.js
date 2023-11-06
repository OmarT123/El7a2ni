const FamilyMemberDetails = ({member}) => 
{
    return (
        <div className="details">
            <h4>{member.name}</h4>
            <p><strong>National ID: </strong>{member.nationalId}</p>
            <p><strong>Age: </strong>{member.age}</p>
            <p><strong>Gender: </strong>{member.gender}</p>
            <p><strong>Relation: </strong>{member.relationToPatient}</p>
        </div>
    )
}
export default FamilyMemberDetails