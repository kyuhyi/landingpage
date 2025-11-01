import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import SocialProofSection from "@/components/SocialProofSection";
import NewsSection from "@/components/NewsSection";
import CurriculumSection from "@/components/CurriculumSection";
import InstructorSection from "@/components/InstructorSection";
import UrgencySection from "@/components/UrgencySection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div id="hero">
          <HeroSection />
        </div>
        <ProblemSection />
        <SolutionSection />
        <SocialProofSection />
        <NewsSection />
        <div id="curriculum-section">
          <CurriculumSection />
        </div>
        <div id="instructor-section">
          <InstructorSection />
        </div>
        <UrgencySection />
        <CTASection />
        <div id="faq-section">
          <FAQSection />
        </div>
        <Footer />
      </main>
      <Chatbot />
    </>
  );
}
