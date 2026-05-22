import mongoose from "mongoose";

const uri = "mongodb+srv://GOMart:S4Epscw0SOkd5ZtG@cluster0.e5n1hnl.mongodb.net/GOMart";

const bannersData = [
  {
    title: "Organic Products",
    image: "/assets/images/Banner/Banner (2).webp",
    primaryBtnText: "Shop Now",
    primaryBtnLink: "https://www.janopriyo.shop/shop",
    secondaryBtnText: "WhatsApp",
    secondaryBtnLink: "https://wa.me/8801581624191",
    order: 1,
    isActive: true,
  },
  {
    title: "Best Deals Today",
    image: "/assets/images/Banner/Banner (3).webp",
    primaryBtnText: "Shop Now",
    primaryBtnLink: "https://www.janopriyo.shop/shop",
    secondaryBtnText: "WhatsApp",
    secondaryBtnLink: "https://wa.me/8801581624191",
    order: 2,
    isActive: true,
  },
  {
    title: "Premium Selection",
    image: "/assets/images/Banner/Banner (4).webp",
    primaryBtnText: "Shop Now",
    primaryBtnLink: "https://www.janopriyo.shop/shop",
    secondaryBtnText: "WhatsApp",
    secondaryBtnLink: "https://wa.me/8801581624191",
    order: 3,
    isActive: true,
  },
];

async function seed() {
  console.log("Connecting to GOMart database...");
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const bannersCol = db.collection("banners");

  console.log("Checking for existing banners...");
  const count = await bannersCol.countDocuments({});
  console.log(`Currently there are ${count} banners in the database.`);

  console.log("Inserting new banners...");
  for (const banner of bannersData) {
    const existing = await bannersCol.findOne({ title: banner.title });
    if (existing) {
      console.log(`Banner "${banner.title}" already exists. Updating...`);
      await bannersCol.updateOne(
        { _id: existing._id },
        { $set: { ...banner, updatedAt: new Date() } }
      );
    } else {
      console.log(`Inserting banner: "${banner.title}"`);
      await bannersCol.insertOne({
        ...banner,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  console.log("✅ Banner seeding finished successfully!");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
