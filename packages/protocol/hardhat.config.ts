import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ganache: {
        url: "http://192.168.1.5:7545", // <-- SESUAIKAN DENGAN IP GANACHE UI ANDA
        accounts: [ "0x44c6ae3887274aea072e252de2e1e8ef0ebcb798f78cdb093dfe1c51286ce17d" ] // <-- GANTI DENGAN PRIVATE KEY ANDA
    },
  },
  paths: {
    sources: "./contracts", // Arahkan Hardhat ke folder contracts/
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    scripts: "./scripts"
  },
};

export default config;