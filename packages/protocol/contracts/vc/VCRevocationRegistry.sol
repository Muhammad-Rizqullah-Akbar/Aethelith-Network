// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

// Kontrak VCRevocationRegistry untuk mengelola status pencabutan kredensial.
// Ini bisa digunakan secara terpisah atau sebagai pelengkap dari fitur revocation di VCKycIssuer.
contract VCRevocationRegistry is Ownable {
    // Pemetaan dari credentialId ke status pencabutan (true jika dicabut)
    mapping(bytes32 => bool) public revokedCredentials;

    // Event yang dipancarkan ketika kredensial dicabut
    event CredentialRevoked(bytes32 indexed credentialId, address indexed revoker);

    /**
     * @dev Constructor kontrak. Pemilik awal adalah yang mendeploy kontrak.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Mencabut kredensial tertentu. Hanya pemilik kontrak yang bisa memanggil fungsi ini.
     * @param _credentialId ID unik dari kredensial yang akan dicabut.
     */
    function revokeCredential(bytes32 _credentialId) external onlyOwner {
        require(!revokedCredentials[_credentialId], "Credential already revoked");
        revokedCredentials[_credentialId] = true;
        emit CredentialRevoked(_credentialId, msg.sender);
    }

    /**
     * @dev Memeriksa apakah kredensial telah dicabut.
     * @param _credentialId ID unik dari kredensial.
     * @return true jika dicabut, false jika tidak.
     */
    function isRevoked(bytes32 _credentialId) external view returns (bool) {
        return revokedCredentials[_credentialId];
    }
}