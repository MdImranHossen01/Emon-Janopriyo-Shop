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

async function verify() {
  loadEnvFile();
  const mongoUri = process.env.MONGODB_URI;
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;

  const productsCollection = db.collection("products");
  const categoriesCollection = db.collection("categories");

  const totalProducts = await productsCollection.countDocuments({});
  console.log("Total products seeded:", totalProducts);

  const newArrivals = await productsCollection.countDocuments({ isNewArrival: true });
  console.log("New Arrivals count:", newArrivals);

  const flashSales = await productsCollection.countDocuments({ isFlashSale: true });
  console.log("Flash Sales count:", flashSales);

  const featured = await productsCollection.countDocuments({ isFeatured: true });
  console.log("Featured count:", featured);

  const discounted = await productsCollection.countDocuments({ salePrice: { $exists: true, $ne: null } });
  console.log("Discounted products count:", discounted);

  const categories = await categoriesCollection.find({}).toArray();
  console.log("\nProducts per category count:");
  for (const cat of categories) {
    const count = await productsCollection.countDocuments({ categories: cat._id });
    console.log(`- ${cat.name} (${cat.slug}): ${count}`);
  }

  await mongoose.disconnect();
}

verify().catch(console.error);
