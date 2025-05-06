import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code");

  const cannotSubmit =
    !email.trim().length || !password.trim().length || isLoading;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cannotSubmit) return;
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white p-4">
      <h1 className="mb-8 cursor-pointer text-3xl font-bold text-accent-orange transition-colors hover:text-[#FF9A30] sm:text-4xl">
        REC LiiGA
      </h1>

      <Card className="w-full max-w-lg">
        <form onSubmit={handleSignIn}>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold text-gray-800">
              Sign in now
            </CardTitle>
            <p className="text-center text-sm text-[#707B81]">
              Please sign in to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <Alert
                variant="destructive"
                className="border-0 bg-transparent p-0"
              >
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </div>
              </Alert>
            )}
            {/* <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-[#707B81] hover:underline"
              >
                Forget Password?
              </Link>
            </div> */}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-accent-orange text-white hover:bg-accent-orange/90"
              disabled={cannotSubmit}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-[#707B81]">
              Don't have an account?{" "}
              <Link
                to={inviteCode ? `/sign-up?code=${inviteCode}` : "/sign-up"}
                className="text-accent-orange hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
