import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./recipeCard.css";

const RecipeCard = ({
  recipe,
  onCardClick,
  isInitiallyFavorite = false,
  onUnfavorite,
  showAdminControls = false,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite || false);

  const isLoggedIn = !!localStorage.getItem("token");

  const {
    id,
    imageUrl,
    category,
    title,
    description,
    prepTime,
    servings,
    difficulty,
    calories,
  } = recipe;

  useEffect(() => {
    setIsFavorite(isInitiallyFavorite || false);
  }, [isInitiallyFavorite]);

  // const handleFavoriteClick = async (e) => {
  //   e.stopPropagation();

  //   if (!isLoggedIn) return;

  //   const newFavoriteState = !isFavorite;
  //   setIsFavorite(newFavoriteState);

  //   try {
  //     const token = localStorage.getItem("token");
  //     const method = newFavoriteState ? "POST" : "DELETE";
  //     const url = newFavoriteState
  //       ? `http://localhost:3000/api/favorites/toggle`
  //       : `http://localhost:3000/api/favorites/toggle/${recipe.id}`;

  //     const response = await fetch(url, {
  //       method: method,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: newFavoriteState ? JSON.stringify({ recipeId: id }) : null,
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setIsFavorite(!newFavoriteState);
  //       if (!newFavoriteState && onUnfavorite) {
  //         onUnfavorite(recipe.id);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Failed to toggle favorite", error);
  //     setIsFavorite(!newFavoriteState);
  //   }
  // };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    // 🔥 Functional update guarantees instant UI reaction
    setIsFavorite((prev) => {
      const newState = !prev; // Calculate what it should change to

      // Fire the backend request in the background
      const toggleInDatabase = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:3000/api/favorites/toggle", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ recipeId: id }) // uses 'id' from your card props
          });

          if (!response.ok) {
             setIsFavorite(!newState); // Revert ONLY if the server crashes
          } else if (!newState && onUnfavorite) {
             onUnfavorite(id); // Handle dashboard removal
          }
        } catch (error) {
          console.error("Failed to toggle favorite", error);
          setIsFavorite(!newState); // Revert on network error
        }
      };
      
      toggleInDatabase();
      return newState; // Instantly turns the heart red/white
    });
  };

  const getDifficultyClass = (level) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "badge-easy";
      case "medium":
        return "badge-medium";
      case "hard":
        return "badge-hard";
      default:
        return "";
    }
  };
  return (
    <div className="recipeCard" onClick={onCardClick}>
      <div className="cardImg-container">
        <img src={imageUrl} alt={title} className="cardImg" />
        <span className="categoryBadge">{category}</span>
      </div>

      {showAdminControls && (
        <div className="admin-controls" onClick={(e) => e.stopPropagation()}>
          <button
            className="admin-action-btn edit-btn"
            onClick={() => onEdit(recipe)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="admin-icon edit-icon"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>

          <button
            className="admin-action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(recipe.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="admin-icon delete-icon"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Delete
          </button>
        </div>
      )}

      <div className="cardContent">
        <h3 className="cardTitle">{title}</h3>
        <p className="cardDescription">{description}</p>
        <div className="cardMeta">
          <div className="metaItem">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{prepTime} min</span>
          </div>
          <div className="metaItem">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{servings} servings</span>
          </div>
        </div>
        <div className="cardFooter">
          <span
            className={`difficulty-badge ${getDifficultyClass(difficulty)}`}
          >
            {difficulty}
          </span>
          {isLoggedIn && (
            <button
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={handleFavoriteClick}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="heart-icon"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
          <span className="calories-text">{calories} cal</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
