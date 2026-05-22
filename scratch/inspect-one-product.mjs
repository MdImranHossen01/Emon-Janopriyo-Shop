import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function inspectProduct() {
  loadEnvFile();
  const mongoUri = process.env.MONGODB_URI;
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;
  const productsCollection = db.collection("products");
  const product = await productsCollection.findOne({});
  console.log("Sample product in database:", product);
  await mongoose.disconnect();
}

inspectProduct().catch(console.error);
