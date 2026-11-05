import { spawn } from "child_process";
import http from "http";

function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (res) => {
          resolve();
        })
        .on("error", (err) => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Timeout waiting for server at ${url}: ${err.message}`));
          } else {
            setTimeout(check, 300);
          }
        });
    };
    check();
  });
}

async function main() {
  const testArgs = process.argv.slice(2);
  console.log("Starting Next.js production server on http://localhost:3000...");
  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    shell: true,
    stdio: "pipe",
  });

  server.stdout.on("data", (d) => process.stdout.write("[server] " + d));
  server.stderr.on("data", (d) => process.stderr.write("[server] " + d));

  try {
    await waitForServer("http://localhost:3000", 25000);
    console.log("Server is ready! Running Playwright tests:", testArgs.join(" "));

    const playwright = spawn("npx", ["playwright", "test", ...testArgs], {
      shell: true,
      stdio: "inherit",
    });

    const code = await new Promise((resolve) => {
      playwright.on("close", resolve);
    });

    console.log("Playwright tests finished with exit code:", code);
    if (code !== 0) {
      process.exitCode = code;
    }
  } finally {
    console.log("Terminating Next.js server...");
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
