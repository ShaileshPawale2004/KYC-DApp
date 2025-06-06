pragma solidity ^0.4.26;

contract KYC {
    struct Customer {
        string name;
        string dob;
        string residentialAddress;
        string contact;
        bool isVerified;
        string verifiedByList; // comma-separated bank names
    }

    mapping(string => Customer) private customersByHash;

    // Register a new customer (clears verifiers if re-registering)
    function registerCustomer(
        string _docHash,
        string _name,
        string _dob,
        string _residentialAddress,
        string _contact
    ) public {
        Customer storage c = customersByHash[_docHash];
        c.name = _name;
        c.dob = _dob;
        c.residentialAddress = _residentialAddress;
        c.contact = _contact;
        c.isVerified = false;
        c.verifiedByList = ""; // reset verifier list
    }

    // Append new verifier
    function verifyCustomer(string _docHash, string _bankName) public {
        Customer storage c = customersByHash[_docHash];
        c.isVerified = true;

        if (bytes(c.verifiedByList).length == 0) {
            c.verifiedByList = _bankName;
        } else {
            c.verifiedByList = string(abi.encodePacked(c.verifiedByList, ", ", _bankName));
        }
    }

    // Get all KYC info
    function getCustomerKYC(string _docHash)
        public view returns (
            string,
            string,
            string,
            string,
            bool,
            string
        )
    {
        Customer memory c = customersByHash[_docHash];
        return (
            c.name,
            c.dob,
            c.residentialAddress,
            c.contact,
            c.isVerified,
            c.verifiedByList
        );
    }
}

