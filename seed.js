// import pkg from 'pg';
// import dotenv from 'dotenv';
// const { Pool } = pkg;

// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// async function seedDatabase() {
//   console.log("Fetching recipes from API...");
  
//   try {
//     const response = await fetch('https://dummyjson.com/recipes?limit=50');
//     const data = await response.json();
//     const recipes = data.recipes;

//     console.log(`Found ${recipes.length} recipes! Injecting into database...`);

//     for (const recipe of recipes) {
      
//       const sqlQuery = `
//         INSERT INTO recipes (
//           title, category, description, prep_time, cook_time, servings, 
//           difficulty, calories, image_url, ingredients, instructions
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//       `;
      
//      const values = [
//         recipe.name, 
//         recipe.cuisine, 
//         `A delicious ${recipe.cuisine} meal.`, 
//         recipe.prepTimeMinutes,
//         recipe.cookTimeMinutes,
//         recipe.servings,
//         recipe.difficulty,
//         recipe.caloriesPerServing,
//         recipe.image,
//         JSON.stringify(recipe.ingredients), 
//         JSON.stringify(recipe.instructions)
//       ];

//       await pool.query(sqlQuery, values);
//     }

//     console.log("✅ Success! 50 recipes added to your database.");
//     process.exit(0);

//   } catch (error) {
//     console.error("❌ Error seeding database:", error);
//     process.exit(1);
//   }
// }

// seedDatabase();

import pg from 'pg';
import dotenv from 'dotenv';

