// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface untuk kontrak DIDRegistry Anda.
// Ini mendefinisikan fungsi-fungsi eksternal yang dapat dipanggil
// pada kontrak DIDRegistry.
interface IDIDRegistry {
    // Event yang dipancarkan ketika DID baru terdaftar
    event DIDRegistered(string indexed did, address indexed owner);

    /**
     * @dev Mendaftarkan DID baru ke alamat pengirim.
     * @param _did String DID yang akan didaftarkan.
     */
    function registerDID(string calldata _did) external;

    /**
     * @dev Mendapatkan pemilik dari DID tertentu.
     * @param _did String DID yang akan dicari pemiliknya.
     * @return Alamat pemilik DID. Jika DID tidak terdaftar, mengembalikan address(0).
     */
    function getOwner(string calldata _did) external view returns (address);
}