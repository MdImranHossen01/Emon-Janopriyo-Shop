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

// Category Schema (matching src/models/Category.ts)
const CategorySchema = new mongoose.Schema(
  {
    name:           { type: String, required: true },
    slug:           { type: String },
    image:          { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 }, { unique: true });

CategorySchema.pre('save', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// 10 categories matching the 10 images in public/assets/images/cagetory
const categories = [
  {
    name:    'Organic Honey',
    slug:    'organic-honey',
    image:   '/assets/images/cagetory/organic_honey_category_1778344034194.webp',
    isActive: true,
  },
  {
    name:    'Natural Oils',
    slug:    'natural-oils',
    image:   '/assets/images/cagetory/natural_oils_category_1778344059813.webp',
    isActive: true,
  },
  {
    name:    'Herbal Medicine',
    slug:    'herbal-medicine',
    image:   '/assets/images/cagetory/herbal_medicine_category_1778344082037.webp',
    isActive: true,
  },
  {
    name:    'Dry Fruits',
    slug:    'dry-fruits',
    image:   '/assets/images/cagetory/dry_fruits_category_1778344105530.webp',
    isActive: true,
  },
  {
    name:    'Organic Spices',
    slug:    'organic-spices',
    image:   '/assets/images/cagetory/organic_spices_category_1778344130003.webp',
    isActive: true,
  },
  {
    name:    'Herbal Tea',
    slug:    'herbal-tea',
    image:   '/assets/images/cagetory/herbal_tea_category_1778344158301.webp',
    isActive: true,
  },
  {
    name:    'Organic Grains',
    slug:    'organic-grains',
    image:   '/assets/images/cagetory/organic_grains_category_1778344185901.webp',
    isActive: true,
  },
  {
    name:    'Organic Fruits',
    slug:    'organic-fruits',
    image:   '/assets/images/cagetory/organic_fruits_category_1778344207005.webp',
    isActive: true,
  },
  {
    name:    'Organic Skincare',
    slug:    'organic-skincare',
    image:   '/assets/images/cagetory/organic_skincare_category_1778344233376.webp',
    isActive: true,
  },
  {
    name:    'Health Drinks',
    slug:    'health-drinks',
    image:   '/assets/images/cagetory/health_drinks_category_1778344257804.webp',
    isActive: true,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongodbUri);
    console.log('Connected successfully.\n');

    // Clear existing categories
    const del = await Category.deleteMany({});
    console.log(`Cleared ${del.deletedCount} existing categories.`);

    // Insert new categories one by one (triggers pre-save slug hook)
    const inserted = [];
    for (const cat of categories) {
      const doc = new Category(cat);
      await doc.save();
      inserted.push(doc);
      console.log(`  ✓ [${inserted.length}] "${doc.name}" → slug: "${doc.slug}"`);
    }

    console.log(`\n✅ Seeded ${inserted.length} categories successfully!`);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
