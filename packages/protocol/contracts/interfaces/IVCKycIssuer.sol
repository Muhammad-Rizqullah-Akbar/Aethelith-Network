// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface untuk kontrak VCKycIssuer Anda.
interface IVCKycIssuer {
    // Struktur data untuk Verifiable Credential (VC)
    // Harus sama persis dengan yang ada di VCKycIssuer.sol
    struct VerifiableCredential {
        bytes32 schemaId;
        bytes32 credentialId;
        address subjectDIDOwner;
        uint256 issuanceDate;
        uint256 expirationDate;
        bool revoked;
        bytes   proof;
    }

    // Event yang dipancarkan ketika VC baru diterbitkan
    event VCIssued(
        bytes32 indexed credentialId,
        bytes32 indexed schemaId,
        address indexed subjectDIDOwner,
        uint256 issuanceDate,
        uint256 expirationDate
    );

    // Event yang dipancarkan ketika VC dicabut
    event VCRevoked(bytes32 indexed credentialId, address indexed revoker);

    /**
     * @dev Menerbitkan Verifiable Credential KYC baru untuk subjek DID tertentu.
     * @param _subjectDID String DID dari subjek yang akan menerima VC.
     * @param _expirationDate Tanggal kedaluwarsa VC (timestamp Unix).
     * @param _proofData Data bukti (misalnya, hash dari bukti ZKP, atau ID bukti).
     * @return bytes32 credentialId dari VC yang baru diterbitkan.
     */
    function issueKycVC(
        string calldata _subjectDID,
        uint256 _expirationDate,
        bytes calldata _proofData
    ) external returns (bytes32);

    /**
     * @dev Mencabut Verifiable Credential.
     * @param _credentialId ID dari VC yang akan dicabut.
     */
    function revokeVC(bytes32 _credentialId) external;

    /**
     * @dev Mendapatkan status Verifiable Credential.
     * @param _credentialId ID dari VC.
     * @return Struct VerifiableCredential yang berisi detail VC.
     */
    function getVC(bytes32 _credentialId) external view returns (VerifiableCredential memory);

    /**
     * @dev Fungsi view untuk mendapatkan alamat kontrak DIDRegistry.
     */
    function getDIDRegistryAddress() external view returns (address);

    /**
     * @dev Fungsi view untuk mendapatkan alamat kontrak VCKycSchema.
     */
    function getKycSchemaAddress() external view returns (address);
}