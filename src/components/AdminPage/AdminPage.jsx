import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import RecipeCard from "../RecipeCard/RecipeCard";
import Footer from "../Footer/Footer";
import Toast from "../Modals/Toast";
import DeleteModals from "../Modals/DeleteModal";
import "./AdminPage.css";

const AdminPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    ingredients: "",
    instructions: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "Easy",
    calories: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });
  const [myRecipes, setMyRecipes] = useState([]);
  const [loadingMyRecipes, setLoadingMyRecipes] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    recipeId: null,
    itemName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [username, setUsername] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoadingFavorites(false);
      }
    };
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/my-recipes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setMyRecipes(data);
        }
      } catch (error) {
        console.error("Error fetching my recipes:", error);
      } finally {
        setLoadingMyRecipes(false);
      }
    };

    fetchFavorites();
    fetchMyRecipes();
  }, []);

  useEffect(() => {
    if (location.state?.editRecipeData) {
      const recipeData = location.state.editRecipeData;

      setFormData({
        title: recipeData.title,
        category: recipeData.category,
        description: recipeData.description,
        ingredients: Array.isArray(recipeData.ingredients)
          ? recipeData.ingredients.join(", ")
          : recipeData.ingredients,
        instructions: Array.isArray(recipeData.instructions)
          ? recipeData.instructions.join("\n")
          : recipeData.instructions,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime || "",
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        calories: recipeData.calories,
        image: null,
      });

      setEditingId(recipeData.id);
      setShowForm(true);

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const savedName = localStorage.getItem("username");
    if (savedName) {
      setUsername(savedName);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSend = new FormData();

    const ingredientsArray = formData.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const instructionsArray = formData.instructions
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    dataToSend.append("ingredients", JSON.stringify(ingredientsArray));
    dataToSend.append("instructions", JSON.stringify(instructionsArray));
    dataToSend.append("title", formData.title);
    dataToSend.append("category", formData.category);
    dataToSend.append("description", formData.description);
    dataToSend.append("prepTime", formData.prepTime);
    dataToSend.append("cookTime", formData.cookTime);
    dataToSend.append("servings", formData.servings);
    dataToSend.append("difficulty", formData.difficulty);
    dataToSend.append("calories", formData.calories);

    if (formData.image) {
      dataToSend.append("image", formData.image);
    }

    try {
      const token = localStorage.getItem("token");

      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/api/recipes/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/recipes`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      if (response.ok) {
        setToast({
          isOpen: true,
          title: "Recipe Published!",
          message: editingId
            ? "Your recipe was successfully updated."
            : "Your new recipe is now live.",
          type: "success",
        });
        setFormData({
          title: "",
          category: "",
          description: "",
          ingredients: "",
          instructions: "",
          prepTime: "",
          cookTime: "",
          servings: "",
          difficulty: "Easy",
          calories: "",
          image: null,
        });
        setEditingId(null);
        setShowForm(false);
        document.querySelector('input[type="file"]').value = "";
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        setToast({
          isOpen: true,
          title: "Publishing Failed",
          message:
            errorData.error || "Could not post recipe. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
      setToast({
        isOpen: true,
        title: "Publishing Failed",
        message: "❌ Error connecting to server.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recipes/${deleteModal.recipeId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        setToast({
          isOpen: true,
          title: "Recipe Deleted",
          message: "The recipe has been removed successfully.",
          type: "success",
        });

        setMyRecipes(myRecipes.filter((r) => r.id !== deleteModal.recipeId));
      } else {
        setToast({
          isOpen: true,
          title: "Delete Failed",
          message: "Could not delete the recipe.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        isOpen: true,
        title: "Error",
        message: "Server error. Please try again.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, recipeId: null, itemName: "" });
    }
  };

  return (
    <div className="page-wrapper admin-page">
      <Navbar />

      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h2>Welcome back, {username ? username : "chef"}</h2>
            <p>Manage your culinary creations and saved favorites.</p>
          </div>
          <button
            className={`toggle-form-btn ${showForm ? "cancel" : "add"}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              "Cancel Creation"
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="plus-icon"
                >
                  <path
                    d="M12 5v14m-7-7h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Create New Recipe
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="admin-container form-card">
            <h3>Create a New Recipe</h3>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Recipe Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Spicy Tacos"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g., Vegan, Breakfast, Italian..."
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="A brief hook about the meal..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Prep Time (mins)</label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Cook Time (mins)</label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>
                  Ingredients (Highlight each ingredient with a comma)
                </label>
                <textarea
                  name="ingredients"
                  rows="10"
                  placeholder="2 cups flour, 1 tsp salt..."
                  value={formData.ingredients}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="input-group">
                <label>
                  Instructions (Highlight each instruction with a new line)
                </label>
                <textarea
                  name="instructions"
                  rows="10"
                  placeholder="Preheat oven..."
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="input-group file-upload-group">
                <label>Recipe Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Publish Recipe"}
              </button>
            </form>
          </div>
        )}

        <div className="dashboard-section">
          <h3 className="section-title">My Recipes</h3>

          {loadingMyRecipes ? (
            <div className="section-spinner-container">
              <div className="loading-spinner dashboard-big-spinner"></div>
            </div>
          ) : myRecipes.length === 0 ? (
            <div className="empty-state">
              <p>You haven't published any recipes yet!</p>
              <span>
                Click "Create New Recipe" above to share your first dish with
                the world.
              </span>
            </div>
          ) : (
            <div className="recipeCards dashboard-grid">
              {myRecipes.map((recipe) => {
                const formattedRecipe = {
                  id: recipe.id,
                  imageUrl: recipe.image_url,
                  category: recipe.category,
                  title: recipe.title,
                  description: recipe.description,
                  prepTime: recipe.prep_time,
                  cookTime: recipe.cook_time,
                  servings: recipe.servings,
                  difficulty: recipe.difficulty || "Medium",
                  calories: recipe.calories,
                  ingredients: recipe.ingredients,
                  instructions: recipe.instructions,
                  author_id: recipe.author_id,
                };

                return (
                  <RecipeCard
                    key={formattedRecipe.id}
                    recipe={formattedRecipe}
                    isInitiallyFavorite={favorites.some(
                      (fav) =>
                        fav.id === recipe.id || fav.recipe_id === recipe.id,
                    )}
                    onDelete={() =>
                      setDeleteModal({
                        isOpen: true,
                        recipeId: formattedRecipe.id,
                        itemName: formattedRecipe.title,
                      })
                    }
                    onCardClick={() => {
                      navigate(`/recipe/${formattedRecipe.id}`, {
                        state: { recipeData: formattedRecipe },
                      });
                      window.scrollTo(0, 0);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">Favorites</h3>

          {loadingFavorites ? (
            <div className="section-spinner-container">
              <div className="loading-spinner dashboard-big-spinner"></div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="empty-state">
              <p>You haven't saved any recipes yet!</p>
              <span>
                Go browse the homepage and click the heart icon on recipes you
                love.
              </span>
            </div>
          ) : (
            <div className="recipeCards dashboard-grid">
              {favorites.map((recipe) => {
                const formattedRecipe = {
                  id: recipe.id,
                  imageUrl: recipe.image_url,
                  category: recipe.category,
                  title: recipe.title,
                  description: recipe.description,
                  prepTime: recipe.prep_time,
                  cookTime: recipe.cook_time,
                  servings: recipe.servings,
                  difficulty: recipe.difficulty || "Medium",
                  calories: recipe.calories,
                };
                return (
                  <RecipeCard
                    key={formattedRecipe.id}
                    recipe={formattedRecipe}
                    isInitiallyFavorite={true}
                    onCardClick={() => {
                      navigate(`/recipe/${formattedRecipe.id}`, {
                        state: { recipeData: formattedRecipe },
                      });
                      window.scrollTo(0, 0);
                    }}
                    onUnfavorite={(unfavoritedId) => {
                      setFavorites((prevFavorites) =>
                        prevFavorites.filter((fav) => fav.id !== unfavoritedId),
                      );
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      <DeleteModals
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, recipeId: null, itemName: "" })
        }
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        itemName={deleteModal.itemName}
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
};

export default AdminPage;
