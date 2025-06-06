import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>Welcome to the Blockchain KYC DApp</h1>
      <button onClick={() => navigate('/customer')}>
        Continue as Customer
      </button>
      <button onClick={() => navigate('/admin')}>
        Continue as Admin
      </button>
    </div>
  );
};

export default LandingPage;

