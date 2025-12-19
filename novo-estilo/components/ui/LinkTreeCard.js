import React from "react";
import * as Icons from "react-icons/fa";

export default function LinkTreeCard({
  title,
  description = "",
  url = "#",
  icon = "FaLink",
  color = "bg-neutral-100",
  featured = false,
}) {
  const Icon = Icons[icon] || Icons.FaLink;
  return (
    <a
      href={url}
      className={`block rounded-md ${color} ${
        featured ? "ring-2 ring-blue-500" : ""
      } p-4 hover:opacity-95`}
      aria-label={title}
    >
      <div className="flex items-center gap-3">
        <Icon />
        <div>
          <div className="font-medium">{title}</div>
          {description ? (
            <div className="text-sm opacity-80">{description}</div>
          ) : null}
        </div>
      </div>
    </a>
  );
}
