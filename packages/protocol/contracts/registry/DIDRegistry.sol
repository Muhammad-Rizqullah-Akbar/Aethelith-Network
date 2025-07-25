// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { LibDID } from "../libraries/LibDID.sol"; // Import library DID Anda
import { IDIDRegistry } from "../interfaces/IDIDRegistry.sol"; // Import interface IDIDRegistry

// Kontrak DIDRegistry akan mengelola pendaftaran dan resolusi DID.
contract DIDRegistry is Ownable, IDIDRegistry {
    // Pemetaan dari string DID ke alamat pemiliknya.
    mapping(string => address) private didOwners;

    /**
     * @dev Constructor kontrak. Pemilik registry adalah yang mendeploy.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Mendaftarkan DID baru ke alamat pengirim.
     * Hanya pemilik kontrak ini yang dapat memanggil fungsi ini.
     * @param _did String DID yang akan didaftarkan.
     */
    function registerDID(string calldata _did) external onlyOwner {
        require(LibDID.isValidDIDFormat(_did), "Invalid DID format");
        require(didOwners[_did] == address(0), "DID already registered");

        didOwners[_did] = msg.sender;
        emit DIDRegistered(_did, msg.sender);
    }

    /**
     * @dev Mendapatkan pemilik dari DID tertentu.
     * @param _did String DID yang akan dicari pemiliknya.
     * @return Alamat pemilik DID. Jika DID tidak terdaftar, mengembalikan address(0).
     */
    function getOwner(string calldata _did) external view override returns (address) {
        return didOwners[_did];
    }
}