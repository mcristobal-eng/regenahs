import { AgentsSection } from "@/components/sites/core/agents-section";
import { DotWordmark } from "@/components/sites/core/dot-wordmark";
import { Faq } from "@/components/sites/core/faq";
import { Footer } from "@/components/sites/core/footer";
import { Hero } from "@/components/sites/core/hero";
import { Navbar } from "@/components/sites/core/navbar";
import { Pricing } from "@/components/sites/core/pricing";
import { ProductCards } from "@/components/sites/core/product-cards";
import { ProductIntro } from "@/components/sites/core/product-intro";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductIntro />
        <ProductCards />
        <AgentsSection />
        <Pricing />
        <Faq />
      </main>
      <Footer />
      <DotWordmark />
    </>
  );
}
