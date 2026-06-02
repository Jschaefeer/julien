"use client";

import { useEffect, useState } from "react";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DARK_QUERY);
    const update = () => setPrefersDark(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return prefersDark;
}
