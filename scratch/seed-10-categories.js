use GOMart;

const categoriesData = [
  {
    name: "Dry Fruits",
    slug: "dry-fruits",
    image: "/assets/images/cagetory/dry_fruits_category_1778344105530.webp",
    isActive: true,
  },
  {
    name: "Health Drinks",
    slug: "health-drinks",
    image: "/assets/images/cagetory/health_drinks_category_1778344257804.webp",
    isActive: true,
  },
  {
    name: "Herbal Medicine",
    slug: "herbal-medicine",
    image: "/assets/images/cagetory/herbal_medicine_category_1778344082037.webp",
    isActive: true,
  },
  {
    name: "Herbal Tea",
    slug: "herbal-tea",
    image: "/assets/images/cagetory/herbal_tea_category_1778344158301.webp",
    isActive: true,
  },
  {
    name: "Natural Oils",
    slug: "natural-oils",
    image: "/assets/images/cagetory/natural_oils_category_1778344059813.webp",
    isActive: true,
  },
  {
    name: "Organic Fruits",
    slug: "organic-fruits",
    image: "/assets/images/cagetory/organic_fruits_category_1778344207005.webp",
    isActive: true,
  },
  {
    name: "Organic Grains",
    slug: "organic-grains",
    image: "/assets/images/cagetory/organic_grains_category_1778344185901.webp",
    isActive: true,
  },
  {
    name: "Organic Honey",
    slug: "organic-honey",
    image: "/assets/images/cagetory/organic_honey_category_1778344034194.webp",
    isActive: true,
  },
  {
    name: "Organic Skincare",
    slug: "organic-skincare",
    image: "/assets/images/cagetory/organic_skincare_category_1778344233376.webp",
    isActive: true,
  },
  {
    name: "Organic Spices",
    slug: "organic-spices",
    image: "/assets/images/cagetory/organic_spices_category_1778344130003.webp",
    isActive: true,
  },
];

// Remove existing categories
db.categories.deleteMany({});

// Insert all categories
const now = new Date();
for (let cat of categoriesData) {
  db.categories.insertOne({
    ...cat,
    parentCategory: null,
    createdAt: now,
    updatedAt: now,
  });
}

// Show result
print("✅ Successfully seeded 10 categories!");
db.categories.find({}).pretty();
