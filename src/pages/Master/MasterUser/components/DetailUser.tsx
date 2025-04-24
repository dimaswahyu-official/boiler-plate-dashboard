import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {}; // Mengambil userId dari state

  const goBackToMasterMenu = () => {
    navigate('/master_menu'); // Navigasi ke halaman /master_menu
  };

  return (
    <div>
      <h1>Details</h1>
      <p>User ID: {userId}</p>
      <button onClick={goBackToMasterMenu}>Back to Master Menu</button>
    </div>
  );
}
