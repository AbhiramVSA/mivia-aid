"use client";

import { INFERENCE_STEPS } from "@/lib/paper";
import { useState } from "react";

export function Algorithm() {
  const [step, setStep] = useState(0);

  return (
    <div className="algo">
      <div className="algo-head">
        <span>Algorithm 1 · Full-video inference and onset decoding</span>
        <span>
          {String(step + 1).padStart(2, "0")} / {String(INFERENCE_STEPS.length).padStart(2, "0")}
        </span>
      </div>
      <ol>
        {INFERENCE_STEPS.map((text, index) => (
          <li
            key={text}
            className={index === step ? "active" : undefined}
            onClick={() => setStep(index)}
          >
            <span>{text}</span>
          </li>
        ))}
      </ol>
      <div className="algo-nav">
        <button className="btn" type="button" onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Previous
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => setStep((s) => Math.min(INFERENCE_STEPS.length - 1, s + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
