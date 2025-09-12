import { FAQ } from "@/components/homepage/FAQ";
import { Features } from "@/components/homepage/Features";
import { Footer } from "@/components/homepage/Footer";
import { Header } from "@/components/homepage/Header";
import { Hero } from "@/components/homepage/Hero";
import { Pricing } from "@/components/homepage/Pricing";
import { Testimonials } from "@/components/homepage/Testimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
