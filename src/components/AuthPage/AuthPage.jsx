import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import Toast from "../Modals/Toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/login" : "/register";
    const url = `http://localhost:3000${endpoint}`;

    const payload = isLogin
      ? { email, password }
      : { firstname: firstName, lastname: lastName, username, email, password };

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
          setPassword("");
          setFirstName("");
          setLastName("");
          setUsername("");
        }
      }  else {
        setToast({
          isOpen: true,
          title: isLogin ? "Login Failed" : "Registration Failed",
          message: data.message || "Something went wrong. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      setError(err.message);
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

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="First Name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Last Name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                 placeholder="Username"
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
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
