import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Highlights from "@/components/Highlights";
import Description from "@/components/Description";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <div className="pt-16 md:pt-20 pb-20 md:pb-0">
        <HeroSection />
        <Highlights />
        <Description />
        <Footer />
      </div>
    </main>
  );
}

