import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import Toast from "../Modals/Toast";

const validateField = (name, value) => {
  switch (name) {
    case "firstName":
      if (!value) return "First name is required";
      if (!/^[a-zA-Z]{2,20}$/.test(value))
        return "First name must be letters only, between 2 and 20 characters";
      return "";

    case "lastName":
      if (!value) return "Last name is required";
      if (!/^[a-zA-Z]{2,20}$/.test(value))
        return "Last name must be letters only, between 2 and 20 characters";
      return "";

    case "username":
      if (!value) return "Username is required";
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(value))
        return "Username must be 3 to 20 characters, letters, numbers and underscores only";
      return "";

    case "email":
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Please provide a valid email address";
      return "";

    case "password":
      if (!value) return "Password is required";
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d.@$!%*?&]{8,}$/.test(
          value,
        )
      )
        return "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number and special character (.@$!%*?&)";
      return "";

    default:
      return "";
  }
};

const emptyForm = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
};
const emptyErrors = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
};
const emptyTouched = {
  firstName: false,
  lastName: false,
  username: false,
  email: false,
  password: false,
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [touched, setTouched] = useState(emptyTouched);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (isLogin && name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: value ? "" : "Password is required",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (isLogin && name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: value ? "" : "Password is required",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const isFormValid = () => {
    if (isLogin) {
      return (
        formData.email && formData.password && !errors.email && !errors.password
      );
    }
    return (
      formData.firstName &&
      formData.lastName &&
      formData.username &&
      formData.email &&
      formData.password &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.username &&
      !errors.email &&
      !errors.password
    );
  };

  const handleToggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData(emptyForm);
    setErrors(emptyErrors);
    setTouched(emptyTouched);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setLoading(true);

    const endpoint = isLogin ? "/login" : "/register";
    const url = `${import.meta.env.VITE_API_URL}${endpoint}`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          firstname: formData.firstName,
          lastname: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.user.username);

          setToast({
            isOpen: true,
            title: "Welcome back!",
            message: "You have been signed in successfully.",
            type: "success",
          });

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          setToast({
            isOpen: true,
            title: "Account Created!",
            message: "Registration successful! Please log in.",
            type: "success",
          });
          setIsLogin(true);
          setFormData(emptyForm);
          setTouched(emptyTouched);
          setErrors(emptyErrors);
        }
      } else {
        const errorMessage = data.errors
          ? data.errors.map((err) => err.msg).join("\n")
          : data.message || "Something went wrong. Please try again.";

        setToast({
          isOpen: true,
          title: isLogin ? "Login Failed" : "Registration Failed",
          message: errorMessage,
          type: "error",
        });
      }
    } catch (err) {
      setToast({
        isOpen: true,
        title: "Connection Error",
        message: "Unable to reach the server.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="First Name"
                  className={
                    touched.firstName && errors.firstName ? "input-error" : ""
                  }
                />
                {touched.firstName && errors.firstName && (
                  <span className="field-error">{errors.firstName}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Last Name"
                  className={
                    touched.lastName && errors.lastName ? "input-error" : ""
                  }
                />
                {touched.lastName && errors.lastName && (
                  <span className="field-error">{errors.lastName}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Username"
                  className={
                    touched.username && errors.username ? "input-error" : ""
                  }
                />
                {touched.username && errors.username && (
                  <span className="field-error">{errors.username}</span>
                )}
              </div>
            </>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className={touched.email && errors.email ? "input-error" : ""}
            />
            {touched.email && errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              className={
                touched.password && errors.password ? "input-error" : ""
              }
            />
            {touched.password && errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className={`auth-button ${!isFormValid() ? "button-disabled" : ""}`}
            disabled={!isFormValid() || loading}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={handleToggleMode}>
            {isLogin ? "Sign up here" : "Log in here"}
          </span>
        </p>
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

export default AuthPage;
