import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./recipeCard.css";

const RecipeCard = ({
  recipe,
  onCardClick,
  showAdminControls = false,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
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

          <span className="calories-text">{calories} cal</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
