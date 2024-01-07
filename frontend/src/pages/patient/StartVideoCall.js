import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import VideoChatRoom from "../../components/VideoChatRoom"; // Import your VideoChatRoom component

function StartVideoCall() {
  const [startCall, setStartCall] = useState(false);

  const handleStartCall = () => {
    setStartCall(true);
  };

  return (
    <div className="Medicine-container">
    <div className="SearchMedicinePatient">
    {startCall ? < VideoChatRoom /> : <button onClick={handleStartCall}>Start Video Call</button>}
    </div>
</div>
  
  )
}

export default StartVideoCall;
