import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "@/components/pages/LoginPage";
import SignUpPage from "@/components/pages/SignUpPage";
import HomePage from "@/components/pages/HomePage";
import PatientPage from "@/components/pages/PatientPage";
import AppointmentsPage from "./components/pages/AppointmentsPage";

import { type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/patient"
          element={user ? <PatientPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/appointment"
          element={user ? <AppointmentsPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
