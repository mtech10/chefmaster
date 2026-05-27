import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import RecipePage from "./RecipePage";
import AuthPage from "./components/AuthPage/AuthPage";
import AdminPage from "./components/AdminPage/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isMainHome={true} />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/recipes" element={<Home isMainHome={false} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
