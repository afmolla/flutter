#!/usr/bin/env node
import { copyFileSync, existsSync } from "fs";
import { execSync } from "child_process";

const envLocal = ".env.local";
const envExample = ".env.example";

if (!existsSync(envLocal)) {
  copyFileSync(envExample, envLocal);
  console.log("✓ .env.local oluşturuldu (.env.example kopyalandı)");
} else {
  console.log("• .env.local zaten var, dokunulmadı");
}

console.log("• npm install çalıştırılıyor…");
execSync("npm install", { stdio: "inherit" });

console.log("\nHazır. Şimdi:");
console.log("  npm run dev     → geliştirme (http://localhost:3000)");
console.log("  npm run build && npm run start → daha hızlı önizleme");
console.log("  Panel: http://localhost:3000/panel  şifre: demo123");
