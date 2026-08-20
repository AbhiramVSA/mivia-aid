"use client";

import { getSlides } from "@/components/Slides";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function clamp(n: number, max: number) {
  return Math.max(0, Math.min(max, n));
}

export function Deck() {
  const slides = useMemo(() => getSlides(), []);
  const last = slides.length - 1;
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => clamp(typeof next === "number" ? next : cur, last));
    },
    [last],
  );

  const move = useCallback(
    (delta: number) => {
      setIndex((cur) => clamp(cur + delta, last));
    },
    [last],
  );

  useEffect(() => {
    const raw = Number(window.location.hash.replace("#", ""));
    if (Number.isFinite(raw) && raw >= 1) setIndex(clamp(raw - 1, last));
  }, [last]);

  useEffect(() => {
    const url = `#${index + 1}`;
    if (window.location.hash !== url) history.replaceState(null, "", url);
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const next = ["ArrowRight", "ArrowDown", "PageDown", " ", "Enter", "l", "n"];
      const prev = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace", "h", "p"];
      if (next.includes(event.key)) {
        event.preventDefault();
        move(1);
      } else if (prev.includes(event.key)) {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        go(0);
      } else if (event.key === "End") {
        event.preventDefault();
        go(last);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [go, last, move]);

  return (
    <div
      className="deck"
      onClick={(event) => {
        const x = event.clientX / window.innerWidth;
        if (x < 0.12) move(-1);
        else if (x > 0.88) move(1);
      }}
      onTouchStart={(event) => {
        startX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (startX.current == null) return;
        const dx = event.changedTouches[0].clientX - startX.current;
        if (dx > 50) move(-1);
        if (dx < -50) move(1);
        startX.current = null;
      }}
    >
      <div className="track" style={{ transform: `translateX(-${index * 100}vw)` }}>
        {slides.map((slide) => (
          <section className="slide" key={slide.id} aria-label={slide.title}>
            {slide.node}
          </section>
        ))}
      </div>

      <div className="chrome" onClick={(event) => event.stopPropagation()}>
        <div className="top">
          <span>Adabala · Chakkaravarthy · MIVIA-AID</span>
          <span>{slides[index]?.title}</span>
        </div>
        <div className="progress">
          <i style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
        </div>
        <div className="bottom">
          <span className="hint">← → &nbsp; space &nbsp; click edges</span>
          <div className="nav-btns">
            <button className="btn" type="button" disabled={index === 0} onClick={() => move(-1)}>
              Prev
            </button>
            <button className="btn" type="button" disabled={index === last} onClick={() => move(1)}>
              Next
            </button>
          </div>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
