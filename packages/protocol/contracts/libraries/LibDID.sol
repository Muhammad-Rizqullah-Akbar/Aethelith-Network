// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Library untuk fungsi-fungsi utilitas terkait DID.
// Library ini dapat di-*attach* ke tipe data atau digunakan sebagai fungsi statis.
library LibDID {
    /**
     * @dev Memverifikasi format dasar DID string (misalnya, "did:method:idstring").
     * Ini adalah pemeriksaan format yang sangat dasar dan tidak memverifikasi keunikan
     * atau validitas on-chain.
     * @param _did String DID yang akan diverifikasi.
     * @return bool true jika formatnya valid, false jika tidak.
     */
    function isValidDIDFormat(string calldata _did) internal pure returns (bool) {
        // Contoh implementasi sangat dasar.
        // DID minimal harus memiliki "did:"
        // dan setidaknya satu ":" setelah itu untuk method.
        if (bytes(_did).length < 6) return false; // Minimal "did:x:y"
        if (keccak256(bytes(_did[0:4])) != keccak256(bytes("did:"))) return false; // Harus dimulai dengan "did:"

        // Periksa apakah ada method dan ID setelah "did:"
        uint256 firstColon = 0;
        for (uint256 i = 0; i < bytes(_did).length; i++) {
            if (bytes(_did)[i] == bytes1(':')) {
                if (firstColon == 0) {
                    firstColon = i;
                } else {
                    // Ditemukan method dan ID
                    return true;
                }
            }
        }
        return false; // Tidak ditemukan method atau ID yang cukup
    }

    /**
     * @dev Mengekstrak bagian metode dari string DID.
     * Contoh: dari "did:example:123", akan mengembalikan "example".
     * @param _did String DID.
     * @return string memory Bagian metode dari DID.
     */
    function getMethod(string calldata _did) internal pure returns (string memory) {
        uint256 firstColon = 0;
        uint256 secondColon = 0;
        for (uint256 i = 0; i < bytes(_did).length; i++) {
            if (bytes(_did)[i] == bytes1(':')) {
                if (firstColon == 0) {
                    firstColon = i;
                } else if (secondColon == 0) {
                    secondColon = i;
                    break;
                }
            }
        }
        if (firstColon > 0 && secondColon > firstColon) {
            return _did[firstColon + 1 : secondColon];
        }
        return ""; // Atau revert jika format tidak valid
    }

    /**
     * @dev Mengekstrak bagian ID dari string DID.
     * Contoh: dari "did:example:123", akan mengembalikan "123".
     * @param _did String DID.
     * @return string memory Bagian ID dari DID.
     */
    function getId(string calldata _did) internal pure returns (string memory) {
        uint256 firstColon = 0;
        uint256 secondColon = 0;
        for (uint256 i = 0; i < bytes(_did).length; i++) {
            if (bytes(_did)[i] == bytes1(':')) {
                if (firstColon == 0) {
                    firstColon = i;
                } else if (secondColon == 0) {
                    secondColon = i;
                    break;
                }
            }
        }
        if (secondColon > 0) {
            return _did[secondColon + 1 :];
        }
        return ""; // Atau revert jika format tidak valid
    }
}