import React from "react";
import "./ingredients.css";

const Ingredients = ({ ingredients, instructions }) => {
  return (
    <div className="recipe-content-container">
      <div className="ingredient-container">
        <h2 className="title">Ingredients</h2>
        <ul className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
              <span className="bullet">
                <span className="bullet2"></span>
              </span>
              <span className="ingredient-text">{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="instructions">
        <h2 className="title">Instructions</h2>
        <div className="instruction-list">
            {instructions.map((instructions, index) => (
                <div key={index} className="instruction-item">
                    <div className="instruction-number">
                        {index+1}
                    </div>
                    <p className="instruction-text">{instructions}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Ingredients;
