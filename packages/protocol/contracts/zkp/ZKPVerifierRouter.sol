// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ZKProofVerifierBase } from "./ZKProofVerifierBase.sol";

// Kontrak ZKPVerifierRouter akan mengelola dan mengarahkan verifikasi bukti ZKP
// ke verifier spesifik yang terdaftar.
contract ZKPVerifierRouter is Ownable {
    // Pemetaan dari ID verifier (misalnya, hash dari skema bukti) ke alamat kontrak verifier spesifik.
    mapping(bytes32 => address) public verifiers;

    // Event yang dipancarkan ketika verifier baru terdaftar.
    event VerifierRegistered(bytes32 indexed verifierId, address indexed verifierAddress);

    // Event yang dipancarkan ketika verifier dihapus.
    event VerifierRemoved(bytes32 indexed verifierId, address indexed verifierAddress);

    // Event yang dipancarkan ketika bukti berhasil diverifikasi.
    event ProofVerified(bytes32 indexed verifierId, bytes32 indexed proofHash);

    /**
     * @dev Constructor kontrak. Pemilik awal adalah yang mendeploy kontrak.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Mendaftarkan verifier ZKP baru untuk ID verifier tertentu.
     * Hanya pemilik kontrak yang dapat memanggil fungsi ini.
     * @param _verifierId ID unik untuk verifier ini (misalnya, keccak256 dari string nama bukti).
     * @param _verifierAddress Alamat kontrak dari verifier ZKP spesifik.
     */
    function registerVerifier(bytes32 _verifierId, address _verifierAddress) external onlyOwner {
        require(_verifierAddress != address(0), "Verifier address cannot be zero");
        require(verifiers[_verifierId] == address(0), "Verifier ID already registered");
        verifiers[_verifierId] = _verifierAddress;
        emit VerifierRegistered(_verifierId, _verifierAddress);
    }

    /**
     * @dev Menghapus verifier ZKP yang terdaftar.
     * Hanya pemilik kontrak yang dapat memanggil fungsi ini.
     * @param _verifierId ID dari verifier yang akan dihapus.
     */
    function removeVerifier(bytes32 _verifierId) external onlyOwner {
        address verifierAddress = verifiers[_verifierId];
        require(verifierAddress != address(0), "Verifier ID not found");
        delete verifiers[_verifierId];
        emit VerifierRemoved(_verifierId, verifierAddress);
    }

    /**
     * @dev Memverifikasi bukti ZKP menggunakan verifier yang terdaftar.
     * @param _verifierId ID dari verifier yang akan digunakan.
     * @param _a Input proof `a`.
     * @param _b Input proof `b`.
     * @param _c Input proof `c`.
     * @param _input Input publik untuk bukti.
     * @return true jika bukti valid, false jika tidak.
     */
    function verify(
        bytes32 _verifierId,
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[1] memory _input
    ) public returns (bool) {
        address verifierAddress = verifiers[_verifierId];
        require(verifierAddress != address(0), "Verifier not registered for this ID");

        // Panggil fungsi verifyProof di kontrak verifier spesifik
        bool isValid = ZKProofVerifierBase(verifierAddress).verifyProof(_a, _b, _c, _input);

        require(isValid, "Proof verification failed");

        // Emit event jika bukti berhasil diverifikasi
        emit ProofVerified(_verifierId, keccak256(abi.encodePacked(_a, _b, _c, _input)));

        return true;
    }

    /**
     * @dev Mendapatkan alamat verifier untuk ID verifier tertentu.
     * @param _verifierId ID dari verifier.
     * @return Alamat kontrak verifier.
     */
    function getVerifierAddress(bytes32 _verifierId) external view returns (address) {
        return verifiers[_verifierId];
    }
}