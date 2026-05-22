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

async function listCategories() {
  loadEnvFile();
  const mongoUri = process.env.MONGODB_URI;
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;
  const categoriesCollection = db.collection("categories");
  const categories = await categoriesCollection.find({}, { projection: { name: 1, slug: 1 } }).toArray();
  console.log("Categories in database:", categories);
  await mongoose.disconnect();
}

listCategories().catch(console.error);
