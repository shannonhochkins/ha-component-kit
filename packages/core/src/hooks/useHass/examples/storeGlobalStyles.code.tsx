import { useHass } from "@hakit/core";
import { useEffect } from "react";

// Example: Override styles for a component at runtime.
export function StoreGlobalStylesExample() {
  const setGlobalComponentStyles = useHass((s) => s.setGlobalComponentStyles);
  useEffect(() => {
    setGlobalComponentStyles({
      cardBase: {
        borderRadius: 12,
        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
      },
    });
  }, [setGlobalComponentStyles]);
  return <p>Global component styles applied.</p>;
}
