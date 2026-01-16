import React from "react";
import "@/App.css";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { WhySection } from "@/components/WhySection";
import { CoursesSection } from "@/components/CoursesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App smooth-scroll">
      <Toaster position="top-center" richColors />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <WhySection />
        <CoursesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
