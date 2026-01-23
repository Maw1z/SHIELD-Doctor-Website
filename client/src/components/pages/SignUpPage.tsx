import { useState, type ChangeEvent, type FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

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
import GradientWrapper from "../GradientWrapper";

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
    if (!formData.specialization) {
      setError("Please select a specialization");
      return;
    }

    // TODO: Add details to db
  };

  return (
    <>
      <GradientWrapper />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Doctor Sign Up</CardTitle>
            <CardDescription>
              Register your profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Specialization Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger className="w-full">
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
                  international
                  defaultCountry="AE"
                  value={phone}
                  onChange={setPhone}
                  className="flex h-10 w-full rounded-3xl border border-input bg-[#F7F7F7] px-3 py-2 text-sm"
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
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="text-center text-sm">
                Have an account already?{" "}
                <Link to="/login" className=" hover:underline">
                  Login
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
