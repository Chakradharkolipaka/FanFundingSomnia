# Fan Funding Platform (Etherlink + Somnia testnets)

A decentralized fan funding platform where creators can mint NFTs and receive direct funding from their supporters.

This repo now supports **multiple EVM testnets**:

- **Etherlink Shadownet** (default)
- **Somnia Dream Testnet** (https://docs.somnia.network/)

You can switch the active target network using an environment variable (or an interactive script).

## 🌐 Supported networks

### Etherlink Shadownet

- Chain ID: **127823**
- Default RPC: `https://node.shadownet.etherlink.com`

### Somnia Dream Testnet

- Chain ID: **50312**
- Default RPC: `https://dream-rpc.somnia.network/`

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, RainbowKit
- **Smart Contracts**: Solidity 0.8.20, Hardhat
- **Blockchain**: Etherlink + Somnia testnets
- **Storage**: IPFS via Pinata

## 📦 Installation

```bash
npm install --legacy-peer-deps
```

## 🔧 Configure environment variables

Create a `.env.local` in `FanDonorOnEtherLink-main/`.

Minimum recommended variables:

- `NEXT_PUBLIC_NETWORK` = `etherlink` or `somnia`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_PINATA_JWT`

Contract address (multi-network supported):

- `NEXT_PUBLIC_ETHERLINK_CONTRACT_ADDRESS` (when `NEXT_PUBLIC_NETWORK=etherlink`)
- `NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS` (when `NEXT_PUBLIC_NETWORK=somnia`)

RPC config:

- `NEXT_PUBLIC_ETHERLINK_RPC_URL` (optional)
- `NEXT_PUBLIC_SOMNIA_RPC_URL` (optional)
- `NEXT_PUBLIC_RPC_URL` (legacy/generic fallback)

Legacy support:

- `NEXT_PUBLIC_CONTRACT_ADDRESS` still works as a fallback if you don’t want per-network addresses.

## 🔀 Switch networks (interactive)

Run the helper and choose `etherlink` or `somnia`. It updates `.env.local`.

```bash
npm run network:select
```

Then restart the dev server.

## 🔧 Development

```bash
npm run dev
```

## 🌐 Deployment

The app can be deployed on Vercel.

Environment variables needed (recommended):

- `NEXT_PUBLIC_NETWORK`
- `NEXT_PUBLIC_ETHERLINK_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_ETHERLINK_RPC_URL` (optional)
- `NEXT_PUBLIC_SOMNIA_RPC_URL` (optional)
- `NEXT_PUBLIC_PINATA_JWT`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

If you keep using the original single-network approach, you can still use:

- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_RPC_URL`

