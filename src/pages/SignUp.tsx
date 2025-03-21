import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import RoleSelect from "@/components/auth/RoleSelect";
import CountryCodeSelect, {
  popularCountryCodes,
} from "@/components/auth/CountryCodeSelect";
import PasswordInput from "@/components/auth/PasswordInput";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [role, setRole] = useState<"player" | "organizer" | null>(null);
  const [countryCode, setCountryCode] = useState(popularCountryCodes[1]);
  const [customCountryCode, setCustomCountryCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!role) {
      setError("Please select a role");
      return false;
    }
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleCountryCodeChange = (value: any) => {
    const selectedCode = popularCountryCodes.find(
      (code) => code.code === value
    );
    if (selectedCode) {
      setCountryCode(selectedCode);
    } else {
      setCountryCode(popularCountryCodes[0]);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const finalPhone =
      countryCode.code === "other"
        ? `${customCountryCode}${phone}`
        : `${countryCode.code}${phone}`;

    try {
      setIsLoading(true);
      await signUp({
        email,
        password,
        full_name: fullName,
        role: role,
        phone: finalPhone,
      });

      // After successful signup, we'll show them the success message and automatically redirect them to sign in.
      // Once they sign in, they'll be redirected to the appropriate registration flow based on their role
      // through the private route protection in App.tsx
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-[#FF7A00] mb-8">REC LiiGA</h1>

      <Card className="w-full max-w-md">
        <form onSubmit={handleSignUp}>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Register your Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RoleSelect role={role} onRoleSelect={setRole} />

            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm text-gray-800">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="w-full"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-800">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm text-gray-800">
                Phone Number
              </label>
              <div className="flex items-center space-x-2">
                <CountryCodeSelect
                  countryCode={countryCode}
                  customCountryCode={customCountryCode}
                  onCountryCodeChange={handleCountryCodeChange}
                  onCustomCountryCodeChange={(e) =>
                    setCustomCountryCode(e.target.value)
                  }
                />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123-456-7890"
                  className="w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <Alert
                variant="destructive"
                className="border-0 bg-transparent p-0"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
            <p className="text-sm text-[#707B81] text-center">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-[#FF7A00] hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
