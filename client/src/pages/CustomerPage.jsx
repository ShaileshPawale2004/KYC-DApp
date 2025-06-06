import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerPage = ({ contract, account }) => {
  const navigate = useNavigate();
  const [docHash, setDocHash] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');         
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [kycResult, setKycResult] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customerData"));
    if (saved) {
      setDocHash(saved.docHash || '');
      setName(saved.name || '');
      setDob(saved.dob || '');
      setAddress(saved.address || '');
      setContact(saved.contact || '');
    }
  }, []);

  const registerCustomer = async () => {
    try {
      console.log('Registering:', { docHash, name, dob, address, contact });
      const gasPrice = await window.web3.eth.getGasPrice();
      await contract.methods
        .registerCustomer(
          docHash,     // _docHash
          name,        // _name
          dob,         // _dob
          address,     // _residentialAddress
          contact      // _contact
        )
        .send({ 
          from: account, 
          gas: 300000, 
          gasPrice 
        });

      localStorage.setItem(
        "customerData",
        JSON.stringify({ docHash, name, dob, address, contact })
      );
      alert("Customer Registered Successfully");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration Failed.");
    }
  };

  const viewKYC = async () => {
    try {
      const result = await contract.methods.getCustomerKYC(docHash).call();
      setKycResult(result);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch KYC data.");
    }
  };

  return (
    <div className="page-container">
      <h2>Customer Registration</h2>

      <input
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Date of Birth (e.g. YYYY-MM-DD)"
        value={dob}
        onChange={e => setDob(e.target.value)}
      />
      <input
        placeholder="Residential Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <input
        placeholder="Contact (phone or email)"
        value={contact}
        onChange={e => setContact(e.target.value)}
      />
      <input
        placeholder="Document Hash"
        value={docHash}
        onChange={e => setDocHash(e.target.value)}
      />

      <button onClick={registerCustomer}>Register</button>
      <hr />
      <button onClick={viewKYC}>View My KYC</button>
      <button onClick={() => navigate("/")}>Back to Home</button>

      {kycResult && (
        <div className="customer-details">
          <p><strong>Name:</strong> {kycResult[0]}</p>
          <p><strong>DOB:</strong> {kycResult[1]}</p>
          <p><strong>Address:</strong> {kycResult[2]}</p>
          <p><strong>Contact:</strong> {kycResult[3]}</p>
          <p><strong>Verified:</strong> {kycResult[4] ? "✅ Yes" : "❌ No"}</p>
          <p><strong>Verified By:</strong> {kycResult[5]}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;

