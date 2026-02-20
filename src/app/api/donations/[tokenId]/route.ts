import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { contractAbi } from "@/constants";
import { contractAddress } from "@/constants";
import { getSelectedChain, getSelectedRpcUrl } from "@/constants/networks";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  try {
    console.log("API route called for tokenId:", params.tokenId);
    const tokenId = parseInt(params.tokenId);

    if (isNaN(tokenId)) {
      console.error("Invalid tokenId:", params.tokenId);
      return NextResponse.json({ error: "Invalid token ID" }, { status: 400 });
    }

    if (!contractAddress) {
      console.error("Contract address not configured");
      return NextResponse.json({ error: "Contract address not configured" }, { status: 500 });
    }

    console.log("Using contract address:", contractAddress);
    console.log("Fetching donations for tokenId:", tokenId);

    const chain = getSelectedChain();
    const rpcUrl = getSelectedRpcUrl();

    const client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

    console.log("Created RPC client, fetching events...");

    // Get donation events for this token
    const logs = await client.getContractEvents({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      eventName: "DonationReceived",
      args: {
        tokenId: BigInt(tokenId),
      },
      fromBlock: BigInt(0),
      toBlock: "latest",
    });

    console.log(`Found ${logs.length} donation events for token ${tokenId}`);

    const donations = logs.map((log: any) => ({
      donor: log.args?.donor as string,
      amount: log.args?.amount?.toString() || "0",
      blockNumber: log.blockNumber.toString(),
      transactionHash: log.transactionHash,
    }));

    console.log("Returning donations:", donations);
    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