// Load your environment variables so it can find your DATABASE_URL
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// The Upgraded Native Nigerian Recipe Data
const nigerianRecipes = [
  {
    title: "Authentic Amala, Ewedu, and Gbegiri (Abula)",
    category: "Soup & Swallow",
    description: "A classic Western Nigerian delicacy. Smooth, dark yam flour dough served with a signature jute leaf and bean soup combo.",
    ingredients: [
      "2 cups Elubo (Yam flour)",
      "4 cups boiling water",
      "2 cups Ewedu leaves (Jute leaves), picked and washed",
      "1 tsp Iru (Locust beans)",
      "1 tbsp ground Crayfish",
      "1/2 tsp Potash (Kaun)",
      "1 cup peeled Honey beans (for Gbegiri)",
      "1/4 cup Palm oil",
      "1 lb Assorted meat and Ponmo (cow skin)",
      "Salt and Bouillon cubes to taste"
    ],
    instructions: [
      "For the Amala: Bring water to a rolling boil. Reduce heat and gradually stir in the yam flour using a wooden spatula (omorogun) until smooth.",
      "Add a splash of hot water, cover, and let it steam for 5 minutes. Stir vigorously against the pot until elastic and lump-free.",
      "For the Ewedu: Lightly blend the washed leaves. Pour into a pot, add potash, locust beans, crayfish, and salt. Cook on medium heat for 3-5 minutes (do not cover the pot!).",
      "For the Gbegiri: Boil the peeled beans until extremely soft. Mash or blend until completely smooth.",
      "Cook the mashed beans with palm oil, crayfish, and seasoning until it thickens into a rich yellow soup.",
      "Serve the hot Amala in a deep bowl, topped generously with the Gbegiri, Ewedu, and your meat stew."
    ],
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: "Hard",
    calories: 550,
    imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1000&auto=format&fit=crop" 
  },
  {
    title: "Traditional Iyan (Pounded Yam) and Egusi",
    category: "Soup & Swallow",
    description: "The king of Yoruba cuisine. Fluffy, stretchy pounded yam paired with a rich, meat-packed melon seed soup.",
    ingredients: [
      "1 large tuber of white Yam (African Yam)",
      "Water for boiling",
      "2 cups ground Egusi (Melon seeds)",
      "1.5 lbs Assorted meats (Beef, Shaki, Ponmo)",
      "1 cup Palm oil",
      "1 large onion, chopped",
      "3 Scotch bonnet peppers (Ata rodo), blended with 2 bell peppers",
      "2 tbsp ground Crayfish",
      "1 bunch Ugu (Fluted pumpkin leaves) or Spinach, washed and chopped",
      "Salt and Seasoning cubes to taste"
    ],
    instructions: [
      "For the Iyan: Peel the yam, cut into thick chunks, wash thoroughly, and boil until very soft (a fork should pierce them easily).",
      "Transfer the hot yams to a mortar and pound with a pestle until completely smooth, stretchy, and lump-free (a food processor works too!).",
      "For the Egusi: Boil the meats with salt, onions, and seasoning until tender. Reserve the rich meat stock.",
      "Heat palm oil in a pot, add chopped onions, and fry the ground Egusi for about 5 minutes, stirring constantly.",
      "Stir in the blended pepper mix, meat stock, and crayfish. Let it simmer for 15 minutes until the oil begins to float to the top.",
      "Add the cooked meats and chopped leaves. Simmer for 3 final minutes. Serve steaming hot with the Pounded Yam."
    ],
    prepTime: 25,
    cookTime: 60,
    servings: 6,
    difficulty: "Medium",
    calories: 700,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Ofada Rice and Ayamase (Designer Stew)",
    category: "Main Course",
    description: "A deeply flavorful, spicy green bell pepper and bleached palm oil stew served over indigenous, unpolished short-grain Ofada rice.",
    ingredients: [
      "3 cups indigenous Ofada rice",
      "4 large Green Bell Peppers",
      "3 Scotch bonnet peppers (Ata rodo)",
      "2 large Onions",
      "1.5 cups Palm oil",
      "1.5 lbs Assorted meat (boiled and chopped into bite-sized pieces)",
      "4 hard-boiled eggs, peeled",
      "2 tbsp Iru (Locust beans)",
      "2 tbsp ground Crayfish",
      "Salt and Seasoning cubes to taste"
    ],
    instructions: [
      "For the Rice: Pick stones from the Ofada rice. Wash multiple times in hot water to remove dirt and the strong fermented smell. Boil until tender.",
      "For the Ayamase: Roughly blend the green bell peppers, scotch bonnets, and one onion. Pour into a pot and boil until all the excess water evaporates.",
      "In a clean, dry pot with a tight-fitting lid, bleach the palm oil on medium heat for 10-15 minutes until it looks like dark vegetable oil. (Keep your kitchen highly ventilated!)",
      "Turn off the heat and let the oil cool slightly. Add chopped onions and Iru, frying for 1 minute to release the signature aroma.",
      "Add the boiled green pepper paste and fry for 10 minutes. Stir in the chopped meats, crayfish, and seasoning.",
      "Add the boiled eggs and simmer until the oil floats beautifully to the top. Serve over the Ofada rice, traditionally in a uma leaf."
    ],
    prepTime: 20,
    cookTime: 75,
    servings: 5,
    difficulty: "Hard",
    calories: 850,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop"
  }
];

const seedDatabase = async () => {
  console.log("🌱 Starting database seeding...");

  try {
    // Loop through each recipe and insert it
    for (const recipe of nigerianRecipes) {
      
      const sqlQuery = `
        INSERT INTO recipes 
        (title, category, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, calories, image_url, author_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;
      
      const values = [
        recipe.title,
        recipe.category,
        recipe.description,
        // CRITICAL: We JSON.stringify the arrays so they match your new database setup!
        JSON.stringify(recipe.ingredients), 
        JSON.stringify(recipe.instructions), 
        recipe.prepTime,
        recipe.cookTime,
        recipe.servings,
        recipe.difficulty,
        recipe.calories,
        recipe.imageUrl,
        1 // Assuming your admin user has an ID of 1 in the users table!
      ];

      await pool.query(sqlQuery, values);
      console.log(`✅ Added recipe: ${recipe.title}`);
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    pool.end();
  }
};

seedDatabase();