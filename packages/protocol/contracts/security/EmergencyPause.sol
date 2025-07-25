// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

// Kontrak EmergencyPause memungkinkan pemilik untuk menghentikan sementara operasi kritis.
// Kontrak lain dapat mewarisi dari ini atau memanggil modifikasi state untuk pause/unpause.
contract EmergencyPause is Ownable {
    bool public paused; // Status pause: true jika di-pause, false jika tidak

    // Event yang dipancarkan ketika status pause berubah
    event Paused(address account);
    event Unpaused(address account);

    /**
     * @dev Constructor kontrak. Pemilik awal adalah yang mendeploy.
     */
    constructor() Ownable(msg.sender) {
        paused = false; // Secara default tidak di-pause
    }

    /**
     * @dev Menghentikan sementara operasi kritis.
     * Hanya pemilik kontrak yang dapat memanggil fungsi ini.
     */
    function pause() external onlyOwner {
        require(!paused, "Already paused");
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Melanjutkan operasi kritis.
     * Hanya pemilik kontrak yang dapat memanggil fungsi ini.
     */
    function unpause() external onlyOwner {
        require(paused, "Not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @dev Modifier yang menghentikan eksekusi jika kontrak di-pause.
     * Digunakan pada fungsi yang harus dihentikan sementara.
     */
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    /**
     * @dev Modifier yang hanya mengizinkan eksekusi jika kontrak di-pause.
     * Berguna untuk fungsi yang hanya bisa dijalankan saat di-pause (misalnya, upgrade).
     */
    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }
}