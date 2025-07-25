// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

// Kontrak SecurityAuditLog berfungsi sebagai log yang tidak dapat diubah untuk mencatat
// peristiwa keamanan penting atau tindakan audit.
contract SecurityAuditLog is Ownable {
    // Struktur untuk entri log
struct LogEntry {
    uint256 timestamp;
    address caller; // Alamat yang memicu log
    string message;
    bytes data;
}

    // Array untuk menyimpan semua entri log
    LogEntry[] public auditLogs;

    // Event yang dipancarkan ketika entri log baru ditambahkan
    event AuditLogAdded(uint256 indexed index, address indexed caller, string message);

    /**
     * @dev Constructor kontrak. Pemilik log adalah yang mendeploy.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Menambahkan entri ke log audit.
     * Hanya pemilik kontrak yang dapat memanggil fungsi ini.
     * @param _message Pesan deskriptif untuk log.
     * @param _data Data tambahan terkait peristiwa (opsional).
     */
    function addLog(string calldata _message, bytes calldata _data) external onlyOwner {
        auditLogs.push(
            LogEntry({
                timestamp: block.timestamp,
                caller: msg.sender,
                message: _message,
                data: _data
            })
        );
        emit AuditLogAdded(auditLogs.length - 1, msg.sender, _message);
    }

    /**
     * @dev Mendapatkan jumlah total entri log.
     * @return uint256 Jumlah entri log.
     */
    function getLogCount() external view returns (uint256) {
        return auditLogs.length;
    }
}