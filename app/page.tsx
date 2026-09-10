import TransmissionExample from "@/components/TransmissionExample";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      {/* Handmade background, fixed behind all content */}
      <div className="fixed inset-0 -z-10 h-screen w-screen">
        <TransmissionExample />
      </div>

      <SiteNav />

      <div className="relative z-10">
        <Hero />
        <Services />
        <Process />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
