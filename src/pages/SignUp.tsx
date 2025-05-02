import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import RoleSelect from "@/components/auth/RoleSelect";
import CountryCodeSelect, {
  popularCountryCodes,
} from "@/components/auth/CountryCodeSelect";
import PasswordInput from "@/components/auth/PasswordInput";
import { AlertCircle } from "lucide-react";

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

  const cannotSubmit =
    !role ||
    !fullName.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !password.trim() ||
    !confirmPassword.trim();

  const validateForm = () => {
    if (!role) return setError("Please select a role"), false;
    if (!fullName.trim()) return setError("Please enter your full name"), false;
    if (!validateEmail(email))
      return setError("Please enter a valid email address"), false;
    if (!phone.trim()) return setError("Please enter your phone number"), false;
    if (password.length < 8)
      return setError("Password must be at least 8 characters"), false;
    if (password !== confirmPassword)
      return setError("Passwords do not match"), false;
    return true;
  };

  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email.toLowerCase(),
    );

  const handleCountryCodeChange = (value: any) => {
    const selected = popularCountryCodes.find((code) => code.code === value);
    setCountryCode(selected || popularCountryCodes[0]);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cannotSubmit || !validateForm()) return;

    const fullPhone =
      countryCode.code === "other"
        ? `${customCountryCode}${phone}`
        : `${countryCode.code}${phone}`;

    try {
      setIsLoading(true);
      setError("");
      await signUp({
        email,
        password,
        full_name: fullName,
        role,
        phone: fullPhone,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <h1 className="mb-8 text-3xl font-bold text-accent-orange sm:text-4xl">
        REC LiiGA
      </h1>

      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-md">
        <form onSubmit={handleSignUp} className="p-6">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Register your Account
          </h2>

          <div className="space-y-4">
            <RoleSelect role={role} onRoleSelect={setRole} />

            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm text-gray-800">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="w-full rounded-md border border-gray-300 p-2 text-sm ring-offset-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full rounded-md border border-gray-300 p-2 text-sm ring-offset-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm text-gray-800">
                Phone Number
              </label>
              <div className="flex gap-2">
                <CountryCodeSelect
                  countryCode={countryCode}
                  customCountryCode={customCountryCode}
                  onCountryCodeChange={handleCountryCodeChange}
                  onCustomCountryCodeChange={(e) =>
                    setCustomCountryCode(e.target.value)
                  }
                />
                <input
                  id="phone"
                  type="tel"
                  placeholder="123-456-7890"
                  className="w-full flex-1 rounded-md border border-gray-300 p-2 text-sm ring-offset-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
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
              <div className="flex items-center gap-2 rounded-md bg-red-100 p-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoading || cannotSubmit}
              className="w-full rounded-md bg-accent-orange py-2 text-white ring-accent-orange/70 ring-offset-2 hover:bg-accent-orange/90 focus:ring disabled:opacity-60"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
            <p className="text-center text-sm text-[#707B81]">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-accent-orange hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
