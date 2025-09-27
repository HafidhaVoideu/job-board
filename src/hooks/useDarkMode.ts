import { useEffect, useState } from "react";
//todo look ths up. he has a video about it

export function useIsDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const controller = new AbortController();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      (e) => {
        setIsDarkMode(e.matches);
      },
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, []);

  return isDarkMode;
}
