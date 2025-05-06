import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function HelpAndSupport() {
  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Help & Support</h1>
      <div className="">
        <div className="container mx-auto px-4 py-8">
          <p className="mb-6 text-lg text-gray-600">
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
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="first-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name
                      </Label>
                      <Input id="first-name" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="last-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </Label>
                      <Input id="last-name" placeholder="Doe" required />
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
                      placeholder="johndoe@example.com"
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
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-accent-orange hover:bg-accent-orange/90 w-full text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
