# KYC-DID Protocol Global Monorepo

Welcome to the **KYC-DID Protocol Global** monorepo! This repository houses the complete ecosystem for a decentralized Know-Your-Customer (KYC) solution leveraging Decentralized Identifiers (DIDs), Verifiable Credentials (VCs), and Zero-Knowledge Proofs (ZKPs).

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started-quick-setup)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Prerequisites

To get this project up and running on your local machine, you'll need to install several essential tools. For the best and most consistent development experience, we highly recommend using **Windows Subsystem for Linux (WSL2)** with a Linux distribution (e.g., Ubuntu) and **VS Code Remote - WSL Extension**.

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

## Getting Started (Quick Setup)

1.  **Clone the repository:** `git clone <your-repo-url>`
2.  **Navigate into the project root:** `cd kyc-did-protocol-global`
3.  **Ensure all [Prerequisites](#prerequisites) are installed in your WSL environment.**
4.  **Install project dependencies:** `pnpm install`
5.  **Start hacking!** (Further detailed instructions for running specific apps will be provided in relevant sub-sections).
