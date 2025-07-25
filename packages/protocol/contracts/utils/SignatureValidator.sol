// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Library untuk memvalidasi tanda tangan EIP-191 dan EIP-712.
// Ini sangat penting untuk otentikasi off-chain atau verifikasi pesan.
library SignatureValidator {
    /**
     * @dev Memverifikasi tanda tangan EIP-191.
     * Ini adalah standar untuk menandatangani pesan arbitrer.
     * @param _signer Alamat yang diharapkan menandatangani pesan.
     * @param _messageHash Keccak256 hash dari pesan yang ditandatangani.
     * @param _signature Tanda tangan (bytes).
     * @return bool true jika tanda tangan valid, false jika tidak.
     */
    function isValidSignature(
        address _signer,
        bytes32 _messageHash,
        bytes memory _signature
    ) internal pure returns (bool) {
        // Memastikan panjang tanda tangan standar (65 bytes untuk v, r, s)
        if (_signature.length != 65) {
            return false;
        }

        bytes32 r;
        bytes32 s;
        uint8 v;

        // Memisahkan tanda tangan menjadi r, s, dan v
        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }

        // Memastikan v adalah 27 atau 28 (untuk kompatibilitas EIP-155)
        // Atau 0/1 jika belum diperbaiki (tapi 27/28 lebih aman)
        if (v < 27) {
            v += 27;
        }
        if (v != 27 && v != 28) {
            return false;
        }

        // Rekonstruksi alamat dari tanda tangan
        address recoveredAddress = ecrecover(
            // Pesan yang ditandatangani harus diawali dengan "\x19Ethereum Signed Message:\n"
            // dan panjang pesan. Ini adalah standar EIP-191.
            keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", uintToBytes(_messageHash.length), _messageHash)),
            v,
            r,
            s
        );

        // Membandingkan alamat yang dipulihkan dengan alamat penanda tangan yang diharapkan
        return recoveredAddress == _signer;
    }

    // Fungsi utilitas untuk mengubah uint menjadi bytes (diperlukan untuk EIP-191 padding)
    function uintToBytes(uint256 x) private pure returns (bytes memory b) {
        b = new bytes(32);
        assembly { mstore(add(b, 32), x) }
    }
}