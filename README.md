# KYC-DApp

A decentralized “Know Your Customer” application combining:

- A **Solidity** smart contract (KYC.sol) deployed to an Ethereum-compatible chain
- A **React** front end that interacts with the deployed contract via Web3.js
- An **Express.js + MySQL** back end for persisting/verifying KYC data off-chain

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Tech Stack](#tech-stack)  
3. [Folder Structure](#folder-structure)  
4. [Prerequisites](#prerequisites)  
5. [Setup & Installation](#setup--installation)  
   1. [1. Clone the Repository](#1-clone-the-repository)  
   2. [2. Deploy / Compile the Smart Contract](#2-deploy--compile-the-smart-contract)  
   3. [3. Back-End (Server) Configuration](#3-back-end-server-configuration)  
   4. [4. Front-End (Client) Configuration](#4-front-end-client-configuration)  
6. [How to Use](#how-to-use)  
7. [API Endpoints (Back-End)](#api-endpoints-back-end)  
8. [Screenshots / Workflow](#screenshots--workflow)  
9. [Contributing](#contributing)  
10. [License](#license)

---

## Project Overview

This KYC-DApp demonstrates a full-stack workflow for registering and verifying customers on a blockchain, while maintaining a MySQL ledger for fast lookups.

1. **Smart Contract** (`KYC.sol`):  
   - Written in Solidity (`^0.4.26`).  
   - Manages `Customer` structs (name, DOB, address, contact, verification status).  
   - Functions:  
     - `registerCustomer(docHash, name, dob, residentialAddress, contact)`  
     - `verifyCustomer(docHash, bankName)`  
     - `getCustomerKYC(docHash)`  
   - Deployed to a local/private Ethereum network (e.g., Ganache or Geth).

2. **Back-End** (`server/`):  
   - **Node.js + Express** REST API  
   - **MySQL** (via `mysql2/promise`) to persist each KYC submission/verification  
   - Endpoints under `/api/kyc` to store/retrieve on-chain data on an off-chain database  

3. **Front-End** (`client/`):  
   - **React** created by Create React App  
   - **Web3.js** to connect to MetaMask (or another Ethereum provider)  
   - **React Router** for navigation between “Landing”, “Customer” and “Admin” pages  
   - **Styled-Components** for basic styling and layout

---

## Tech Stack

- **Blockchain / Smart Contract**  
  - Solidity `^0.4.26`  
  - Deployed on a local Geth/Ganache network  

- **Back-End**  
  - Node.js (v14+), Express v5.x  
  - MySQL (v5.7+ or v8) via `mysql2/promise`  
  - dotenv for environment variables  
  - body-parser, cors  

- **Front-End**  
  - React (Create React App)  
  - Web3.js v1.x  
  - React Router v6  
  - Styled-Components  
  - KYCABI.json (generated ABI from contract)

---

## Folder Structure
KYC-DApp/
├── client/ # React front-end
│ ├── public/
│ │ ├── index.html
│ │ ├── favicon.ico
│ │ └── ...
│ ├── src/
│ │ ├── App.js # Main React component (sets up Web3 + routes)
│ │ ├── App.css
│ │ ├── index.js # Renders <App /> into the DOM
│ │ ├── KYCABI.json # ABI JSON for the deployed contract
│ │ ├── pages/
│ │ │ ├── LandingPage.jsx # Role‐selection / intro screen
│ │ │ ├── CustomerPage.jsx# For customers to register KYC
│ │ │ └── AdminPage.jsx # For admins/banks to verify customers
│ │ └── …
│ ├── package.json
│ └── .gitignore
│
├── server/ # Express + MySQL back-end
│ ├── index.js # Configures Express routes under /api/kyc/*
│ ├── package.json
│ └── .env.example # Sample environment variables:
│ • DB_HOST=localhost
│ • DB_USER=root
│ • DB_PASS=your_password
│ • DB_NAME=kyc_db
│ • PORT=4000
│
├── KYC.sol # Solidity smart contract (also copied under client/)
├── singlenode/ # (Optional) Geth single-node setup and keystores
│ ├── node1/
│ └── genesis.json
│
├── Team3.pptx # (Optional) Project Presentation slides
└── README.md # ← You are here
