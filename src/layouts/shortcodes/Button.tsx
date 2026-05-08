import { withSiteBasePath } from "@/lib/utils/languageParser";
import React from "react";

const Button = ({
  label,
  link,
  style,
  rel,
}: {
  label: string;
  link: string;
  style?: string;
  rel?: string;
}) => {
  const href = withSiteBasePath(link);

  return (
    <a
      href={href}
      target={link.startsWith("http") ? "_blank" : "_self"}
      rel={`noopener noreferrer ${
        rel ? (rel === "follow" ? "" : rel) : "nofollow"
      }`}
      className={`btn mb-4 me-4 hover:text-white dark:hover:text-black hover:no-underline ${
        style === "outline" ? "btn-outline-primary" : "btn-primary"
      }`}
    >
      {label}
    </a>
  );
};

export default Button;
