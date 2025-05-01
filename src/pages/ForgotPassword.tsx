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
import { AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white p-8">
      <h1 className="mb-8 text-4xl font-bold text-accent-orange">REC LiiGA</h1>

      <Card className="w-full max-w-md">
        {resetSent ? (
          <CardContent className="pt-6">
            <CardTitle className="mb-4 text-center text-2xl font-semibold text-gray-800">
              Email Sent
            </CardTitle>
            <Alert className="border-0 bg-transparent p-0">
              <div className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 h-5 w-5 text-accent-orange" />
                <AlertDescription className="text-[#707B81]">
                  We've sent an email to{" "}
                  <span className="font-semibold text-gray-800">{email}</span>{" "}
                  with instructions to reset your password. Please check your
                  inbox and follow the link provided.
                </AlertDescription>
              </div>
            </Alert>
            <p className="mt-6 text-center text-sm text-[#707B81]">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setResetSent(false)}
                className="font-semibold text-accent-orange hover:underline"
              >
                try again
              </button>
              .
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-gray-800">
                Reset Password
              </CardTitle>
              <p className="text-center text-sm text-[#707B81]">
                Enter your email to reset your password
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  disabled={isLoading}
                />
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-accent-orange text-white hover:bg-accent-orange/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>
              <p className="text-center text-sm text-[#707B81]">
                Remember your password?{" "}
                <Link
                  to="/sign-in"
                  className="text-accent-orange hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
