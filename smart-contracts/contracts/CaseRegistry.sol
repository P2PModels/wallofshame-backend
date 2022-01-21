// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CaseRegistry {
    address public owner = msg.sender;
    uint256 currentId = 0;
    struct Case {
        uint256 id;
        string companyName;
        string caseType;
        string description;
        string region;
        string profession;
        string gender;
        string ageRange;
        string experience;
    }
    mapping(uint256 => Case) public casesById;
    event CaseReported(
        uint256 id,
        string _companyName,
        string _caseType,
        string _description,
        string _region,
        string _profession,
        string _gender,
        string _ageRange,
        string _experience
    );

    function report(
        string memory _companyName,
        string memory _caseType,
        string memory _description,
        string memory _region,
        string memory _profession,
        string memory _gender,
        string memory _ageRange,
        string memory _experience
    ) public {
        casesById[currentId] = Case({
            id: currentId,
            companyName: _companyName,
            caseType: _caseType,
            description: _description,
            region: _region,
            profession: _profession,
            gender: _gender,
            ageRange: _ageRange,
            experience: _experience
        });

        emit CaseReported(
            casesById[currentId].id,
            casesById[currentId].companyName,
            casesById[currentId].caseType,
            casesById[currentId].description,
            casesById[currentId].region,
            casesById[currentId].profession,
            casesById[currentId].gender,
            casesById[currentId].ageRange,
            casesById[currentId].experience
        );

        currentId++;
    }
}
