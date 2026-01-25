import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { getFriendlyAuthError } from "@/lib/auth-errors";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import GradientWrapper from "../GradientWrapper";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");

      toast.success("Logged in successfully!", {
        description: "Welcome back to SHIELD.",
      });
    } catch (err: any) {
      const friendlyMessage = getFriendlyAuthError(err.code);
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GradientWrapper />
      <div className="flex min-h-screen items-center justify-center p-4 font-poppins">
        <Card className="w-full max-w-md ">
          <CardHeader>
            <CardTitle>Doctor Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full " disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className=" hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} SHIELD. All rights reserved.
        </div>
      </div>
    </>
  );
}
