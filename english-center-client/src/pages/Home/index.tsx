import {
  AboutSection,
  ContactSection,
  CoursesSection,
  CtaSection,
  HeroSection,
  ProcessSection,
  TeachersSection,
  TestimonialsSection,
} from "@/components/Main/HomePage";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CoursesSection />
      <TeachersSection />
      <ProcessSection />
      <TestimonialsSection />
      <CtaSection />
      <ContactSection />
    </>
  );
}
