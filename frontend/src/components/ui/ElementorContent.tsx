"use client";

import { useEffect, useRef } from "react";

interface ElementorContentProps {
  html: string;
  inlineCss?: string | null;
}

/**
 * Renders Elementor-generated HTML safely.
 * - Injects inline CSS from Elementor post styles
 * - Re-executes inline scripts after mount so Elementor widgets work
 */
export default function ElementorContent({ html, inlineCss }: ElementorContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Re-execute inline scripts from Elementor content
    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return (
    <>
      {inlineCss && (
        <style dangerouslySetInnerHTML={{ __html: inlineCss }} />
      )}
      <div
        ref={containerRef}
        className="elementor-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
