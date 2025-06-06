// src/pages/AdminPage.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const AdminPage = ({ contract, account }) => {
  const navigate = useNavigate();
  const [docHash, setDocHash] = useState('');
  const [bankName, setBankName] = useState('');
  const [result, setResult] = useState(null);

  const getCustomer = async () => {
    if (!docHash) {
      alert("Please enter a document hash.");
      return;
    }
    try {
      const res = await contract.methods.getCustomerKYC(docHash).call();
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch customer.");
    }
  };

  const verify = async () => {
    if (!docHash || !bankName) {
      alert("Please enter both document hash and bank name.");
      return;
    }
    try {
      const gasPrice = await window.web3.eth.getGasPrice();
      await contract.methods.verifyCustomer(docHash, bankName).send({
        from: account,
        gas: 300000,
        gasPrice,
      });
      alert("Customer Verified Successfully");
      // refresh view
      getCustomer();
    } catch (err) {
      console.error(err);
      alert("Verification Failed.");
    }
  };

  const downloadPDF = () => {
    if (!result) {
      alert("No customer data available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("KYC Verification Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${result[0]}`, 20, 35);
    doc.text(`Date of Birth: ${result[1]}`, 20, 45);
    doc.text(`Address: ${result[2]}`, 20, 55);
    doc.text(`Contact: ${result[3]}`, 20, 65);
    doc.text(`Verified: ${result[4] ? "Yes" : "No"}`, 20, 75);
    doc.text("Verified By:", 20, 85);
    const banks = result[5].split(',');
    banks.forEach((bank, idx) =>
      doc.text(`- ${bank.trim()}`, 30, 95 + idx * 10)
    );
    doc.save(`KYC_${result[0]}_Verified.pdf`);
  };

  return (
    <StyledWrapper>
      <div className="panel">
        <h2>Admin Panel</h2>

        <div className="inputs">
          <input
            placeholder="Document Hash"
            value={docHash}
            onChange={e => setDocHash(e.target.value)}
          />
          <input
            placeholder="Bank Name"
            value={bankName}
            onChange={e => setBankName(e.target.value)}
          />
        </div>

        <div className="buttons">
          <button onClick={getCustomer}>View</button>
          <button onClick={verify}>Verify</button>
          <button onClick={() => navigate("/")}>Back</button>
        </div>

        {result && (
          <div className="customer-details">
            <p><strong>Name:</strong> {result[0]}</p>
            <p><strong>DOB:</strong> {result[1]}</p>
            <p><strong>Address:</strong> {result[2]}</p>
            <p><strong>Contact:</strong> {result[3]}</p>
            <p><strong>Verified:</strong> {result[4] ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Verified By:</strong> {result[5]}</p>
            <button className="pdf-button" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, rgb(16,137,211), rgb(18,177,209));
  height: 100vh;
  padding: 20px;

  .panel {
    background: white;
    border-radius: 12px;
    padding: 30px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    text-align: center;
  }

  h2 {
    margin-bottom: 20px;
    color: rgb(16,137,211);
  }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }

  .inputs input {
    padding: 10px;
    font-size: 14px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    text-align: left;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .buttons button {
    flex: 1;
    margin: 0 5px;
    padding: 10px;
    background: rgb(16,137,211);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .buttons button:hover {
    background: rgb(18,177,209);
  }

  .customer-details {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    text-align: left;
  }

  .customer-details p {
    margin: 8px 0;
  }

  .pdf-button {
    margin-top: 15px;
    width: 100%;
    padding: 10px;
    background: rgb(16,137,211);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .pdf-button:hover {
    background: rgb(18,177,209);
  }
`;

export default AdminPage;

