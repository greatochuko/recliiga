import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { sendSupportEmail } from "@/api/email";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function HelpAndSupport() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: user.full_name.split(" ")[0],
    lastName: user.full_name.split(" ")[1],
    email: user.email,
    message: "",
  });

  const cannotSubmit = Object.values(formData).some((value) => !value.trim());

  function updateFormData(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { data, error } = await sendSupportEmail(formData);
    if (data) {
      toast.success(
        "Your message has been sent successfully. We'll get back to you shortly!",
        { style: { color: "#16a34a" } },
      );
      updateFormData("message", "");
    } else {
      setError(error);
    }

    setLoading(false);
  }

  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Help & Support</h1>
      <div className="">
        <div className="container mx-auto px-4 py-8">
          <p className="mb-4 text-gray-600">
            Have questions about REC LiiGA or need assistance? We're here to
            help! Fill out the form below, and our team will get back to you as
            soon as possible.
          </p>
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl font-semibold text-gray-800">
                  Get in Touch
                </CardTitle>
                <CardDescription className="text-center text-sm text-[#707B81]">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="first-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name
                      </Label>
                      <Input
                        id="first-name"
                        value={formData.firstName}
                        disabled
                        placeholder="John"
                        required
                        className="border-gray-300 disabled:bg-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="last-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="last-name"
                        value={formData.lastName}
                        disabled
                        placeholder="Doe"
                        required
                        className="border-gray-300 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      placeholder="johndoe@example.com"
                      className="border-gray-300 disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700"
                    >
                      Message
                    </Label>
                    <textarea
                      id="message"
                      value={formData.message}
                      disabled={loading}
                      onChange={(e) =>
                        updateFormData("message", e.target.value)
                      }
                      rows={3}
                      placeholder="How can we help you?"
                      required
                      className="w-full resize-none rounded-md border border-gray-300 p-3 text-sm duration-200 placeholder:text-neutral-400 focus-visible:border-accent-orange"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={cannotSubmit || loading}
                    className="w-full bg-accent-orange text-white hover:bg-accent-orange/90"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>

                {error && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <AlertCircleIcon className="mr-2 h-4 w-4" />
                    <p>{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
