// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface untuk standar Verifiable Credential umum.
// Ini mendefinisikan event dan fungsi yang umum untuk setiap jenis VC.
interface IVerifiedCredential {
    // Struktur data dasar untuk Verifiable Credential
    struct CredentialData {
        bytes32 schemaId;          // ID skema VC
        bytes32 credentialId;      // ID unik VC
        address subject;           // Subjek VC (pemilik DID)
        address issuer;            // Penerbit VC
        uint256 issuanceDate;      // Tanggal penerbitan
        uint256 expirationDate;    // Tanggal kedaluwarsa (0 jika tidak ada)
        bool revoked;              // Status pencabutan
        bytes proof;               // Data bukti (hash ZKP, dll.)
    }

    // Event umum yang dipancarkan saat VC diterbitkan
    event CredentialIssued(
        bytes32 indexed credentialId,
        bytes32 indexed schemaId,
        address indexed subject,
        address issuer,
        uint256 issuanceDate
    );

    // Event umum yang dipancarkan saat VC dicabut
    event CredentialRevoked(
        bytes32 indexed credentialId,
        address indexed revoker,
        uint256 timestamp
    );

    /**
     * @dev Mendapatkan detail kredensial berdasarkan ID-nya.
     * @param _credentialId ID unik dari kredensial.
     * @return CredentialData Struct yang berisi detail kredensial.
     */
    function getCredential(bytes32 _credentialId) external view returns (CredentialData memory);

    /**
     * @dev Memeriksa apakah kredensial valid (belum dicabut dan belum kedaluwarsa).
     * @param _credentialId ID unik dari kredensial.
     * @return bool true jika kredensial valid, false jika tidak.
     */
    function isValid(bytes32 _credentialId) external view returns (bool);
}