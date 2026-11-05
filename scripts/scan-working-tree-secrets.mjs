import fs from "fs";
import path from "path";

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "data",
  "dist",
  "build",
  "coverage",
  ".system_generated",
  "scratch",
]);

const IGNORED_FILES = new Set([
  "package-lock.json",
  "next-err.log",
  "next-out.log",
]);

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".webp",
  ".avif",
  ".mp4",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".pdf",
]);

const SECRET_PATTERNS = [
  { name: "Private Key Header", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/i },
  { name: "Postgres Connection URI with Password", regex: /postgres(ql)?:\/\/[^:]+:[^@\s]+@/i },
  { name: "Generic Database URI with Password", regex: /(mongodb|mysql|redis):\/\/[^:]+:[^@\s]+@/i },
  { name: "AWS Access Key ID", regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
  { name: "AWS Secret Access Key", regex: /aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}/i },
  { name: "Bearer Token Hardcoded", regex: /['"]Bearer\s+[A-Za-z0-9\-._~+/]+=*['"]/i },
  { name: "Hardcoded Password Assignment", regex: /(password|passwd|pwd)\s*[:=]\s*["'][^"'\s]{6,}["']/i },
  { name: "Hardcoded API Key / Secret", regex: /(api_key|apikey|secret_key|consumer_secret|consumer_key)\s*[:=]\s*["'][^"'\s]{10,}["']/i },
  { name: "GitHub Personal Access Token", regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/ },
  { name: "Slack Token", regex: /xox[baprs]-[0-9A-Za-z_-]{10,}/ },
  { name: "Stripe Secret Key", regex: /sk_live_[0-9a-zA-Z]{24}/ },
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip empty lines or pure comments
    if (!line.trim() || line.trim().startsWith("//") || line.trim().startsWith("#")) {
      continue;
    }

    // Skip placeholder lines in example files or type definitions
    if (
      line.includes("process.env") ||
      line.includes("export interface") ||
      line.includes("export type") ||
      line.includes("regex:") ||
      line.includes("SECRET_PATTERNS")
    ) {
      continue;
    }

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(line)) {
        findings.push({
          file: filePath,
          line: i + 1,
          rule: pattern.name,
        });
      }
    }
  }

  return findings;
}

function walkDir(dir) {
  let findings = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      findings = findings.concat(walkDir(fullPath));
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(entry.name)) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (BINARY_EXTENSIONS.has(ext)) continue;

      // Notice: .env files (except .env.example) are checked to verify they are not tracked
      if (entry.name.startsWith(".env") && entry.name !== ".env.example") {
        findings.push({
          file: relPath,
          line: 1,
          rule: "Untracked local env file present (must be ignored by .gitignore)",
        });
        continue;
      }

      findings = findings.concat(scanFile(fullPath));
    }
  }

  return findings;
}

console.log("=== Working Tree Secret Scan ===");
const allFindings = walkDir(process.cwd());

if (allFindings.length === 0) {
  console.log("Scan complete. No secrets found in working tree tracked files.");
} else {
  console.log(`Scan complete. Found ${allFindings.length} alert(s):`);
  for (const f of allFindings) {
    console.log(`- ${f.file}:${f.line} [${f.rule}]`);
  }
}
