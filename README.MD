# KYC-DID Protocol Global Monorepo

Welcome to the **KYC-DID Protocol Global** monorepo! This repository houses the complete ecosystem for a decentralized Know-Your-Customer (KYC) solution leveraging Decentralized Identifiers (DIDs), Verifiable Credentials (VCs), and Zero-Knowledge Proofs (ZKPs).

## Table of Contents

- [**Getting Started (Quick Setup)**](#getting-started-quick-setup)
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Technology Stack](#technology-stack)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

<a name="getting-started-quick-setup"></a>
## Getting Started (Quick Setup)

1.  **Clone the repository:** `git clone <your-repo-url>`
2.  **Navigate into the project root:** `cd kyc-did-protocol-global`
3.  **Ensure all [Prerequisites](#prerequisites) are installed in your WSL environment.**
4.  **Install project dependencies:** `pnpm install`
5.  **Start hacking!** (Further detailed instructions for running specific apps will be provided in relevant sub-sections).

---

## Prerequisites

To get this project up and running on your local machine, you'll need to install several essential tools. For the best and most consistent development experience, we highly recommend using **Windows Subsystem for Linux (WSL2)** with a Linux distribution (e.g., Ubuntu) and **VS Code Remote - WSL Extension.**.

Below is the definitive list of required tools and their recommended versions.

### 1. Core Development Environment (WSL2 & VS Code)

* **Windows Subsystem for Linux (WSL2):**
    * **Description:** Enables running a Linux environment directly on Windows, providing access to Linux-native tools crucial for blockchain and ZKP development.
    * **Recommended Version:** WSL2 (ensure it's updated)
    * **Installation Guide:** [Microsoft Docs: Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

* **VS Code Remote - WSL Extension:**
    * **Description:** Integrates Visual Studio Code directly with your WSL environment, allowing seamless development within Linux while using the VS Code UI on Windows.
    * **Installation:** Search "Remote - WSL" in VS Code Extensions marketplace.

* **Git:**
    * **Description:** Version control system for tracking changes in the codebase.
    * **Recommended Version:** Latest stable (e.g., `git --version` >= 2.30)
    * **Installation:** `sudo apt install git` (inside WSL)

### 2. JavaScript/TypeScript Ecosystem

* **Node.js:**
    * **Description:** JavaScript runtime environment. Essential for our web, mobile, API gateway, SDK, and ZKP prover services.
    * **Recommended Version:** LTS (Long Term Support), e.g., `v20.x.x` or `v22.x.x`
    * **Installation:** Highly recommend using `nvm` (Node Version Manager) for easy version switching.
        ```bash
        curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh) | bash
        source ~/.bashrc # or ~/.zshrc
        nvm install --lts && nvm use --lts
        ```

* **pnpm:**
    * **Description:** Fast, disk-space efficient package manager used for this monorepo. It performs well with large, interdependent projects.
    * **Recommended Version:** Latest stable (e.g., `pnpm -v` >= 9.0.0)
    * **Installation:** `npm install -g pnpm` (after Node.js is installed)

* **Nx:**
    * **Description:** Powerful monorepo development toolkit that optimizes build, test, and linting processes across all projects (apps and packages).
    * **Recommended Version:** Latest stable (installed as a `devDependency` in root `package.json` by `npx nx init`)
    * **Installation (via `npx nx init`):**
        ```bash
        pnpm add -D nx -w
        npx nx init # Follow guided prompts: Integrated, Yes for package.json scripts, Yes for Nx Console
        ```

* **ESLint & Prettier:**
    * **Description:** Code linting and formatting tools to ensure consistent code style and quality across the entire TypeScript monorepo.
    * **Installation:** Managed by Nx and `pnpm install` in the root. Configured via `.eslintrc.json`, `prettier.config.js`.

### 3. Blockchain & Smart Contract Development

* **Foundry:**
    * **Description:** Blazingly fast, portable, and modular toolkit for Ethereum application development written in Rust. Includes `forge` (for testing, deploying) and `cast` (for EVM interaction).
    * **Recommended Version:** Latest stable (e.g., `forge --version` >= 1.2.x)
    * **Installation:**
        ```bash
        curl -L [https://foundry.paradigm.xyz](https://foundry.paradigm.xyz) | bash
        source ~/.bashrc # or ~/.zshrc
        foundryup
        ```

### 4. Zero-Knowledge Proof (ZKP) Tooling

* **Circom:**
    * **Description:** A DSL (Domain Specific Language) for writing arithmetic circuits (ZKP circuits) and their compiler.
    * **Recommended Version:** Latest stable (e.g., `circom --version` >= 0.5.x)
    * **Installation:** `npm install -g circom` (inside WSL)

* **snarkjs:**
    * **Description:** A powerful JavaScript and WASM library for ZKP, used for trusted setups, generating proving/verification keys, and creating/verifying proofs.
    * **Recommended Version:** Latest stable (e.g., `snarkjs --version` >= 0.7.x)
    * **Installation:** `npm install -g snarkjs` (inside WSL)

### 5. Containerization

* **Docker & Docker Compose:**
    * **Description:** Essential for containerizing and orchestrating backend services (API Gateway, Provers), ensuring consistent and isolated development/production environments.
    * **Recommended Version:** Latest stable (e.g., `docker --version`, `docker compose version`)
    * **Installation Guide:** [Docker Docs: Install Docker Engine on Ubuntu (WSL)](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
        *(Remember to add your user to the `docker` group and restart WSL after installation.)*

---

## Technology Stack

This project leverages a modern, efficient, and scalable technology stack to deliver a robust decentralized KYC solution. Below are the core libraries and frameworks utilized across the monorepo:

### A. Core & Shared Utilities
* **TypeScript:** Primary programming language across the entire codebase.
* **ESLint & Prettier:** For consistent code quality and formatting standards.

### B. Frontend Applications
* **React:** Fundamental UI library for building user interfaces.
* **Next.js:** Production-grade React framework for the Web Application (SSR, SSG, API Routes).
* **React Native:** Cross-platform framework for the Mobile Application.
* **Tailwind CSS:** Utility-first CSS framework for efficient and consistent styling.
* **Wagmi:** React Hooks collection for seamless Web3 interactions (Web).
* **React Navigation:** Robust navigation solution for React Native.
* **`react-native-keychain`:** Secure storage for sensitive data on mobile devices.
* **Zustand:** Lightweight and scalable state management for frontend applications.

### C. Backend Services
* **NestJS:** A powerful, opinionated Node.js framework for building scalable and maintainable API Gateways.
* **Ethers.js:** Comprehensive JavaScript library for interacting with the Ethereum blockchain (from backend and SDK).
* **Prisma:** Next-generation ORM for type-safe database access (e.g., PostgreSQL), used if off-chain data persistence is required.
* **Passport.js:** Flexible authentication middleware for Node.js.

### D. Blockchain & Zero-Knowledge Proofs
* **Solidity:** Language for writing smart contracts on the Ethereum Virtual Machine (EVM).
* **OpenZeppelin Contracts:** Industry-standard, audited smart contract libraries for secure and upgradable implementations.
* **Circom (Language):** Domain-specific language for defining Zero-Knowledge Proof circuits.
* **snarkjs:** JavaScript library for ZKP trusted setups, proving, and verification.

### E. Data Validation
* **Zod:** A type-safe schema validation library, ensuring robust data integrity across application layers.

---
