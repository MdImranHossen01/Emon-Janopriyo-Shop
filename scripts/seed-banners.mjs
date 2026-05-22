import { createRequire } from 'module';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Load mongoose from absolute project node_modules path
const require = createRequire(`file:///${projectRoot.replace(/\\/g, '/')}/node_modules/`);
const mongoose = require('mongoose');

// Read MONGODB_URI from .env.local
let mongodbUri = '';
const envPath = resolve(projectRoot, '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  const match = envContent.match(/^MONGODB_URI=(.*)$/m);
  if (match && match[1]) {
    mongodbUri = match[1].trim().replace(/['"]/g, '');
  }
}

if (!mongodbUri) {
  mongodbUri = 'mongodb+srv://EmonJanopriyoShop:L1PETqRD4B3uac4R@cluster0.e5n1hnl.mongodb.net/EmonJanopriyoShop';
}

const BannerSchema = new mongoose.Schema(
  {
    title:            { type: String, required: true },
    image:            { type: String, required: true },
    link:             { type: String },
    primaryBtnText:   { type: String },
    primaryBtnLink:   { type: String },
    secondaryBtnText: { type: String },
    secondaryBtnLink: { type: String },
    order:            { type: Number, default: 0 },
    isActive:         { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

const banners = [
  {
    title:            'Fresh Healthy Food',
    image:            '/assets/images/Banner/Banner (2).webp',
    link:             'https://www.janopriyo.shop/shop',
    primaryBtnText:   'Shop Now',
    primaryBtnLink:   'https://www.janopriyo.shop/shop',
    secondaryBtnText: 'WhatsApp Order',
    secondaryBtnLink: 'https://wa.me/8801581624191',
    order:            1,
    isActive:         true,
  },
  {
    title:            'Pure Organic Grocery',
    image:            '/assets/images/Banner/Banner (3).webp',
    link:             'https://www.janopriyo.shop/shop',
    primaryBtnText:   'Explore Shop',
    primaryBtnLink:   'https://www.janopriyo.shop/shop',
    secondaryBtnText: 'WhatsApp Order',
    secondaryBtnLink: 'https://wa.me/8801581624191',
    order:            2,
    isActive:         true,
  },
  {
    title:            'Daily Family Essentials',
    image:            '/assets/images/Banner/Banner (4).webp',
    link:             'https://www.janopriyo.shop/shop',
    primaryBtnText:   'Order Now',
    primaryBtnLink:   'https://www.janopriyo.shop/shop',
    secondaryBtnText: 'WhatsApp Order',
    secondaryBtnLink: 'https://wa.me/8801581624191',
    order:            3,
    isActive:         true,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongodbUri);
    console.log('Connected successfully.\n');

    const del = await Banner.deleteMany({});
    console.log(`Cleared ${del.deletedCount} existing banners.`);

    const inserted = await Banner.insertMany(banners);
    inserted.forEach((b, i) => {
      console.log(`  ✓ [${i + 1}] "${b.title}" → image: "${b.image}"`);
    });

    console.log(`\n✅ Seeded ${inserted.length} banners successfully!`);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
