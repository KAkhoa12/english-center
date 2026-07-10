import { useEffect } from "react";

export function useHomeSectionAnimations() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const revealElements = document.querySelectorAll<HTMLElement>(".js-reveal");
    const progressElements = document.querySelectorAll<HTMLElement>(".js-progress");

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

          const target = entry.target as HTMLElement;
          const targetWidth = target.getAttribute("data-w");
          if (targetWidth) target.style.width = targetWidth;
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
}

export default useHomeSectionAnimations;
