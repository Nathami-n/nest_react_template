import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { TechStack } from "./components/tech-stack";
import { CTA } from "./components/cta";
import { Footer } from "./components/footer";

export function LandingPage({ userLoggedIn }: { userLoggedIn?: boolean }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userLoggedIn={userLoggedIn} />
      <main className="flex-1">
        <Hero />
        <Features />
        <TechStack />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
