"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const STORAGE_KEY = "julien-nil-dispatch-checklist";

function readSavedState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, boolean>;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return {};
}

function getTaskLabel(checkbox: HTMLInputElement): string {
  const paragraph = checkbox.closest("p");
  if (paragraph) {
    const clone = paragraph.cloneNode(true) as HTMLElement;
    clone.querySelector("input")?.remove();
    return clone.textContent?.replace(/\s+/g, " ").trim() ?? "";
  }

  const item = checkbox.closest("li.task-list-item");
  if (!item) return "";

  const parts: string[] = [];
  for (const node of item.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) parts.push(text);
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const el = node as HTMLElement;
    if (el.tagName === "INPUT" || el.tagName === "BLOCKQUOTE") continue;
    const text = el.textContent?.replace(/\s+/g, " ").trim();
    if (text) parts.push(text);
    break;
  }
  return parts.join(" ").trim();
}

function itemId(index: number, label: string): string {
  return label ? `${index}:${label}` : String(index);
}

function getTaskLine(checkbox: HTMLInputElement): HTMLElement | null {
  const paragraph = checkbox.closest("p");
  if (paragraph?.contains(checkbox)) return paragraph;
  return checkbox.closest("li.task-list-item");
}

function setItemChecked(checkbox: HTMLInputElement, checked: boolean): void {
  const item = checkbox.closest("li.task-list-item");
  if (!item) return;
  item.toggleAttribute("data-checked", checked);
}

function markSubItems(checkbox: HTMLInputElement): void {
  const item = checkbox.closest("li.task-list-item");
  if (!item) return;

  for (const child of item.children) {
    if (
      child instanceof HTMLParagraphElement &&
      !child.querySelector('input[type="checkbox"]')
    ) {
      child.classList.add("nil-checklist-sub-item");
      prepareSubItemStrike(child);
    }
  }
}

/** Sub-items are `p > em` (block). Animate strike on `em`, not a wrapper span. */
function prepareSubItemStrike(paragraph: HTMLParagraphElement): void {
  if (paragraph.dataset.strikeWrapped === "true") return;

  const brokenWrap = paragraph.querySelector("span.nil-strike-animate");
  const em = paragraph.querySelector("em");
  if (brokenWrap && em && brokenWrap.contains(em)) {
    paragraph.replaceChild(em, brokenWrap);
  }

  if (em) {
    em.classList.add("nil-strike-animate");
    paragraph.dataset.strikeWrapped = "true";
  } else {
    ensureStrikeWrap(paragraph);
  }
}

/** Wrap task copy so strike can animate left-to-right on each line of text. */
function ensureStrikeWrap(host: HTMLElement): void {
  if (host.dataset.strikeWrapped === "true") return;

  if (host instanceof HTMLParagraphElement) {
    if (host.classList.contains("nil-checklist-sub-item")) {
      prepareSubItemStrike(host);
      return;
    }

    const input = host.querySelector('input[type="checkbox"]');
    const span = document.createElement("span");
    span.className = "nil-strike-animate";
    const movable = [...host.childNodes].filter((node) => node !== input);
    if (movable.length === 0) return;
    for (const node of movable) span.appendChild(node);
    host.appendChild(span);
    if (input) host.insertBefore(input, span);
    host.dataset.strikeWrapped = "true";
    return;
  }

  if (
    host.classList.contains("task-list-item") &&
    host.classList.contains("nil-checklist-task-line")
  ) {
    const span = document.createElement("span");
    span.className = "nil-strike-animate";
    const movable: ChildNode[] = [];
    for (const child of host.childNodes) {
      if (child instanceof HTMLInputElement) continue;
      if (child instanceof HTMLElement && child.tagName === "BLOCKQUOTE") continue;
      movable.push(child);
    }
    if (movable.length === 0) return;
    for (const node of movable) span.appendChild(node);
    const blockquote = host.querySelector("blockquote");
    if (blockquote) host.insertBefore(span, blockquote);
    else host.appendChild(span);
    host.dataset.strikeWrapped = "true";
  }
}

type NilChecklistArticleProps = {
  className?: string;
  children: ReactNode;
};

export function NilChecklistArticle({ className, children }: NilChecklistArticleProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.classList.add("nil-checklist-skip-strike-animation");

    const saved = readSavedState();
    const checkboxes = Array.from(
      root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
    );

    for (const [index, checkbox] of checkboxes.entries()) {
      const label = getTaskLabel(checkbox);
      checkbox.dataset.nilItemId = itemId(index, label);
    }

    const persist = () => {
      const state: Record<string, boolean> = {};
      for (const checkbox of checkboxes) {
        const id = checkbox.dataset.nilItemId;
        if (id) state[id] = checkbox.checked;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* quota / private mode */
      }
    };

    const listeners: Array<{
      checkbox: HTMLInputElement;
      onChange: () => void;
      onCheckboxClick: (e: MouseEvent) => void;
      onRowClick: (e: MouseEvent) => void;
      row: HTMLElement | null;
    }> = [];

    for (const checkbox of checkboxes) {
      const id = checkbox.dataset.nilItemId ?? "";
      const label = getTaskLabel(checkbox);
      checkbox.disabled = false;
      checkbox.removeAttribute("disabled");
      checkbox.removeAttribute("readonly");
      if (label) {
        checkbox.setAttribute("aria-label", label);
      }

      const taskLine = getTaskLine(checkbox);
      if (taskLine) {
        taskLine.classList.add("nil-checklist-task-line");
        ensureStrikeWrap(taskLine);
      }
      markSubItems(checkbox);

      if (saved[id]) {
        checkbox.checked = true;
        setItemChecked(checkbox, true);
      }

      const syncChecked = () => {
        setItemChecked(checkbox, checkbox.checked);
        persist();
      };

      const onChange = () => syncChecked();
      checkbox.addEventListener("change", onChange);

      const onCheckboxClick = (e: MouseEvent) => e.stopPropagation();

      const row =
        checkbox.closest("p") ??
        checkbox.closest("li.task-list-item");

      const onRowClick = (e: MouseEvent) => {
        const target = e.target;
        if (!(target instanceof Node)) return;
        if (target === checkbox) return;
        if (target instanceof HTMLElement && target.closest("blockquote")) return;
        checkbox.checked = !checkbox.checked;
        syncChecked();
      };

      if (row) {
        row.classList.add("nil-checklist-row");
        row.addEventListener("click", onRowClick);
      }
      checkbox.addEventListener("click", onCheckboxClick);

      listeners.push({ checkbox, onChange, onCheckboxClick, onRowClick, row });
    }

    requestAnimationFrame(() => {
      root.classList.remove("nil-checklist-skip-strike-animation");
    });

    return () => {
      root.classList.remove("nil-checklist-skip-strike-animation");
      for (const { checkbox, onChange, onCheckboxClick, onRowClick, row } of listeners) {
        checkbox.removeEventListener("change", onChange);
        checkbox.removeEventListener("click", onCheckboxClick);
        row?.removeEventListener("click", onRowClick);
        row?.classList.remove("nil-checklist-row");
      }
      root
        .querySelectorAll(".nil-checklist-task-line")
        .forEach((el) => el.classList.remove("nil-checklist-task-line"));
      root
        .querySelectorAll(".nil-checklist-sub-item")
        .forEach((el) => el.classList.remove("nil-checklist-sub-item"));
    };
  }, []);

  return (
    <article ref={ref} className={className}>
      {children}
    </article>
  );
}
