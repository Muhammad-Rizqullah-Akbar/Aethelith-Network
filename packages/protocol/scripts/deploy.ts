import { ethers, artifacts } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting deployment script...");

  // Dapatkan deployer (akun pertama dari Ganache)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // === Deploy Contracts ===

  // Dapatkan semua nama kontrak dari Hardhat artifacts
  const contractNames = [
    "DIDRegistry",
    "VCKycSchema",
    "VCKycIssuer",
    "VCRevocationRegistry",
    "ZKPVerifierRouter",
    "SmartAccountFactory",
    "EmergencyPause",
    "SecurityAuditLog",
  ];

  const deployedAddresses: { [key: string]: string } = {};

  for (const contractName of contractNames) {
    console.log(`\nDeploying ${contractName}...`);
    try {
      const ContractFactory = await ethers.getContractFactory(contractName);
      const contract = await ContractFactory.deploy();
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      console.log(`${contractName} deployed to:`, address);
      deployedAddresses[contractName] = address;
    } catch (error) {
      console.error(`Failed to deploy ${contractName}:`, error);
      process.exitCode = 1;
      return; // Hentikan deployment jika ada yang gagal
    }
  }

  console.log("\nAll core contracts deployed successfully!");

  // Simpan alamat kontrak ke file deployed_contracts.json
  const deployedAddressesPath = path.join(__dirname, "..", "deployed_contracts.json");
  fs.writeFileSync(
    deployedAddressesPath,
    JSON.stringify(deployedAddresses, null, 2)
  );
  console.log("Deployed contract addresses saved to deployed_contracts.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});