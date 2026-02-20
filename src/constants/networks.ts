import type { Chain } from "viem";

export type SupportedNetworkKey = "etherlink" | "somnia";

// Etherlink (Shadownet / testnet)
export const etherlinkTestnet = {
  id: 127823,
  name: "Etherlink Shadownet",
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
  rpcUrls: {
    default: { http: ["https://node.shadownet.etherlink.com"] },
    public: { http: ["https://node.shadownet.etherlink.com"] },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Explorer",
      url: "https://testnet.explorer.etherlink.com/",
    },
  },
} as const satisfies Chain;

// Somnia (Dream testnet)
// RPC + chainId inferred from the current hardhat config in this repo.
export const somniaTestnet = {
  id: 50312,
  name: "Somnia Dream Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "SOM",
    symbol: "SOM",
  },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network/"] },
    public: { http: ["https://dream-rpc.somnia.network/"] },
  },
  blockExplorers: {
    // If Somnia provides an explorer URL, override via env NEXT_PUBLIC_EXPLORER_URL/...
    default: {
      name: "Somnia Docs",
      url: "https://docs.somnia.network/",
    },
  },
} as const satisfies Chain;

export const supportedNetworks: Record<SupportedNetworkKey, Chain> = {
  etherlink: etherlinkTestnet,
  somnia: somniaTestnet,
};

export function getSelectedNetworkKey(): SupportedNetworkKey {
  const raw = (process.env.NEXT_PUBLIC_NETWORK ?? "etherlink").toLowerCase();
  return raw === "somnia" ? "somnia" : "etherlink";
}

export function getSelectedChain(): Chain {
  return supportedNetworks[getSelectedNetworkKey()];
}

/**
 * RPC selection order:
 *  1) NEXT_PUBLIC_<NETWORK>_RPC_URL (e.g. NEXT_PUBLIC_SOMNIA_RPC_URL)
 *  2) NEXT_PUBLIC_RPC_URL (generic override)
 *  3) default RPC for that chain
 */
export function getSelectedRpcUrl(): string {
  const key = getSelectedNetworkKey();

  const perNetwork =
    key === "somnia"
      ? process.env.NEXT_PUBLIC_SOMNIA_RPC_URL
      : process.env.NEXT_PUBLIC_ETHERLINK_RPC_URL;

  return (
    perNetwork ||
    process.env.NEXT_PUBLIC_RPC_URL ||
    supportedNetworks[key].rpcUrls.default.http[0]!
  );
}

/**
 * Contract address selection order:
 *  1) NEXT_PUBLIC_<NETWORK>_CONTRACT_ADDRESS
 *  2) NEXT_PUBLIC_CONTRACT_ADDRESS (legacy)
 */
export function getSelectedContractAddress(): `0x${string}` | undefined {
  const key = getSelectedNetworkKey();
  const perNetwork =
    key === "somnia"
      ? process.env.NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS
      : process.env.NEXT_PUBLIC_ETHERLINK_CONTRACT_ADDRESS;

  const addr = perNetwork || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  return addr as `0x${string}` | undefined;
}
