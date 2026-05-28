import React from "react";
import "./RecipeDetails.css";

const RecipeDetails = ({ recipe, isLoggedIn, isFavorite, onFavoriteClick }) => {
  const { imageUrl, category, title, description, difficulty } = recipe;

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
    <div className="recipeDetails">
      <div className="detailsImg-container">
        {isLoggedIn && (
          <button 
            className="favorite-btn" 
            onClick={onFavoriteClick}
          >
            {isFavorite ? "❤️" : "🤍"}
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
