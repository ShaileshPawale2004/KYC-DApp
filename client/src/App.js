// src/App.js

import './App.css';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from 'styled-components';
import KYCABI from "./KYCABI.json";      // ABI JSON
import LandingPage from "./pages/LandingPage";
import CustomerPage from "./pages/CustomerPage";
import AdminPage from "./pages/AdminPage";

const CONTRACT_ADDRESS = "0x3727d7613253Bea61e1c109fF0DA6DA731d8dCB6";

const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
  padding: 20px;

  .container {
    width: 100%;
    max-width: 1200px;
    max-height: 90vh;
    overflow: hidden;
    background: white;
    border-radius: 30px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 40px;

    @media (max-width: 768px) {
      flex-direction: column;
      padding: 20px;
    }
  }

  .left-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;

    h1 {
      font-size: 2.5em;
      color: rgb(16, 137, 211);
      margin-bottom: 20px;
      font-weight: bold;
    }

    p {
      font-size: 1.1em;
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      margin: 12px 0;
      padding-left: 30px;
      position: relative;
      color: #666;
      font-size: 1.1em;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        background: rgb(16, 137, 211);
        border-radius: 50%;
        opacity: 0.2;
      }

      &:after {
        content: '✓';
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        color: rgb(16, 137, 211);
        font-size: 12px;
      }
    }
  }

  .right-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function load() {
      let web3;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        // Fallback to local node
        web3 = new Web3("http://127.0.0.1:8545");
      }

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        console.error('No accounts found. Make sure MetaMask is unlocked or Geth has an unlocked account.');
        return;
      }
      setAccount(accounts[0]);

      // Instantiate contract
      const kycContract = new web3.eth.Contract(KYCABI, CONTRACT_ADDRESS);
      setContract(kycContract);

      // Expose web3 for debugging
      window.web3 = web3;
    }
    load();
  }, []);

  if (!contract || !account) return <p>Loading Web3...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <StyledWrapper>
            <div className="container">
              <div className="left-section">
                <h1>Blockchain-Based KYC System</h1>
                <p>Welcome to our advanced Know Your Customer (KYC) verification system powered by blockchain technology. Our platform ensures secure, transparent, and efficient customer verification process across multiple banks.</p>
                <p>Experience the future of KYC verification with features like:</p>
                <ul>
                  <li>Secure document verification</li>
                  <li>Real-time status tracking</li>
                  <li>Multi-bank verification system</li>
                  <li>Immutable audit trail</li>
                </ul>
              </div>
              <div className="right-section">
                <LandingPage />
              </div>
            </div>
          </StyledWrapper>
        } />
        <Route path="/customer" element={<CustomerPage contract={contract} account={account} />} />
        <Route path="/admin" element={<AdminPage contract={contract} account={account} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

