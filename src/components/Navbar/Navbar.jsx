import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/NavBar/Logo2.png";
import "./navbar.css";
import Toast from "../Modals/Toast";

const Navbar = ({ onClick, onRecipesClick }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      navigate(`/recipes?search=${searchInput}`);
      setSearchInput("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setToast({
      isOpen: true,
      title: "Signed Out",
      message: "You have successfully logged out.",
      type: "success",
    });

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const navigateAndClose = (path) => {
    if (path === "/" && onClick) {
      onClick();
    }
    navigate(path, { state: { forceReset: Date.now() } });
    setIsMenuOpen(false);
  };

  const handleRecipeClick = () => {
    if (onRecipesClick) {
      onRecipesClick();
    } else {
      navigate("/");
    }
    setIsMenuOpen(false);
  };

  return (
    <div>
      <div className="navSection">
        <div className="navLeft">
          <img
            className="navLogo"
            src={Logo}
            alt="Logo"
            onClick={() => navigateAndClose("/")}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div
          className={`hamburger ${isMenuOpen ? "toggle" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {isMenuOpen && (
          <div
            className="menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        <div className={`navRight ${isMenuOpen ? "open" : ""}`}>
          <img
            className="mobileNavLogo"
            src={Logo}
            alt="Logo"
            onClick={() => navigateAndClose("/")}
            style={{ cursor: "pointer" }}
          />
          <input
            className="navList nav-search"
            type="search"
            name="Search"
            placeholder="Search recipes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          <nav
            className="navList"
            onClick={() => navigateAndClose("/")}
            style={{ cursor: "pointer" }}
          >
            Home
          </nav>

          <nav
            className="navList"
            onClick={() => navigateAndClose("/recipes")}
            style={{ cursor: "pointer" }}
          >
            Recipe
          </nav>

          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigateAndClose("/dashboard")}
                className="nav-btn dashboard-btn"
              >
                Dashboard
              </button>
              <button onClick={handleLogout} className="nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigateAndClose("/auth")}
              className="nav-btn login-btn"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
      <Toast
        isOpen={toast.isOpen}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default Navbar;
