import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

// Load Environment Variables
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

// Schemas & Models Definition
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    image: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
    salePrice: { type: Number, min: [0, 'Sale price cannot be negative'] },
    purchasePrice: { type: Number, min: [0, 'Purchase price cannot be negative'] },
    discountRate: { type: Number },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 0, min: [0, 'Stock cannot be negative'] },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: String }],
    images: [{ type: String }],
    attributes: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    variants: [
      {
        color: { type: String },
        size: { type: String },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        purchasePrice: { type: Number },
        discountRate: { type: Number },
        stock: { type: Number, required: true, default: 0 },
        sku: { type: String },
        image: { type: String },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    totalSales: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

ProductSchema.pre('validate', function() {
  if (this.salePrice !== undefined && this.salePrice !== null && this.salePrice > this.price) {
    throw new Error(`Sale price (${this.salePrice}) should be lower than or equal to regular price (${this.price})`);
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Raw product data
const rawProducts = [
  // --- Category 1: Organic Honey (organic-honey) ---
  {
    name: "Premium Black Seed Honey",
    slug: "premium-black-seed-honey",
    description: "100% natural raw honey infused with high-quality black seed (kalonji) extract. A powerful traditional wellness booster packed with antioxidants.",
    price: 650,
    categorySlug: "organic-honey",
    image: "black_seed_honey_img_1778345423989.webp",
    tags: ["honey", "black-seed", "natural", "organic"],
  },
  {
    name: "Organic Litchi Flower Honey",
    slug: "organic-litchi-flower-honey",
    description: "Light and aromatic honey harvested from blooming litchi orchards. Features a delicate fruity flavor and natural sweetness.",
    price: 500,
    categorySlug: "organic-honey",
    image: "litchi_flower_honey_img_1778345442933.webp",
    tags: ["honey", "litchi", "organic", "raw"],
  },
  {
    name: "Pure Mustard Flower Honey",
    slug: "pure-mustard-flower-honey",
    description: "Golden, thick, and delicious honey harvested during the winter mustard bloom. Contains essential enzymes and natural nutrients.",
    price: 480,
    categorySlug: "organic-honey",
    image: "mustard_flower_honey_img_1778345464053.webp",
    tags: ["honey", "mustard", "pure", "raw"],
  },
  {
    name: "Raw Natural Honeycomb",
    slug: "raw-natural-honeycomb",
    description: "Freshly cut honeycomb straight from the hive. Enjoy the purest form of honey along with the edible natural beeswax.",
    price: 950,
    categorySlug: "organic-honey",
    image: "raw_honeycomb_img_1778345486986.webp",
    tags: ["honey", "honeycomb", "raw", "fresh"],
  },
  {
    name: "Sundarban Wild Forest Honey",
    slug: "sundarban-wild-forest-honey",
    description: "Authentic, raw forest honey collected from the wild hives of the Sundarban mangrove forest. Rich in anti-inflammatory properties.",
    price: 850,
    categorySlug: "organic-honey",
    image: "sundarban_wild_forest_honey_img_1778345403804.webp",
    tags: ["honey", "sundarbans", "forest", "wild"],
  },

  // --- Category 2: Natural Oils (natural-oils) ---
  {
    name: "Cold-Pressed Extra Virgin Olive Oil",
    slug: "cold-pressed-extra-virgin-olive-oil",
    description: "Premium cold-pressed extra virgin olive oil imported from Spain. Ideal for salad dressings, cooking, and healthy skin care.",
    price: 1200,
    categorySlug: "natural-oils",
    image: "Extra Virgin Olive Oil.webp",
    tags: ["olive-oil", "cooking", "skincare", "imported"],
  },
  {
    name: "Premium Organic Black Seed Oil",
    slug: "premium-organic-black-seed-oil",
    description: "100% pure cold-pressed black cumin seed oil. Renowned for its therapeutic benefits for respiratory and immune systems.",
    price: 850,
    categorySlug: "natural-oils",
    image: "Premium Black Seed Oil.webp",
    tags: ["black-seed", "oil", "cold-pressed", "wellness"],
  },
  {
    name: "Pure Sweet Almond Oil for Hair & Skin",
    slug: "pure-sweet-almond-oil-for-hair-skin",
    description: "Nourishing oil rich in Vitamin E, cold-pressed from premium sweet almonds. Excellent for moisturizing dry skin and strengthening hair.",
    price: 550,
    categorySlug: "natural-oils",
    image: "Pure Sweet Almond Oil.webp",
    tags: ["almond-oil", "haircare", "skincare", "natural"],
  },
  {
    name: "Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    description: "Pure, raw, cold-pressed coconut oil extracted from fresh organic coconuts. Excellent for dietary health, hair care, and cooking.",
    price: 450,
    categorySlug: "natural-oils",
    image: "virgin_coconut_oil_img_1778345526404.webp",
    tags: ["coconut-oil", "organic", "haircare", "multipurpose"],
  },
  {
    name: "Wood Pressed Mustard Oil",
    slug: "wood-pressed-mustard-oil",
    description: "Traditional wood-pressed (Kachi Ghani) mustard oil. Retains its strong natural aroma, sharp flavor, and healthy fatty acids.",
    price: 350,
    categorySlug: "natural-oils",
    image: "wood_pressed_mustard_oil_img_1778345506999.webp",
    tags: ["mustard-oil", "kachi-ghani", "cooking", "traditional"],
  },

  // --- Category 3: Herbal Medicine (herbal-medicine) ---
  {
    name: "Organic Ashwagandha Root Powder",
    slug: "organic-ashwagandha-root-powder",
    description: "Premium adaptogenic herb powder that helps reduce stress, boost energy levels, and support physical strength and stamina.",
    price: 320,
    categorySlug: "herbal-medicine",
    image: "Organic Ashwagandha Powder.webp",
    tags: ["ashwagandha", "herbal", "stress-relief", "energy"],
  },
  {
    name: "Organic Turmeric Curcumin Capsules",
    slug: "organic-turmeric-curcumin-capsules",
    description: "High-potency organic turmeric capsules enriched with black pepper extract (piperine) for maximum absorption and joint health support.",
    price: 580,
    categorySlug: "herbal-medicine",
    image: "Organic Turmeric Capsules.webp",
    tags: ["turmeric", "capsules", "joint-health", "immunity"],
  },
  {
    name: "Premium Superfood Spirulina Powder",
    slug: "premium-superfood-spirulina-powder",
    description: "Nutrient-dense organic spirulina powder, rich in plant-based proteins, vitamins, and antioxidants to support overall vitality.",
    price: 450,
    categorySlug: "herbal-medicine",
    image: "Premium Spirulina Powder.webp",
    tags: ["spirulina", "superfood", "powder", "vitality"],
  },
  {
    name: "Pure Organic Moringa Leaf Powder",
    slug: "pure-organic-moringa-leaf-powder",
    description: "Superfood powder made from dried organic moringa leaves. Loaded with vitamins, minerals, and amino acids to boost immunity.",
    price: 280,
    categorySlug: "herbal-medicine",
    image: "Pure Moringa Leaf Powder.webp",
    tags: ["moringa", "superfood", "immunity", "organic"],
  },
  {
    name: "Triphala Digestive Care Powder",
    slug: "triphala-digestive-care-powder",
    description: "Traditional Ayurvedic blend of Amalaki, Bibhitaki, and Haritaki. Supports healthy digestion, detoxification, and regular bowel movements.",
    price: 220,
    categorySlug: "herbal-medicine",
    image: "Triphala Digestive Powde.webp",
    tags: ["triphala", "digestive", "detox", "ayurvedic"],
  },

  // --- Category 4: Dry Fruits (dry-fruits) ---
  {
    name: "Premium California Shelled Almonds",
    slug: "premium-california-shelled-almonds",
    description: "Raw, crunchy, and unsalted California almonds. A healthy source of proteins, vitamin E, and fiber for a nutritious daily snack.",
    price: 980,
    categorySlug: "dry-fruits",
    image: "California Shelled Almonds.webp",
    tags: ["almonds", "dry-fruits", "nuts", "healthy"],
  },
  {
    name: "Deluxe Mixed Dry Fruits & Berries",
    slug: "deluxe-mixed-dry-fruits-berries",
    description: "Premium assortment of almonds, cashews, walnuts, raisins, and dried cranberries. Perfect energy-boosting snack.",
    price: 1200,
    categorySlug: "dry-fruits",
    image: "Mixed Dry Fruits & Berries.webp",
    tags: ["mixed-nuts", "berries", "snacks", "dry-fruits"],
  },
  {
    name: "Premium Ajwa Dates from Madinah",
    slug: "premium-ajwa-dates-from-madinah",
    description: "Authentic, dark-colored, soft, and fruity Ajwa dates imported directly from Madinah. Known for high nutrition and health benefits.",
    price: 1500,
    categorySlug: "dry-fruits",
    image: "Premium Ajwa Dates (Madinah).webp",
    tags: ["dates", "ajwa", "madinah", "premium"],
  },
  {
    name: "Premium Raw Walnut Kernels",
    slug: "premium-raw-walnut-kernels",
    description: "High-quality, crispy, and raw walnut halves. Loaded with healthy Omega-3 fatty acids for brain health and heart support.",
    price: 1100,
    categorySlug: "dry-fruits",
    image: "Premium Walnut Kernels.webp",
    tags: ["walnuts", "omega-3", "brain-health", "nuts"],
  },
  {
    name: "Roasted Whole Cashew Nuts",
    slug: "roasted-whole-cashew-nuts",
    description: "Crispy, oven-roasted, premium whole cashew nuts. A delicious and satisfying snack rich in essential minerals and healthy fats.",
    price: 950,
    categorySlug: "dry-fruits",
    image: "Roasted Whole Cashew Nuts.webp",
    tags: ["cashews", "roasted", "nuts", "snacks"],
  },

  // --- Category 5: Organic Spices (organic-spices) ---
  {
    name: "Organic Ceylon Cinnamon Sticks",
    slug: "organic-ceylon-cinnamon-sticks",
    description: "Authentic, sweet, and highly aromatic Ceylon cinnamon quill sticks. Adds a wonderful flavor to both sweet and savory dishes.",
    price: 350,
    categorySlug: "organic-spices",
    image: "ceylon_cinnamon_sticks_1778373905330.webp",
    tags: ["cinnamon", "ceylon", "spice", "organic"],
  },
  {
    name: "Premium Green Cardamom Pods",
    slug: "premium-green-cardamom-pods",
    description: "Handpicked premium green cardamom pods with intense aroma and flavor. A staple spice for traditional cooking and desserts.",
    price: 750,
    categorySlug: "organic-spices",
    image: "green_cardamom_premium_1778373923019.webp",
    tags: ["cardamom", "spice", "aromatic", "premium"],
  },
  {
    name: "Pure Organic Turmeric Powder",
    slug: "pure-organic-turmeric-powder",
    description: "Highly aromatic, premium organic turmeric powder with high curcumin content. Adds vibrant golden color and flavor.",
    price: 180,
    categorySlug: "organic-spices",
    image: "organic_turmeric_powder_1778373855826.webp",
    tags: ["turmeric", "powder", "spice", "organic"],
  },
  {
    name: "Premium Hot Red Chili Powder",
    slug: "premium-hot-red-chili-powder",
    description: "Spicy, vibrant red chili powder made from sun-dried premium red chilies. Adds a fiery kick to your favorite curries.",
    price: 190,
    categorySlug: "organic-spices",
    image: "premium_red_chili_powder_1778373870948.webp",
    tags: ["chili", "spicy", "powder", "spice"],
  },
  {
    name: "Whole Black Pepper Corns",
    slug: "whole-black-pepper-corns",
    description: "Premium sun-dried whole black peppercorns. Freshly grind them for a bold, pungent flavor and natural digestive benefits.",
    price: 240,
    categorySlug: "organic-spices",
    image: "whole_black_pepper_corns_1778373888662.webp",
    tags: ["black-pepper", "peppercorn", "spice", "whole"],
  },

  // --- Category 6: Herbal Tea (herbal-tea) ---
  {
    name: "Soothing Chamomile Flower Tea",
    slug: "soothing-chamomile-flower-tea",
    description: "Naturally caffeine-free herbal tea made from whole chamomile flowers. Relaxes the mind and promotes restful sleep.",
    price: 350,
    categorySlug: "herbal-tea",
    image: "chamomile_flower_tea_1778373983068.webp",
    tags: ["chamomile", "tea", "herbal", "caffeine-free"],
  },
  {
    name: "Organic Hibiscus Flower Tea",
    slug: "organic-hibiscus-flower-tea",
    description: "Tart and refreshing herbal tea made from dried organic hibiscus flowers. Loaded with Vitamin C and rich red antioxidants.",
    price: 320,
    categorySlug: "herbal-tea",
    image: "hibiscus_tea_flowers_1778373966990.webp",
    tags: ["hibiscus", "tea", "herbal", "antioxidants"],
  },
  {
    name: "Premium Organic Green Tea Leaves",
    slug: "premium-organic-green-tea-leaves",
    description: "Handpicked loose organic green tea leaves. Provides a smooth taste and a clean, refreshing energy boost with antioxidants.",
    price: 280,
    categorySlug: "herbal-tea",
    image: "organic_green_tea_leaves_1778373944818.webp",
    tags: ["green-tea", "organic", "loose-leaves", "energy"],
  },
  {
    name: "Tulsi Ginger Herbal Blend Tea",
    slug: "tulsi-ginger-herbal-blend-tea",
    description: "Therapeutic blend of holy basil (Tulsi) and spicy ginger. Supports immune system, digestion, and respiratory wellness.",
    price: 290,
    categorySlug: "herbal-tea",
    image: "tulsi_ginger_herbal_blend_tea_1778373997289.webp",
    tags: ["tulsi", "ginger", "tea", "herbal"],
  },
  {
    name: "Ceremonial Grade Matcha Powder",
    slug: "ceremonial-grade-matcha-powder",
    description: "Authentic stone-ground ceremonial grade Japanese green tea powder. Perfect for traditional matcha tea and lattes.",
    price: 950,
    categorySlug: "herbal-tea",
    image: "ceremonial_matcha_powder_bowl_1778374016834.webp",
    tags: ["matcha", "ceremonial", "green-tea", "japanese"],
  },

  // --- Category 7: Organic Grains (organic-grains) ---
  {
    name: "Aromatic Red Rice in Jute Bag",
    slug: "aromatic-red-rice-in-jute-bag",
    description: "Nutritious, high-fiber, and aromatic unpolished red rice packed in an eco-friendly jute bag. Great for daily healthy meals.",
    price: 260,
    categorySlug: "organic-grains",
    image: "aromatic_red_rice_jute_bag_1778374084524.webp",
    tags: ["red-rice", "grains", "healthy-diet", "aromatic"],
  },
  {
    name: "Organic Golden Flax Seeds",
    slug: "organic-golden-flax-seeds",
    description: "Premium organic golden flax seeds, rich in dietary fiber, lignans, and essential Omega-3 fatty acids. Great for smoothies.",
    price: 180,
    categorySlug: "organic-grains",
    image: "golden_flax_seeds_container_1778374069623.webp",
    tags: ["flaxseeds", "superfood", "fiber", "omega-3"],
  },
  {
    name: "Organic Black Chia Seeds",
    slug: "organic-black-chia-seeds",
    description: "Premium raw black chia seeds packed with calcium, fiber, and Omega-3. Sprinkle on oatmeal, yogurt, or mix in water.",
    price: 320,
    categorySlug: "organic-grains",
    image: "organic_black_chia_seeds_jar_1778374038335.webp",
    tags: ["chia-seeds", "superfood", "organic", "fiber"],
  },
  {
    name: "Raw Pumpkin Seeds",
    slug: "raw-pumpkin-seeds",
    description: "Shelled raw pumpkin seeds (pepitas). A wonderful plant-based source of magnesium, zinc, and healthy unsaturated fats.",
    price: 290,
    categorySlug: "organic-grains",
    image: "raw_pumpkin_seeds_bowl_1778374100018.webp",
    tags: ["pumpkin-seeds", "pepitas", "raw", "snacks"],
  },
  {
    name: "Organic Tri-Color Quinoa",
    slug: "organic-tri-color-quinoa",
    description: "Nutritious blend of white, red, and black organic quinoa seeds. A complete plant-based protein and grain alternative.",
    price: 480,
    categorySlug: "organic-grains",
    image: "tri_color_quinoa_bowl_1778374053723.webp",
    tags: ["quinoa", "tri-color", "grains", "protein"],
  },

  // --- Category 8: Organic Fruits (organic-fruits) ---
  {
    name: "Fresh Organic Dragon Fruit",
    slug: "fresh-organic-dragon-fruit",
    description: "Sweet and vibrant pink dragon fruit sourced from organic local farms. Rich in fiber, prebiotic nutrients, and vitamin C.",
    price: 350,
    categorySlug: "organic-fruits",
    image: "Fresh Dragon Fruit.webp",
    tags: ["dragon-fruit", "fresh-fruits", "organic", "exotic"],
  },
  {
    name: "Premium Red Pomegranate",
    slug: "premium-red-pomegranate",
    description: "Fresh, juicy, and sweet red pomegranate fruits. A rich source of natural antioxidants, vitamins, and minerals.",
    price: 420,
    categorySlug: "organic-fruits",
    image: "Organic Red Pomegranate.webp",
    tags: ["pomegranate", "fresh-fruits", "antioxidants", "juicy"],
  },
  {
    name: "Sweet Nagpur Oranges",
    slug: "sweet-nagpur-oranges",
    description: "Naturally sweet and juicy Nagpur oranges, handpicked at peak ripeness. Perfect for fresh juice or direct snacking.",
    price: 280,
    categorySlug: "organic-fruits",
    image: "Sweet Nagpur Oranges.webp",
    tags: ["oranges", "citrus", "nagpur", "fresh-fruits"],
  },
  {
    name: "Naturally Ripened Banana Bunch",
    slug: "naturally-ripened-banana-bunch",
    description: "Sweet and creamy bananas ripened naturally without any harmful chemicals or sprays. Excellent daily source of potassium.",
    price: 120,
    categorySlug: "organic-fruits",
    image: "naturally_ripened_banana_bunch_1778374121594.webp",
    tags: ["banana", "fresh-fruits", "potassium", "natural"],
  },
  {
    name: "Premium Fresh Green Apples",
    slug: "premium-fresh-green-apples",
    description: "Crisp, tart, and juicy premium green apples. Highly refreshing, fiber-rich, and excellent for daily fruit bowls.",
    price: 250,
    categorySlug: "organic-fruits",
    image: "premium_green_apples_fresh_1778374139017.webp",
    tags: ["green-apple", "fresh-fruits", "crisp", "tart"],
  },

  // --- Category 9: Organic Skincare (organic-skincare) ---
  {
    name: "Distilled Pure Rose Water Mist",
    slug: "distilled-pure-rose-water-mist",
    description: "100% pure distilled rose water mist. Acts as a natural toner, skin hydrator, and refreshing makeup setting spray.",
    price: 250,
    categorySlug: "organic-skincare",
    image: "Distilled Rose Water Mist.webp",
    tags: ["rose-water", "skincare", "toner", "mist"],
  },
  {
    name: "Natural Multani Mitti Powder",
    slug: "natural-multani-mitti-powder",
    description: "Pure fuller's earth clay powder. Renowned for absorbing excess oil, clearing pores, and giving a healthy natural skin glow.",
    price: 150,
    categorySlug: "organic-skincare",
    image: "Multani Mitti (Fuller's Earth).webp",
    tags: ["multani-mitti", "clay-mask", "oily-skin", "skincare"],
  },
  {
    name: "Pure Organic Aloe Vera Gel",
    slug: "pure-organic-aloe-vera-gel",
    description: "Soothe and hydrate skin with 99% pure organic aloe vera gel. Ideal for sunburns, minor skin irritations, and daily hydration.",
    price: 350,
    categorySlug: "organic-skincare",
    image: "Pure Aloe Vera Gel.webp",
    tags: ["aloe-vera", "soothing-gel", "skincare", "hydration"],
  },
  {
    name: "Raw Unrefined Shea Butter",
    slug: "raw-unrefined-shea-butter",
    description: "Deeply moisturizing raw African shea butter. Heals dry cracked skin, eczema, stretch marks, and softens hair naturally.",
    price: 480,
    categorySlug: "organic-skincare",
    image: "Unrefined Shea Butter.webp",
    tags: ["shea-butter", "moisturizer", "raw", "skincare"],
  },
  {
    name: "Organic Neem Face Pack Powder",
    slug: "organic-neem-face-pack-powder",
    description: "Natural purifying face pack made from dried organic neem leaves. Helps fight acne, control sebum, and clear blemishes.",
    price: 180,
    categorySlug: "organic-skincare",
    image: "Organic Neem Face Pack.webp",
    tags: ["neem", "facepack", "acne-control", "skincare"],
  },

  // --- Category 10: Health Drinks (health-drinks) ---
  {
    name: "Apple Cider Vinegar with Mother",
    slug: "apple-cider-vinegar-with-mother",
    description: "Organic, raw, and unfiltered apple cider vinegar. Promotes healthy digestion, supports metabolism, and boosts immune system.",
    price: 450,
    categorySlug: "health-drinks",
    image: "Apple Cider Vinegar (Mother).webp",
    tags: ["apple-cider-vinegar", "acv", "mother", "health-drink"],
  },
  {
    name: "Creamy Organic Soy Milk",
    slug: "creamy-organic-soy-milk",
    description: "Delicious, plant-based, and creamy organic soy milk. High in protein and calcium, lactose-free alternative for healthy daily use.",
    price: 240,
    categorySlug: "health-drinks",
    image: "Creamy Organic Soy Milk.webp",
    tags: ["soy-milk", "vegan", "plant-based", "beverage"],
  },
  {
    name: "Digestive Aloe Vera Juice",
    slug: "digestive-aloe-vera-juice",
    description: "Refreshing health drink made from pure organic aloe vera pulp. Helps soothe stomach irritation and supports colon health.",
    price: 320,
    categorySlug: "health-drinks",
    image: "Digestive Aloe Vera Juice.webp",
    tags: ["aloe-vera-juice", "digestive", "wellness", "beverage"],
  },
  {
    name: "Natural Pomegranate Juice",
    slug: "natural-pomegranate-juice",
    description: "100% pure cold-pressed pomegranate juice with no added sugar or preservatives. Packed with vital heart-healthy antioxidants.",
    price: 350,
    categorySlug: "health-drinks",
    image: "Natural Pomegranate Juice.webp",
    tags: ["pomegranate-juice", "fresh", "antioxidants", "beverage"],
  },
  {
    name: "Pure Amla Vitamin C Juice",
    slug: "pure-amla-vitamin-c-juice",
    description: "High-potency juice made from wild organic Indian gooseberries (Amla). Supercharges daily immunity and supports healthy hair.",
    price: 280,
    categorySlug: "health-drinks",
    image: "Pure Amla Vitamin C Juice.webp",
    tags: ["amla", "vitamin-c", "immunity", "juice"],
  },
];

async function run() {
  try {
    loadEnvFile();
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is missing in .env.local");

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri, { bufferCommands: false });
    console.log("Connected successfully.\n");

    // Clear existing products
    const del = await Product.deleteMany({});
    console.log(`Cleared ${del.deletedCount} existing products.\n`);

    // Fetch existing categories to map slugs to ObjectIds
    console.log("Fetching categories...");
    const categoriesDb = await Category.find({});
    console.log(`Found ${categoriesDb.length} categories in database.`);

    const categoryMap = {};
    categoriesDb.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Prepare products with correct ObjectIds, unique SKUs, section flags and discounts
    const productsToInsert = rawProducts.map((p, index) => {
      const catId = categoryMap[p.categorySlug];
      if (!catId) {
        throw new Error(`Category not found for slug: ${p.categorySlug}`);
      }

      // SKU generation
      const skuIndex = String(index + 1).padStart(3, '0');
      const sku = `EP-PROD-${skuIndex}`;

      // Default fields
      const productDoc = {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        sku: sku,
        stock: 50 + (index % 10) * 15, // Stock between 50 and 185
        categories: [catId],
        tags: p.tags,
        images: [`/assets/images/products/${p.image}`],
        isPublished: true,
        ratings: 4.0 + (index % 10) * 0.1, // Rating between 4.0 and 4.9
        numReviews: 10 + (index % 5) * 8,   // Reviews count
        views: 150 + (index % 10) * 80,     // Views count
        totalSales: 5 + (index % 5) * 12,    // Sales count
        purchasePrice: Math.round(p.price * 0.6), // Standard purchase price at 60% of price
      };

      // Set section flags
      // Products 1-10 (indices 0-9): New Arrival
      if (index >= 0 && index < 10) {
        productDoc.isNewArrival = true;
      }
      // Products 11-20 (indices 10-19): Flash Sale
      if (index >= 10 && index < 19) {
        productDoc.isFlashSale = true;
      }
      // Products 21-30 (indices 20-29): Featured
      if (index >= 20 && index < 30) {
        productDoc.isFeatured = true;
      }

      // Special check: we want exactly 10 new arrivals, 10 flash sales, 10 featured, and 10 discounted
      // Let's make index 9 also isNewArrival, making total 10. (indices 0 to 9 are 10 items)
      // Let's make index 19 also isFlashSale, making total 10. (indices 10 to 19 are 10 items)
      if (index === 19) {
        productDoc.isFlashSale = true;
      }

      // Let's make products 30-39 (indices 30-39) have a discount. (total 10 products with discount)
      if (index >= 30 && index < 40) {
        // Set discount
        productDoc.discountRate = 15 + (index % 3) * 3; // e.g. 15%, 18%, 21%
        productDoc.salePrice = Math.round(p.price * (1 - productDoc.discountRate / 100));
      }

      return productDoc;
    });

    console.log(`Inserting ${productsToInsert.length} products...`);
    const result = await Product.insertMany(productsToInsert);
    console.log(`\n✅ Successfully seeded ${result.length} products!`);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

run();
