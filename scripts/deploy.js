import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  console.log(" Starting deployment (Direct Method)...");

  // 1. Load the compiled contract artifact
  // This file was created when you ran 'npx hardhat compile'
  const artifactPath = "./artifacts/contracts/NFTDonation.sol/NFTDonation.json";

  if (!fs.existsSync(artifactPath)) {
    console.error(" Error: Artifact not found. Run 'npx hardhat compile' first.");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const abi = artifact.abi;
  const bytecode = artifact.bytecode;

  // 2. Setup Provider and Wallet
  const network = (process.env.NEXT_PUBLIC_NETWORK || "etherlink").toLowerCase();
  const rpcUrl =
    (network === "somnia"
      ? process.env.NEXT_PUBLIC_SOMNIA_RPC_URL
      : process.env.NEXT_PUBLIC_ETHERLINK_RPC_URL) ||
    process.env.NEXT_PUBLIC_RPC_URL ||
    (network === "somnia"
      ? "https://dream-rpc.somnia.network/"
      : "https://node.shadownet.etherlink.com");
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.error(" Error: PRIVATE_KEY not found in .env.local");
    process.exit(1);
  }

  // Connect to the selected testnet
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`🔌 Connected to wallet: ${wallet.address}`);
  console.log(`🌐 Network selection: ${network}`);
  console.log(`🛰️  RPC: ${rpcUrl}`);

  // 3. Create the Factory
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  // 4. Deploy
  console.log(" Sending deployment transaction...");
  const contract = await factory.deploy();

  console.log(" Waiting for transaction to be mined...");
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("----------------------------------------------------");
  console.log(` NFTDonation Deployed Successfully!`);
  console.log(` Contract Address: ${address}`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});