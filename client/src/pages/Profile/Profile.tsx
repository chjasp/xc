import "./Profile.css";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

/*
Handle user profile
*/
const Profile: React.FC = (props) => {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="wrapper">
      <div className="profile-content">
        [Profile Details of User{currentUser ? ` ${currentUser.email.split("@")[0]}` : ""}]
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default Profile;
