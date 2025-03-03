
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";

export default function Help() {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We'll get back to you soon!",
      duration: 5000,
    });
    
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50 flex items-center">
            <SidebarTrigger className="bg-white shadow-md" />
            <h1 className="ml-4 text-2xl font-bold">Help & Support</h1>
          </div>
          <div className="pt-16">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold mb-6 text-[#FF7A00]">Help & Support</h1>
              <p className="text-lg mb-6 text-gray-600">
                Have questions about REC LiiGA or need assistance? We're here to help! Fill out the form below, and our team will get back to you as soon as possible.
              </p>
              <div className="max-w-md mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center text-gray-800">Get in Touch</CardTitle>
                    <CardDescription className="text-center text-[#707B81] text-sm">Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name" className="text-sm font-medium text-gray-700">First Name</Label>
                          <Input id="first-name" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name" className="text-sm font-medium text-gray-700">Last Name</Label>
                          <Input id="last-name" placeholder="Doe" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input id="email" type="email" placeholder="johndoe@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                        <Textarea id="message" placeholder="How can we help you?" required />
                      </div>
                      <Button type="submit" className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white">Send Message</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
