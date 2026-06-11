import React from "react";
import "./RecipeDetails.css";

const RecipeDetails = ({ recipe, isLoggedIn, isFavorite, onFavoriteClick }) => {
  const { imageUrl, category, title, description, difficulty } = recipe;

  const getDifficultyClass = (level) => {
    switch (level?.toLowerCase()) {
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
    <div className="recipeDetails">
      <div className="detailsImg-container">
        {isLoggedIn && (
          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick();
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="heart-icon"
              fill={isFavorite ? "red" : "none"}
              stroke={isFavorite ? "red" : "currentColor"}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
        <img src={imageUrl} alt={title} className="detailsImg" />
        <div className="detailsContent">
          <div className="detailsBadge">
            <span className="detailsCategoryBadge">{category}</span>
            <span
              className={`detailsDifficultyBadge ${getDifficultyClass(difficulty)}`}
            >
              {difficulty}
            </span>
          </div>
          <h3 className="detailsTitle">{title}</h3>
          <p className="detailsDescription">{description}</p>
        </div>
      </div>
      <div className="description">
        <h2>Description</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
