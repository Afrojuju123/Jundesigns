import fs from "fs";
import path from "path";
import { pesapalClient } from "../src/lib/booking/pesapal/client.ts";

// Read .env.local manually if running via tsx/node
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

async function main() {
  console.log("=== Pesapal API 3.0 IPN Registration ===");
  const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
  const targetIpnUrl = `${appUrl}/api/pesapal/ipn`;
  console.log(`Environment: ${process.env.PESAPAL_ENV || "sandbox"}`);
  console.log(`Target IPN URL: ${targetIpnUrl}`);

  try {
    console.log("Fetching registered IPN URLs from Pesapal...");
    const existingList = await pesapalClient.getIpnList();
    console.log(`Found ${existingList.length} registered IPNs in Pesapal.`);

    const match = existingList.find(
      (item) => item.url && item.url.toLowerCase() === targetIpnUrl.toLowerCase()
    );

    let ipnId = "";
    if (match) {
      console.log("\n[SUCCESS] Found existing IPN registration for this URL!");
      console.log(`IPN ID: ${match.ipn_id}`);
      console.log(`Created Date: ${match.created_date}`);
      ipnId = match.ipn_id;
    } else {
      console.log(`\nRegistering new IPN URL with Pesapal...`);
      const registration = await pesapalClient.registerIpn(targetIpnUrl, "GET");
      console.log("[SUCCESS] IPN successfully registered!");
      console.log(`IPN ID: ${registration.ipn_id}`);
      console.log(`Status: ${registration.status}`);
      ipnId = registration.ipn_id;
    }

    // Check if we should update .env.local
    if (fs.existsSync(envPath) && ipnId) {
      let envContent = fs.readFileSync(envPath, "utf8");
      if (envContent.includes("PESAPAL_IPN_ID=")) {
        envContent = envContent.replace(
          /^PESAPAL_IPN_ID=.*$/m,
          `PESAPAL_IPN_ID=${ipnId}`
        );
      } else {
        envContent += `\nPESAPAL_IPN_ID=${ipnId}\n`;
      }
      fs.writeFileSync(envPath, envContent, "utf8");
      console.log(`\nUpdated .env.local with PESAPAL_IPN_ID=${ipnId}`);
    }

    console.log("\nRegistration complete. Add this to your production environment when going live:");
    console.log(`PESAPAL_IPN_ID=${ipnId}`);
  } catch (err: any) {
    console.error("\n[ERROR] IPN Registration failed:", err.message);
    process.exit(1);
  }
}

main();
