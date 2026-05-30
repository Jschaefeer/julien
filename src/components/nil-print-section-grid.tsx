"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

type NilPrintSectionGridProps = {
  children: ReactNode;
};

/** Groups each MDX h2 block into a cell of one shared 2×2 print grid. */
export function NilPrintSectionGrid({ children }: NilPrintSectionGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const article = root.querySelector("article");
    if (!article || article.querySelector(".nil-print-section")) return;

    const h2s = Array.from(article.querySelectorAll(":scope > h2"));

    for (const h2 of h2s) {
      const section = document.createElement("div");
      section.className = "nil-print-section";
      article.insertBefore(section, h2);
      section.appendChild(h2);

      let node = section.nextSibling;
      while (node && !(node instanceof HTMLHeadingElement && node.tagName === "H2")) {
        const next = node.nextSibling;
        section.appendChild(node);
        node = next;
      }
    }

    for (const checkbox of root.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    )) {
      checkbox.checked = false;
      checkbox.closest("li.task-list-item")?.removeAttribute("data-checked");
    }
  }, []);

  return (
    <div ref={ref} className="nil-print-section-grid">
      {children}
    </div>
  );
}
