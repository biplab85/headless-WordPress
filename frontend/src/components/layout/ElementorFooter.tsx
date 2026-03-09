"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ElementorFooterProps {
  html: string;
  inlineCss?: string | null;
}

export default function ElementorFooter({ html, inlineCss }: ElementorFooterProps) {
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

    return () => {
      containerRef.current?.removeEventListener("click", handleClick);
    };
  }, [html, router]);

  return (
    <>
      {inlineCss && (
        <style dangerouslySetInnerHTML={{ __html: inlineCss }} />
      )}
      <div
        ref={containerRef}
        className="elementor-content elementor-theme-footer"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
