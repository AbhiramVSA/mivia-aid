"use client";

import { NAV } from "@/lib/paper";
import { useEffect, useState } from "react";

export function SiteNav() {
  const [active, setActive] = useState<string>(NAV[0].id);

  useEffect(() => {
    const nodes = NAV.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.15, 0.4, 0.7] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sidenav" aria-label="Paper sections">
      <ol>
        {NAV.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={active === item.id ? "active" : undefined}>
              <span>{item.num}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
