import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

import { auth } from "@/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { deleteUser } from "firebase/auth";
import { getFriendlyAuthError } from "@/lib/auth-errors";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import apiClient from "@/api/apiClient";

const SPECIALIZATIONS = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Psychiatry",
  "Surgery",
  "Radiology",
];

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [phone, setPhone] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, specialization: value });
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.specialization) {
      setError("Please select a specialization");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    let user = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      user = userCredential.user;

      const response = await apiClient.post(`/doctor`, {
        name: formData.name,
        specialization: formData.specialization,
        phone_number: phone,
        email: formData.email,
      });
      // const response = await axios.post(`${baseUrl}/doctor`, {
      //   doctor_id: user.uid,
      //   name: formData.name,
      //   specialization: formData.specialization,
      //   phone_number: phone,
      //   email: formData.email,
      // });

      if (response.status === 201) {
        toast.success("Account created successfully!", {
          description: "Welcome to SHIELD.",
        });

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err: any) {
      if (user) {
        await deleteUser(user);
      }

      const friendlyMessage = err.code
        ? getFriendlyAuthError(err.code)
        : err.response?.data?.error || "An error occurred";

      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GradientWrapper />
      <main className="min-h-screen font-poppins flex flex-col items-center justify-center px-4">
        <div className="mb-2">
          <img
            src="/images/ShieldHorizontal.svg"
            alt="Shield Logo"
            className="h-20 w-auto"
          />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle id="signup-title">Doctor Sign Up</CardTitle>
            <CardDescription>
              Register your profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSignUp}
              className="space-y-4"
              aria-labelledby="signup-title"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              {/* Specialization Dropdown */}
              <div className="space-y-2">
                <Label id="specialization-label">Specialization</Label>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger
                    className="w-full"
                    aria-labelledby="specialization-label"
                  >
                    <SelectValue placeholder="Select a field" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map((spec) => (
                      <SelectItem
                        className=" cursor-pointer"
                        key={spec}
                        value={spec}
                      >
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  id="phone"
                  international
                  defaultCountry="AE"
                  value={phone}
                  onChange={setPhone}
                  className="flex h-10 w-full rounded-3xl border border-input bg-[#F7F7F7] px-3 py-2 text-sm"
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="janesmith@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              {error && (
                <p
                  className="text-sm text-red-500"
                  role="alert"
                  id="signup-error"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="text-center text-sm">
                Have an account already?{" "}
                <Link
                  to="/login"
                  className=" hover:underline"
                  aria-label="Go to login page"
                >
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
        <footer className="absolute bottom-4 left-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} SHIELD. All rights reserved.
        </footer>
      </main>
    </>
  );
}
