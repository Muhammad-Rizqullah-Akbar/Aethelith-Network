// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // Versi Solidity yang kompatibel dengan Foundry dan OpenZeppelin

// Import yang mungkin akan kita gunakan dari OpenZeppelin atau Forge Standard Library
// Contoh: import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
// Contoh: import { console } from "forge-std/Test.sol"; // Untuk debugging di test

// DID Registry Contract
contract DIDRegistry {
    // Pemetaan dari DID string (misalnya, "did:example:123") ke alamat pemiliknya
    mapping(string => address) private didOwners;

    // Event yang dipancarkan ketika DID baru terdaftar
    event DIDRegistered(string indexed did, address indexed owner);

    /**
     * @dev Mendaftarkan DID baru ke alamat pengirim.
     * @param _did String DID yang akan didaftarkan.
     */
    function registerDID(string calldata _did) external {
        require(didOwners[_did] == address(0), "DID already registered");
        didOwners[_did] = msg.sender;
        emit DIDRegistered(_did, msg.sender);
    }

    /**
     * @dev Mendapatkan pemilik dari DID tertentu.
     * @param _did String DID yang akan dicari pemiliknya.
     * @return Alamat pemilik DID. Jika DID tidak terdaftar, mengembalikan address(0).
     */
    function getOwner(string calldata _did) external view returns (address) {
        return didOwners[_did];
    }
}