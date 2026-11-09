import { Cierre } from "@/components/sites/socio/cierre";
import { Faq } from "@/components/sites/socio/faq";
import { Footer } from "@/components/sites/socio/footer";
import { Hero } from "@/components/sites/socio/hero";
import { MascotSection } from "@/components/sites/socio/mascot-section";
import { Navbar } from "@/components/sites/socio/navbar";
import { Pricing } from "@/components/sites/socio/pricing";
import { ProductScene } from "@/components/sites/socio/product-scene";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductScene />
        <MascotSection />
        <Pricing />
        <Faq />
        <Cierre />
      </main>
      <Footer />
    </>
  );
}
