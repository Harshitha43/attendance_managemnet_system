import React, { useEffect, useState } from 'react';
import  './profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
      setProfileData(user);
  }, []);

  return (
    <div className="content profile-container">
      <h1>Profile Page</h1>
      {profileData ? (
        <div className="profile-info">
          <p>Name: {profileData.userName}</p>
          <p>Email: {profileData.email}</p>
          <p>DepartmenID:{profileData.dept_id}</p>
          <p>Leave_balance:{profileData.leave_balance}</p>
          <p>Shift:{profileData.shift}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

    </div>
  );
};

export default Profile;
