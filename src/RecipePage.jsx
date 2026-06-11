import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import RecipeDetails from "./components/RecipeDetails/RecipeDetails";
import RecipeStats from "./components/RecipeStats/RecipeStats";
import Ingredients from "./components/Ingredients/Ingredients";
import LoadingModal from "./components/Modals/LoadingModal";
import DeleteModal from "./components/Modals/DeleteModal";
import Toast from "./components/Modals/Toast";
import Footer from "./components/Footer/Footer";

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [recipe, setRecipe] = useState(location.state?.recipeData || null);
  const [loading, setLoading] = useState(!recipe);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.id;
    } catch (e) {
      console.error("Could not decode token");
    }
  }

  useEffect(() => {
    if (!recipe) {
      const fetchSingleRecipe = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/recipes/${id}`,
          );
          if (!response.ok) throw new Error("Recipe not found");

          const data = await response.json();

          setRecipe({
            id: data.id,
            imageUrl: data.image_url,
            category: data.category,
            title: data.title,
            description: data.description,
            prepTime: data.prep_time,
            cookTime: data.cook_time,
            servings: data.servings,
            difficulty: data.difficulty,
            calories: data.calories,
            ingredients: data.ingredients,
            instructions: data.instructions,
            author_id: data.author_id,
          });

          setLoading(false);
        } catch (error) {
          console.error("Error:", error);
          setLoading(false);
        }
      };

      fetchSingleRecipe();
    }
  }, [id, recipe]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isLoggedIn || !recipe) return;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          const favorites = await response.json();
          const isFav = favorites.some(
            (fav) => fav.id === recipe.id || fav.recipe_id === recipe.id,
          );
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [recipe, isLoggedIn]);

  const handleEdit = () => {
    navigate("/dashboard", { state: { editRecipeData: recipe } });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recipes/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        navigate("/", { replace: true });
      } else {
        alert("Failed to delete recipe.");
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!isLoggedIn || !recipe) return;

    const previousState = isFavorite;
    setIsFavorite(!previousState);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId: recipe.id }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setToast({
          isOpen: true,
          title: data.isFavorite
            ? "Added to Favorites"
            : "Removed from Favorites",
          message: data.isFavorite
            ? "Recipe saved successfully!"
            : "Recipe removed from your list.",
          type: "success",
        });
      } else {
        throw new Error("Failed to toggle");
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      setIsFavorite(previousState);
      setToast({
        isOpen: true,
        title: "Error",
        message: "Failed to update favorites. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <LoadingModal isOpen={true} message="Fetching recipe details..." />
      </div>
    );
  }

  const isAuthor = String(currentUserId) === String(recipe.author_id);

  return (
    <div>
      <Navbar />

      <main
        style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}
      >
        <RecipeDetails
          recipe={recipe}
          isLoggedIn={isLoggedIn}
          isFavorite={isFavorite}
          onFavoriteClick={handleFavoriteClick}
        />

        {isAuthor && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <button
              className="admin-action-btn edit-btn"
              onClick={handleEdit}
              style={{
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                borderRadius: "8px",
                border: "1px solid #ff6b00",
                backgroundColor: "white",
                color: "#ff6b00",
                fontWeight: "bold",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Recipe
            </button>

            <button
              className="admin-action-btn delete-btn"
              onClick={handleDeleteClick}
              style={{
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                borderRadius: "8px",
                border: "1px solid #d32f2f",
                backgroundColor: "white",
                color: "#d32f2f",
                fontWeight: "bold",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Delete Recipe
            </button>
          </div>
        )}

        <RecipeStats
          prepTime={recipe.prepTime}
          cookTime={recipe.cookTime}
          servings={recipe.servings}
          calories={recipe.calories}
        />

        <Ingredients
          ingredients={recipe.ingredients || []}
          instructions={recipe.instructions || []}
        />
      </main>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        isDeleting={isDeleting}
        itemName={recipe.title}
      />

      <Toast
        isOpen={toast.isOpen}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      <Footer />
    </div>
  );
}; // ✅ THIS IS THE DOOR THAT MUST CLOSE LAST!

export default RecipePage;
