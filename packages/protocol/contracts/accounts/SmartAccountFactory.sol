// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { SmartAccount } from "./SmartAccount.sol"; // Import kontrak SmartAccount Anda
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol"; 



// Kontrak SmartAccountFactory akan membuat dan mengelola SmartAccount baru.
contract SmartAccountFactory is Ownable {
    // Event yang dipancarkan ketika Smart Account baru dibuat.
    event SmartAccountCreated(address indexed owner, address indexed newAccount);

    /**
     * @dev Constructor kontrak. Pemilik factory adalah yang mendeploy.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Membuat Smart Account baru untuk pemilik tertentu.
     * Hanya pemilik factory yang dapat memanggil fungsi ini (opsional, bisa diubah).
     * @param _owner Alamat yang akan menjadi pemilik awal dari Smart Account baru.
     * @return newAccount Alamat dari Smart Account yang baru dibuat.
     */
    function createSmartAccount(address _owner) external onlyOwner returns (address newAccount) {
        require(_owner != address(0), "Owner cannot be zero address");
        newAccount = address(new SmartAccount(_owner));
        emit SmartAccountCreated(_owner, newAccount);
    }

    /**
     * @dev Mendapatkan alamat Smart Account yang akan dibuat untuk pemilik tertentu
     * tanpa benar-benar membuatnya (menggunakan create2).
     * Catatan: Implementasi create2 lebih kompleks dan membutuhkan nonce.
     * Untuk kesederhanaan, ini hanya fungsi placeholder.
     * Implementasi riil akan melibatkan `CREATE2` opcode dan `bytecode` kontrak.
     * Ini hanya contoh fungsi untuk menunjukkan tujuannya.
     *
     * Untuk sekarang, kita hanya akan mengembalikan address(0) sebagai placeholder
     * karena implementasi `CREATE2` di Foundry butuh lebih banyak setup (misalnya `salt`).
     */
    // function predictSmartAccountAddress(address _owner, bytes32 _salt) external view returns (address) {
    //     // Implementasi CREATE2 akan masuk di sini
    //     return address(0); // Placeholder
    // }
}