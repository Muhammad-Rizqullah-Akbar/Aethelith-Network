// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin Ownable untuk kontrol akses
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

// Import kontrak-kontrak Anda
import { DIDRegistry } from "../registry/DIDRegistry.sol";
import { VCKycSchema } from "./VCKycSchema.sol";

// Kontrak VCKycIssuer akan menerbitkan kredensial KYC
contract VCKycIssuer is Ownable {
    DIDRegistry private didRegistry; // Referensi ke kontrak DIDRegistry
    VCKycSchema private kycSchema;   // Referensi ke kontrak VCKycSchema

    // Struktur data untuk Verifiable Credential (VC)
    struct VerifiableCredential {
        bytes32 schemaId;          // ID skema VC (misalnya KYC_SCHEMA_ID)
        bytes32 credentialId;      // ID unik untuk VC ini (hash dari data VC)
        address subjectDIDOwner;   // Pemilik DID dari subjek VC (yang KYC-nya diverifikasi)
        uint256 issuanceDate;      // Timestamp penerbitan
        uint256 expirationDate;    // Timestamp kedaluwarsa (0 jika tidak ada)
        bool revoked;              // Status pencabutan VC
        bytes   proof;             // Placeholder untuk bukti (misalnya, hash ZKP)
    }

    // Pemetaan dari Credential ID ke detail VC
    mapping(bytes32 => VerifiableCredential) public verifiableCredentials;

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
     * @dev Constructor kontrak.
     * @param _didRegistryAddress Alamat kontrak DIDRegistry.
     * @param _kycSchemaAddress Alamat kontrak VCKycSchema.
     */
    constructor(address _didRegistryAddress, address _kycSchemaAddress) Ownable(msg.sender) {
        require(_didRegistryAddress != address(0), "DIDRegistry address cannot be zero");
        require(_kycSchemaAddress != address(0), "KycSchema address cannot be zero");
        didRegistry = DIDRegistry(_didRegistryAddress);
        kycSchema = VCKycSchema(_kycSchemaAddress);
    }

    /**
     * @dev Menerbitkan Verifiable Credential KYC baru untuk subjek DID tertentu.
     * Hanya pemilik kontrak (issuer) yang dapat memanggil fungsi ini.
     * @param _subjectDID String DID dari subjek yang akan menerima VC.
     * @param _expirationDate Tanggal kedaluwarsa VC (timestamp Unix).
     * @param _proofData Data bukti (misalnya, hash dari bukti ZKP, atau ID bukti).
     * @return bytes32 credentialId dari VC yang baru diterbitkan.
     */
    function issueKycVC(
        string calldata _subjectDID,
        uint256 _expirationDate,
        bytes calldata _proofData
    ) external onlyOwner returns (bytes32) {
        // Verifikasi bahwa subjek DID terdaftar dan ada pemiliknya
        address subjectOwner = didRegistry.getOwner(_subjectDID);
        require(subjectOwner != address(0), "Subject DID not registered");

        // Buat ID unik untuk VC ini (misalnya, hash dari semua data penting)
        bytes32 credentialId = keccak256(
            abi.encodePacked(
                kycSchema.KYC_SCHEMA_ID(), // Menggunakan ID skema dari kontrak VCKycSchema
                _subjectDID,
                subjectOwner,
                block.timestamp,
                _expirationDate,
                _proofData
            )
        );

        require(verifiableCredentials[credentialId].credentialId == 0, "VC with this ID already exists");

        verifiableCredentials[credentialId] = VerifiableCredential({
            schemaId: kycSchema.KYC_SCHEMA_ID(),
            credentialId: credentialId,
            subjectDIDOwner: subjectOwner,
            issuanceDate: block.timestamp,
            expirationDate: _expirationDate,
            revoked: false,
            proof: _proofData
        });

        emit VCIssued(
            credentialId,
            kycSchema.KYC_SCHEMA_ID(),
            subjectOwner,
            block.timestamp,
            _expirationDate
        );

        return credentialId;
    }

    /**
     * @dev Mencabut Verifiable Credential.
     * Hanya pemilik kontrak (issuer) yang dapat memanggil fungsi ini.
     * @param _credentialId ID dari VC yang akan dicabut.
     */
    function revokeVC(bytes32 _credentialId) external onlyOwner {
        VerifiableCredential storage vc = verifiableCredentials[_credentialId];
        require(vc.credentialId != 0, "VC not found");
        require(!vc.revoked, "VC already revoked");

        vc.revoked = true;
        emit VCRevoked(_credentialId, msg.sender);
    }

    /**
     * @dev Mendapatkan status Verifiable Credential.
     * @param _credentialId ID dari VC.
     * @return Struct VerifiableCredential yang berisi detail VC.
     */
    function getVC(bytes32 _credentialId) external view returns (VerifiableCredential memory) {
        return verifiableCredentials[_credentialId];
    }

    /**
     * @dev Fungsi view untuk mendapatkan alamat kontrak DIDRegistry.
     */
    function getDIDRegistryAddress() external view returns (address) {
        return address(didRegistry);
    }

    /**
     * @dev Fungsi view untuk mendapatkan alamat kontrak VCKycSchema.
     */
    function getKycSchemaAddress() external view returns (address) {
        return address(kycSchema);
    }
}