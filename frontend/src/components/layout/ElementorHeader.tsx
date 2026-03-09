"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ElementorHeaderProps {
  html: string;
  inlineCss?: string | null;
  frontendJs?: string | null;
  proJs?: string | null;
}

export default function ElementorHeader({ html, inlineCss, frontendJs, proJs }: ElementorHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    // Intercept internal links for SPA navigation
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Internal link (starts with / and not //)
      if (href.startsWith("/") && !href.startsWith("//")) {
        e.preventDefault();
        router.push(href);
      }
    };

    containerRef.current.addEventListener("click", handleClick);

    // Re-execute inline scripts
    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // Load Elementor JS for interactive widgets (nav toggle, sticky, etc.)
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.body.appendChild(script);
      });
    };

    const initElementor = async () => {
      if (frontendJs) await loadScript(frontendJs);
      if (proJs) await loadScript(proJs);

      // Initialize Elementor frontend if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      if (win.elementorFrontend?.init) {
        win.elementorFrontend.init();
      }
    };

    initElementor();

    // Mobile menu toggle handler
    const toggleBtn = containerRef.current.querySelector(".elementor-menu-toggle");
    const dropdownNav = containerRef.current.querySelector(".elementor-nav-menu--dropdown");

    if (toggleBtn && dropdownNav) {
      const handleToggle = () => {
        const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", String(!expanded));
        dropdownNav.setAttribute("aria-hidden", String(expanded));

        if (!expanded) {
          toggleBtn.classList.add("elementor-active");
          dropdownNav.classList.add("elementor-active");
          (dropdownNav as HTMLElement).style.display = "block";
          // Enable tabindex on dropdown links
          dropdownNav.querySelectorAll("a").forEach((a) => a.removeAttribute("tabindex"));
        } else {
          toggleBtn.classList.remove("elementor-active");
          dropdownNav.classList.remove("elementor-active");
          (dropdownNav as HTMLElement).style.display = "none";
          dropdownNav.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
        }
      };

      toggleBtn.addEventListener("click", handleToggle);

      // Close mobile menu when a link is clicked
      dropdownNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          toggleBtn.setAttribute("aria-expanded", "false");
          dropdownNav.setAttribute("aria-hidden", "true");
          toggleBtn.classList.remove("elementor-active");
          dropdownNav.classList.remove("elementor-active");
          (dropdownNav as HTMLElement).style.display = "none";
        });
      });

      return () => {
        toggleBtn.removeEventListener("click", handleToggle);
        containerRef.current?.removeEventListener("click", handleClick);
      };
    }

    return () => {
      containerRef.current?.removeEventListener("click", handleClick);
    };
  }, [html, router, frontendJs, proJs]);

  return (
    <>
      {inlineCss && (
        <style dangerouslySetInnerHTML={{ __html: inlineCss }} />
      )}
      <div
        ref={containerRef}
        className="elementor-content elementor-theme-header"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
