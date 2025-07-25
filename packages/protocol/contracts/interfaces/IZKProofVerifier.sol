// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface untuk verifier Zero-Knowledge Proof.
// Ini mendefinisikan fungsi verifikasi bukti yang harus diimplementasikan
// oleh setiap verifier ZKP spesifik (misalnya, yang dihasilkan oleh snarkjs).
interface IZKProofVerifier {
    /**
     * @dev Fungsi untuk memverifikasi bukti ZKP.
     * @param a Input proof `a`.
     * @param b Input proof `b`.
     * @param c Input proof `c`.
     * @param input Input publik untuk bukti.
     * @return bool true jika bukti valid, false jika tidak.
     */
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external view returns (bool);
}