// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol"; // Import Test.sol dari forge-std
import {DIDRegistry} from "../src/registry/DIDRegistry.sol"; // Import kontrak DIDRegistry Anda

contract DIDRegistryTest is Test {
    DIDRegistry public didRegistry; // Instance kontrak DIDRegistry

    // Fungsi setup akan dijalankan sebelum setiap test
    function setUp() public {
        didRegistry = new DIDRegistry(); // Deploy kontrak baru untuk setiap test
    }

    // Test case: Memastikan DID bisa didaftarkan dengan benar
    function testRegisterDID() public {
        string memory testDid = "did:kycdid:example123";
        address expectedOwner = address(this); // Pemilik diharapkan adalah alamat test ini

        // Panggil fungsi registerDID dari didRegistry
        didRegistry.registerDID(testDid);

        // Verifikasi bahwa pemilik DID sudah terdaftar dengan benar
        assertEq(didRegistry.getOwner(testDid), expectedOwner, "DID owner should match msg.sender");

        // Memancarkan event untuk debugging (opsional)
        // emit log_string("DID Registered: " + testDid);
    }

    // Test case: Memastikan tidak bisa mendaftarkan DID yang sudah ada
    function testCannotRegisterExistingDID() public {
        string memory testDid = "did:kycdid:example456";

        // Daftar DID pertama kali
        didRegistry.registerDID(testDid);

        // Coba daftarkan lagi, ini seharusnya gagal
        vm.expectRevert("DID already registered"); // Harap revert dengan pesan ini
        didRegistry.registerDID(testDid);
    }

    // Test case: Memastikan DID yang tidak terdaftar memiliki owner address(0)
    function testGetOwnerForUnregisteredDID() public {
        string memory testDid = "did:kycdid:unregistered";
        assertEq(didRegistry.getOwner(testDid), address(0), "Unregistered DID should return address(0)");
    }
}