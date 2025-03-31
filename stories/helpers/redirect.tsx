import { redirectToStory } from "../../.storybook/redirect";
import { type ReactNode } from "react";

interface RedirectProps {
  to: string;
  children: ReactNode;
}

export function Redirect({
  to,
  children
}: RedirectProps) {
  return <a style={{
    cursor: "pointer",
    textDecoration: "underline",
    color: "blue",
    fontWeight: "bold",
  }} onClick={e => {
    e.preventDefault();
    redirectToStory(to);
  }}>{children}</a>
}