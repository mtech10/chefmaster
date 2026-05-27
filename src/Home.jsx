import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import RecipeCard from "./components/RecipeCard/RecipeCard";
import Footer from "./components/Footer/Footer";
import LoadingModal from "./components/Modals/LoadingModal";
import "./Home.css";

const Home = ({ isMainHome = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [viewMode, setViewMode] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("https://chefmaster-85kn.onrender.com//api/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
        setLoading(false);
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("https://chefmaster-85kn.onrender.com//api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401 || response.status === 403) {
        console.warn("Token expired. Clearing session.");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        return; 
      }
        if (response.ok) {
          const data = await response.json();
          // Extract just the IDs of the favorite recipes into a Set for fast checking
          const ids = new Set(data.map((fav) => fav.id || fav.recipe_id));
          setFavoriteIds(ids);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchRecipes();
    fetchFavorites();
    setSelectedCategory("All");
  }, [location.state?.forceReset]);

  const handleCardClick = (recipeData) => {
    navigate(`/recipe/${recipeData.id}`, { state: { recipeData: recipeData } });
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setViewMode("recipes");
    window.scrollTo(0, 0);
  };

  const uniqueCategories = [
    ...new Set(recipes.map((r) => r.category).filter(Boolean)),
  ];

  const categoryCards = uniqueCategories.map((category) => {
    const representativeRecipe = recipes.find((r) => r.category === category);
    return {
      name: category,
      image: representativeRecipe.image_url,
    };
  });

  let displayedRecipes = recipes;

  // If they are typing ANYTHING in the search bar, filter everything immediately
  if (searchQuery) {
    displayedRecipes = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  } else if (isMainHome && selectedCategory !== "All") {
    displayedRecipes = recipes.filter(
      (recipe) => recipe.category === selectedCategory,
    );
  }

  return (
    <div>
      {/* 1. NAVBAR LOGIC: Keep your existing Navbar logic */}
      {viewMode === "categories" ? (
        <Navbar onRecipesClick={() => handleCategoryClick("All")} />
      ) : (
        <Navbar onClick={() => setViewMode("categories")} />
      )}

      <main
        style={{
          position: "relative",
          padding: "20px",
          margin: "0 auto",
          minHeight: "80vh",
        }}
      >
        {/* =========================================
            SECTION A: THE MAIN HOMEPAGE (Hero & Categories)
            Only shows if isMainHome is true AND we are in 'categories' view
            ========================================= */}
        {isMainHome && viewMode === "categories" && !searchQuery && (
          <>
            <div className="hero-section">
              <div className="hero-content">
                <h1>All Recipes Cookbook</h1>
                <p>Discover mouth-watering recipes shared by our community.</p>
                <button
                  className="explore-all-btn"
                  onClick={() => handleCategoryClick("All")}
                >
                  Explore All Recipes
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "40px 20px",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              {!loading && (
                <div className="category-hub-grid">
                  {categoryCards.map((cat, index) => (
                    <div
                      key={index}
                      className="category-image-card"
                      style={{ backgroundImage: `url(${cat.image})` }}
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                      <div className="category-card-overlay"></div>
                      <h3 className="category-card-title">
                        {cat.name} RECIPES
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div
          style={{
            padding: "0 20px 40px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {(!isMainHome || viewMode === "recipes") && (
            <>
              {/* Header: Only show the category title if we are on the Main Home */}
              {isMainHome && (
                <div className="recipe-view-header">
                  <h2 className="section-title">
                    {selectedCategory === "All"
                      ? "All Recipes"
                      : `${selectedCategory} Recipes`}
                  </h2>
                </div>
              )}

              {displayedRecipes.length === 0 && !loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "50px 0",
                    color: "#666",
                  }}
                >
                  <h3>No recipes found</h3>
                </div>
              ) : (
                <div className="recipeCards">
                  {displayedRecipes.map((dbRecipe) => {
                    const formattedRecipe = {
                      id: dbRecipe.id,
                      imageUrl: dbRecipe.image_url,
                      category: dbRecipe.category,
                      title: dbRecipe.title,
                      description: dbRecipe.description,
                      prepTime: dbRecipe.prep_time,
                      cookTime: dbRecipe.cook_time,
                      servings: dbRecipe.servings,
                      difficulty: dbRecipe.difficulty || "Medium",
                      calories: dbRecipe.calories,
                      ingredients: dbRecipe.ingredients,
                      instructions: dbRecipe.instructions,
                      author_id: dbRecipe.author_id,
                    };

                    return (
                      <RecipeCard
                        key={formattedRecipe.id}
                        recipe={formattedRecipe}
                        isInitiallyFavorite={favoriteIds.has(
                          formattedRecipe.id,
                        )}
                        onCardClick={() => handleCardClick(formattedRecipe)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

          {loading && (
            <div className="category-hub-grid" style={{ marginTop: "40px" }}>
              <div className="category-image-card skeleton-card"></div>
              <div className="category-image-card skeleton-card"></div>
              <div className="category-image-card skeleton-card"></div>
            </div>
          )}

          <LoadingModal isOpen={loading} message="Preparing your cookbook..." />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
