import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "@/components/pages/LoginPage";
import SignUpPage from "@/components/pages/SignUpPage";
import HomePage from "@/components/pages/HomePage";
import AllPatientsPage from "@/components/pages/AllPatientsPage";
import AppointmentsPage from "./components/pages/AppointmentsPage";
import PatientDetailsPage from "@/components/pages/PatientDetailsPage";
import NotFoundPage from "@/components/pages/NotFoundPage";

import { Toaster } from "@/components/ui/sonner";

import { type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { LoaderCircle } from "lucide-react";
import GradientWrapper from "./components/GradientWrapper";

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
        <GradientWrapper />
        <LoaderCircle className="mr-2 h-6 w-6 animate-spin" />
        <p className="animate-pulse text-muted-foreground">Loading...</p>
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
          path="/patients"
          element={user ? <AllPatientsPage /> : <Navigate to="/forbidden" />}
        />
        <Route
          path="/patients/:id"
          element={user ? <PatientDetailsPage /> : <Navigate to="/forbidden" />}
        />
        <Route
          path="/appointment"
          element={user ? <AppointmentsPage /> : <Navigate to="/forbidden" />}
        />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}

export default App;
