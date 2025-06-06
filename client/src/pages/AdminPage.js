// src/pages/AdminPage.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import bankImage from '../Bank.jpg';
import { useNavigate } from 'react-router-dom';

const AdminPage = ({ contract, account }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [customerId, setCustomerId] = useState('');
  const [bankName, setBankName] = useState('');

  const handleViewKYC = async () => {
    if (!customerId) {
      alert('Please enter a document hash.');
      return;
    }
    try {
      const data = await contract.methods.getCustomerKYC(customerId).call();
      setCustomerData({
        name: data[0],
        dob: data[1],
        address: data[2],
        contact: data[3],
        isVerified: data[4],
        verifiedByList: data[5]
      });
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      alert('Error fetching KYC data');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!customerId || !bankName) {
      alert('Please enter both document hash and bank name.');
      return;
    }
    try {
      const gasPrice = await window.web3.eth.getGasPrice();
      await contract.methods
        .verifyCustomer(customerId, bankName)
        .send({ from: account, gas: 300000, gasPrice });
      alert('Customer verification successful!');
      // refresh view if currently viewing
      if (viewMode) {
        handleViewKYC();
      }
    } catch (error) {
      console.error('Error in verification:', error);
      alert('Error in verification');
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="left-section">
          <img src={bankImage} alt="Bank KYC" />
        </div>
        <div className="right-section">
          <div className="heading">
            {viewMode ? 'View KYC Details' : 'Verify KYC'}
          </div>

          <div className="mode-buttons">
            <button
              className="mode-button"
              onClick={() => {
                setViewMode(false);
                setCustomerData(null);
              }}
            >
              Verify KYC
            </button>
            <button
              className="mode-button"
              onClick={() => {
                setViewMode(true);
                handleViewKYC();
              }}
            >
              View KYC
            </button>
            <button
              className="mode-button"
              onClick={() => navigate('/')}
            >
              Back
            </button>
          </div>

          <form className="form" onSubmit={viewMode ? (e) => { e.preventDefault(); handleViewKYC(); } : handleVerify}>
            <div className="form-group">
              <label>Document Hash</label>
              <input
                required
                className="input"
                type="text"
                placeholder="Enter document hash"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>

            {viewMode ? null : (
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  required
                  className="input"
                  type="text"
                  placeholder="Enter your bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="login-button">
              {viewMode ? 'View KYC' : 'Verify Customer'}
            </button>
          </form>

          {customerData && (
            <div className="customer-details">
              <h3>Customer Details</h3>
              <p><strong>Name:</strong> {customerData.name}</p>
              <p><strong>DOB:</strong> {customerData.dob}</p>
              <p><strong>Address:</strong> {customerData.address}</p>
              <p><strong>Contact:</strong> {customerData.contact}</p>
              <p><strong>Verified:</strong> {customerData.isVerified ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Verified By:</strong> {customerData.verifiedByList || '—'}</p>
            </div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
  padding: 20px;

  .container {
    width: 100%;
    max-width: 1200px;
    height: 90vh;
    display: flex;
    background: white;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    .left-section {
      flex: 0.4;
      background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;

      img {
        width: 100%;
        max-width: 400px;
        height: auto;
        object-fit: cover;
        border-radius: 15px;
      }
    }

    .right-section {
      flex: 0.6;
      padding: 40px;
      overflow-y: auto;
      text-align: center;
      display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
    }
  }

  .heading {
    font-size: 28px;
    color: rgb(16, 137, 211);
    margin-bottom: 30px;
    font-weight: bold;
  }

  .mode-buttons {
    display: flex;
    justify-content: center;  /* center the buttons */
    gap: 45px;                /* space between them */
    margin-bottom: 20px;
  }

  .mode-button {
    padding: 8px 20px;
    border: 2px solid rgb(16, 137, 211);
    background: white;
    color: rgb(16, 137, 211);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    
    &:hover {
      background: rgb(16, 137, 211);
      color: white;
    }
  }

  .form {
    width: 100%;
    max-width: 400px;
    margin: 0 auto 20px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    margin-bottom: 15px;
    text-align: left;

    label {
      display: block;
      margin-bottom: 5px;
      color: #555;
    }

    .input {
      width: 100%;
      padding: 10px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;

      &:focus {
        border-color: rgb(16, 137, 211);
        outline: none;
      }
    }
  }

  .login-button {
    width: 100%;
    padding: 12px;
    background: rgb(16, 137, 211);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgb(18, 177, 209);
    }
  }

  .customer-details {
    text-align: left;
    max-width: 400px;
    margin: 0 auto;
    background: rgba(255,255,255,0.8);
    padding: 20px;
    border-radius: 12px;
  }

  .customer-details h3 {
    color: rgb(16, 137, 211);
    margin-bottom: 15px;
  }

  .customer-details p {
    margin: 5px 0;
  }
`;

export default AdminPage;

