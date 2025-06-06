import React, { useState } from 'react';
import styled from 'styled-components';
import customerImage from '../Customer.jpg';
import { useNavigate } from 'react-router-dom';

const CustomerPage = ({ contract, account }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    phone: '',
    documentHash: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { documentHash, name, dob, address, phone } = formData;
      console.log('Submitting:', { documentHash, name, dob, address, phone });

      await contract.methods
        .registerCustomer(
          documentHash,  // _docHash
          name,          // _name
          dob,           // _dob
          address,       // _residentialAddress
          phone          // _contact
        )
        .send({
          from: account,
          gas: 300000,
          gasPrice: window.web3.utils.toWei('20', 'gwei')
        });

      alert('KYC registration successful!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error in KYC registration');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleViewKYC = async () => {
    try {
      const data = await contract.methods.getCustomerKYC(formData.documentHash).call();
      setCustomerData({
        name: data[0],
        dob: data[1],
        address: data[2],
        phone: data[3],
        isVerified: data[4],
        verifiedByList: data[5]
      });
      setViewMode(true);
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      alert('Error fetching KYC data');
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="left-section">
          <img src={customerImage} alt="Customer KYC" style={{ borderRadius: '15px' }} />
        </div>
        <div className="right-section">
          <div className="heading">
            {viewMode ? 'View KYC Details' : 'Customer KYC Registration'}
          </div>

          <div className="mode-buttons">
            <button className="mode-button" onClick={() => setViewMode(false)}>
              Register KYC
            </button>
            <button className="mode-button" onClick={handleViewKYC}>
              View KYC
            </button>
            <button className="mode-button" onClick={() => navigate('/')}>
              Back
            </button>
          </div>

          {!viewMode ? (
            <form className="form" onSubmit={handleSubmit}>
              <input
                required
                className="input"
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              {/* DOB as simple text */}
              <input
                required
                className="input"
                type="text"
                name="dob"
                placeholder="Date of Birth (e.g. YYYY-MM-DD)"
                value={formData.dob}
                onChange={handleChange}
              />
              <input
                required
                className="input"
                type="text"
                name="address"
                placeholder="Residential Address"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                required
                className="input"
                type="tel"
                name="phone"
                placeholder="Contact (phone or email)"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                required
                className="input"
                type="text"
                name="documentHash"
                placeholder="Document Hash"
                value={formData.documentHash}
                onChange={handleChange}
              />

              <button type="submit" className="login-button">
                Submit KYC
              </button>
            </form>
          ) : customerData ? (
            <div className="customer-details">
              <div className="detail-item">
                <label>Name:</label>
                <span>{customerData.name}</span>
              </div>
              <div className="detail-item">
                <label>Date of Birth:</label>
                <span>{customerData.dob}</span>
              </div>
              <div className="detail-item">
                <label>Address:</label>
                <span>{customerData.address}</span>
              </div>
              <div className="detail-item">
                <label>Contact:</label>
                <span>{customerData.phone}</span>
              </div>
              <div className="detail-item">
                <label>Verification Status:</label>
                <span>
                  {customerData.isVerified
                    ? `Verified by: ${customerData.verifiedByList}`
                    : 'Not verified'}
                </span>
              </div>
            </div>
          ) : (
            <div className="no-data">No KYC data found. Please register first.</div>
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
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;

      img {
        width: 100%;
        max-width: 400px;
        height: auto;
        object-fit: cover;
        opacity: 1;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
    }

       .right-section {
    flex: 0.6;
    background: white;
    padding: 40px;
    overflow-y: auto;
    flex: 0.6;
    background: white;
    padding: 40px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  align-items: center;
   }

  }

  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
    margin-bottom: 20px;
  }

  .mode-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0;
    width: 100%;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .mode-button {
    padding: 8px 20px;
    border-radius: 8px;
    border: 2px solid rgb(16, 137, 211);
    background-color: white;
    color: rgb(16, 137, 211);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    font-weight: 600;
    min-width: 120px;

    &:hover {
      background-color: rgb(16, 137, 211);
      color: white;
      transform: translateY(-2px);
    }
  }

     .form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
   }


  .form .input {
    width: 90%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-inline: 2px solid transparent;
    border-radius: 20px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    font-size: 14px;
    text-align: center;
  }

  .form .login-button {
    display: block;
    width: 90%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.878) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .detail-item {
    margin: 15px 0;
    padding: 10px;
    border-bottom: 1px solid rgba(16, 137, 211, 0.1);
  }

  .customer-details {
    background: white;
    border-radius: 20px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: #cff0ff 0px 10px 10px -5px;
  }

  .detail-item label {
    display: block;
    color: rgb(16, 137, 211);
    font-weight: bold;
    margin-bottom: 5px;
  }

  .detail-item span {
    color: rgb(100, 100, 100);
  }

  .no-data {
    text-align: center;
    color: rgb(100, 100, 100);
    margin: 30px 0;
  }
`;

export default CustomerPage;

