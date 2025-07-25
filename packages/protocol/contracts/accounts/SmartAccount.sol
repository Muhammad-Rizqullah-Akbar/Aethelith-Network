// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

// Kontrak SmartAccount akan bertindak sebagai akun yang dapat diprogram.
// Ini adalah implementasi dasar yang bisa diperluas untuk mendukung fitur seperti
// multi-signature, social recovery, atau abstraksi akun.
contract SmartAccount is Ownable, ReentrancyGuard {
    // Event yang dipancarkan ketika Smart Account menerima Ether
    event EtherReceived(address indexed sender, uint256 amount);

    // Constructor kontrak. Pemilik awal akun adalah yang mendeploy akun ini (atau melalui Factory).
    constructor(address initialOwner) Ownable(initialOwner) {}

    receive() external payable nonReentrant {
        emit EtherReceived(msg.sender, msg.value);
    }

    function sendEther(address payable _to, uint256 _amount) external onlyOwner nonReentrant {
        require(_amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

    function sendERC20(address _token, address _to, uint256 _amount) external onlyOwner nonReentrant {
        IERC20 token = IERC20(_token);
        require(token.transfer(_to, _amount), "Failed to send ERC20");
    }

    function executeCall(address _to, uint256 _value, bytes calldata _data) external onlyOwner nonReentrant returns (bool success, bytes memory result) {
        (success, result) = _to.call{value: _value}(_data);
        require(success, "External call failed");
    }
}