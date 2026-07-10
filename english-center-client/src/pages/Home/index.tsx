import {
  HeroSection,
  HomeCategoryCoursesSection,
  HomeFinalCtaSection,
  HomeLearningJourneySection,
  HomeMethodSection,
  HomePracticeSection,
  HomePlacementTestSection,
  HomeResultsSection,
  HomeStoriesSection,
  HomeTeachersSection,
  HomeTrustMetricsSection,
} from "@/components/Main/HomePage";
import useHomeSectionAnimations from "@/components/Main/HomePage/useHomeSectionAnimations";
import { useRef } from "react";

export default function HomePage() {
  const heroMockupRef = useRef<HTMLDivElement | null>(null);
  useHomeSectionAnimations();

  return (
    <>
      <HeroSection heroMockupRef={heroMockupRef} />
      <HomeTrustMetricsSection />
      <HomeLearningJourneySection />
      <HomeCategoryCoursesSection />
      <HomeMethodSection />
      <HomeTeachersSection />
      <HomePracticeSection />
      <HomeResultsSection />
      <HomeStoriesSection />
      <HomePlacementTestSection />
      <HomeFinalCtaSection />
    </>
  );
}
