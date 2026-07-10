
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatbotPopup from "@/components/Comon/ChatbotPopup";
import { useState, useEffect, useRef } from "react";
export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const heroMockupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrame: number | null = null;

    const handleScroll = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 12);

        if (heroMockupRef.current && window.scrollY < 800) {
          heroMockupRef.current.style.transform = `translateY(${window.scrollY * 0.04}px)`;
        }

        animationFrame = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll(".js-reveal");
    const progressElements = document.querySelectorAll(".js-progress");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("translate-y-4", "opacity-0");
          entry.target.classList.add("translate-y-0", "opacity-100");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    const progressObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const targetWidth = entry.target.getAttribute("data-w");
          if (targetWidth && entry.target instanceof HTMLElement) {
            entry.target.style.width = targetWidth;
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    progressElements.forEach((element) => progressObserver.observe(element));

    return () => {
      revealObserver.disconnect();
      progressObserver.disconnect();
    };
  }, []);
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-800">
      <Header
        isScrolled={isScrolled}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((value) => !value)}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotPopup />
    </div>
  );
}
