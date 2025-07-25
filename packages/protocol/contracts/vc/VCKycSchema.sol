// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Kontrak VCKycSchema (hanya sebagai placeholder untuk definisi struktur/data)
// Di aplikasi nyata, skema VC akan lebih kompleks dan seringkali ditangani off-chain.
// Namun, kita akan memiliki ID skema dan mungkin beberapa parameter dasar on-chain.

contract VCKycSchema {
    // Ini adalah ID unik untuk skema KYC Anda.
    bytes32 public constant KYC_SCHEMA_ID = keccak256("KYCVerifiableCredentialSchemaV1");

    // Anda bisa menambahkan data lain yang relevan dengan skema di sini.
    // Misalnya, versi skema, URI metadata, atau aturan dasar.
    uint256 public schemaVersion;
    string public schemaURI;

    constructor() {
        schemaVersion = 1;
        schemaURI = "https://kyc-did-protocol.global/schemas/kyc/v1"; // Contoh URI
    }

    // Fungsi view untuk mengambil data skema
    function getSchemaInfo() external view returns (uint256, string memory) {
        return (schemaVersion, schemaURI);
    }
}