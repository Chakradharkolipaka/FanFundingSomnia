import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

const presets = {
  etherlink: {
    NEXT_PUBLIC_NETWORK: "etherlink",
    NEXT_PUBLIC_RPC_URL: "https://node.shadownet.etherlink.com",
  },
  somnia: {
    NEXT_PUBLIC_NETWORK: "somnia",
    NEXT_PUBLIC_RPC_URL: "https://dream-rpc.somnia.network/",
  },
};

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}

function parseEnv(content) {
  const out = new Map();
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;
    out.set(key, value);
  }
  return out;
}

function stringifyEnv(map) {
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n")
    .concat("\n");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((res) => rl.question(q, res));

  const choiceRaw = (await ask("Select network (etherlink/somnia): ")).trim().toLowerCase();
  rl.close();

  const choice = choiceRaw === "somnia" ? "somnia" : "etherlink";
  const existing = readEnvFile(envPath);
  const env = parseEnv(existing);

  // apply preset
  for (const [k, v] of Object.entries(presets[choice])) {
    env.set(k, v);
  }

  // helpful hints for multi-network deployments
  env.set(
    "NEXT_PUBLIC_ETHERLINK_CONTRACT_ADDRESS",
    env.get("NEXT_PUBLIC_ETHERLINK_CONTRACT_ADDRESS") ?? ""
  );
  env.set(
    "NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS",
    env.get("NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS") ?? ""
  );

  fs.writeFileSync(envPath, stringifyEnv(env), "utf8");

  console.log(`Updated ${envPath}`);
  console.log(`NEXT_PUBLIC_NETWORK=${presets[choice].NEXT_PUBLIC_NETWORK}`);
  console.log(`NEXT_PUBLIC_RPC_URL=${presets[choice].NEXT_PUBLIC_RPC_URL}`);
  console.log("\nIf you changed NEXT_PUBLIC_NETWORK, restart `npm run dev`.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
