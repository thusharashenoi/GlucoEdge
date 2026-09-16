import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Product from "./components/Product";
import Architecture from "./components/Architecture";
import Algorithm from "./components/Algorithm";
import POC from "./components/POC";
import Footer from "./components/Footer";
import SectionNav from "./components/SectionNav";

export default function App() {
  return (
    <div className="relative min-h-screen bg-ink text-white">
      <div className="grain" />
      <Navbar />
      <main>
        <Hero />
        <Product />
        <Architecture />
        <Algorithm />
        <POC />
      </main>
      <Footer />
      <SectionNav />
    </div>
  );
}
