import { ethers } from "hardhat";

async function main() {
  // Dapatkan deployer (akun pertama dari Hardhat Network atau Ganache)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // --- Deploy Contracts ---

  // 1. Deploy DIDRegistry
  const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
  const didRegistry = await DIDRegistry.deploy();
  await didRegistry.waitForDeployment();
  console.log("DIDRegistry deployed to:", await didRegistry.getAddress());

  // 2. Deploy VCKycSchema
  const VCKycSchema = await ethers.getContractFactory("VCKycSchema");
  const vcKycSchema = await VCKycSchema.deploy();
  await vcKycSchema.waitForDeployment();
  console.log("VCKycSchema deployed to:", await vcKycSchema.getAddress());

  // 3. Deploy VCKycIssuer
  const VCKycIssuer = await ethers.getContractFactory("VCKycIssuer");
  const vcKycIssuer = await VCKycIssuer.deploy(await didRegistry.getAddress(), await vcKycSchema.getAddress());
  await vcKycIssuer.waitForDeployment();
  console.log("VCKycIssuer deployed to:", await vcKycIssuer.getAddress());

  // 4. Deploy VCRevocationRegistry
  const VCRevocationRegistry = await ethers.getContractFactory("VCRevocationRegistry");
  const vcRevocationRegistry = await VCRevocationRegistry.deploy();
  await vcRevocationRegistry.waitForDeployment();
  console.log("VCRevocationRegistry deployed to:", await vcRevocationRegistry.getAddress());

  // 5. Deploy ZKPVerifierRouter
  const ZKPVerifierRouter = await ethers.getContractFactory("ZKPVerifierRouter");
  const zkpVerifierRouter = await ZKPVerifierRouter.deploy();
  await zkpVerifierRouter.waitForDeployment();
  console.log("ZKPVerifierRouter deployed to:", await zkpVerifierRouter.getAddress());

  // 6. Deploy SmartAccountFactory
  const SmartAccountFactory = await ethers.getContractFactory("SmartAccountFactory");
  const smartAccountFactory = await SmartAccountFactory.deploy();
  await smartAccountFactory.waitForDeployment();
  console.log("SmartAccountFactory deployed to:", await smartAccountFactory.getAddress());

  // 7. Deploy EmergencyPause
  const EmergencyPause = await ethers.getContractFactory("EmergencyPause");
  const emergencyPause = await EmergencyPause.deploy();
  await emergencyPause.waitForDeployment();
  console.log("EmergencyPause deployed to:", await emergencyPause.getAddress());

  // 8. Deploy SecurityAuditLog
  const SecurityAuditLog = await ethers.getContractFactory("SecurityAuditLog");
  const securityAuditLog = await SecurityAuditLog.deploy();
  await securityAuditLog.waitForDeployment();
  console.log("SecurityAuditLog deployed to:", await securityAuditLog.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});