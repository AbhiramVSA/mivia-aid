export function OnsetCorridor() {
  const g = 180;
  const left = g - 18;
  const right = g + 540;
  return (
    <svg viewBox="0 0 920 168" role="img" aria-labelledby="corridor-title">
      <title id="corridor-title">Evaluation acceptance window around ground-truth onset</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        INTEGER-SECOND LABELS · ACCEPTANCE INTERVAL
      </text>
      <line x1="20" y1="92" x2="900" y2="92" stroke="#1a1610" strokeWidth="1" />
      {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840].map((x) => (
        <g key={x}>
          <line x1={20 + x} y1="86" x2={20 + x} y2="98" stroke="#1a1610" strokeWidth="1" />
        </g>
      ))}
      <rect x={left} y="54" width={right - left} height="38" fill="#c24a18" opacity="0.18" />
      <rect x={left} y="54" width="2" height="38" fill="#c24a18" />
      <rect x={right - 2} y="54" width="2" height="38" fill="#c24a18" />
      <circle cx={g} cy="92" r="6" fill="#c24a18" />
      <text x={g} y="42" textAnchor="middle" fill="#c24a18" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        g  annotated onset
      </text>
      <text x={left} y="140" fill="#2a5c4a" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        g − 1 s
      </text>
      <text x={right - 70} y="140" fill="#2a5c4a" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        g + 30 s
      </text>
      <text x="20" y="140" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        0 s
      </text>
    </svg>
  );
}

export function DatasetChart() {
  return (
    <svg viewBox="0 0 920 280" role="img" aria-labelledby="dataset-title">
      <title id="dataset-title">Train and validation split composition</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        VIDEO-LEVEL CLASS BALANCE
      </text>
      <text x="0" y="58" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="22">
        Train  1246
      </text>
      <rect x="0" y="72" width="740" height="28" fill="#c24a18" />
      <rect x="740" y="72" width="180" height="28" fill="#2e3d5c" />
      <text x="12" y="91" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="12">
        959 positive
      </text>
      <text x="752" y="91" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        287 neg.
      </text>
      <text x="0" y="148" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="22">
        Val  310
      </text>
      <rect x="0" y="162" width="460" height="28" fill="#c24a18" />
      <rect x="460" y="162" width="460" height="28" fill="#2e3d5c" />
      <text x="12" y="181" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="12">
        155 positive
      </text>
      <text x="472" y="181" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="12">
        155 negative
      </text>
      <text x="0" y="232" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="12">
        Train mean duration 11.79 s · median onset 2 s
      </text>
      <text x="0" y="254" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="12">
        Val mean duration 10.39 s · median onset 1 s
      </text>
    </svg>
  );
}

export function ClipTimeline() {
  const clips = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg viewBox="0 0 920 210" role="img" aria-labelledby="clip-title">
      <title id="clip-title">Causal 16-frame clips sampled at 8 FPS with 0.5 second spacing</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        SHARED FRONT END · 8 FPS · 16 FRAMES · 0.5 s STEP
      </text>
      <line x1="24" y1="150" x2="896" y2="150" stroke="#1a1610" strokeWidth="1" />
      {clips.map((i) => {
        const x = 36 + i * 96;
        const y = 46 + (i % 2) * 18;
        return (
          <g key={i}>
            <rect x={x} y={y} width="118" height="22" fill="#2e3d5c" opacity={0.2 + i * 0.07} stroke="#2e3d5c" />
            <text x={x + 8} y={y + 15} fill="#2e3d5c" fontFamily="IBM Plex Mono, monospace" fontSize="10">
              clip t={i}
            </text>
            <line x1={x + 118} y1={y + 22} x2={x + 118} y2="150" stroke="#c24a18" strokeDasharray="2 3" />
            <circle cx={x + 118} cy="150" r="3.5" fill="#c24a18" />
          </g>
        );
      })}
      <text x="24" y="178" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        First complete clip endpoint ≈ 1.875 s · consecutive endpoints 4 frames apart
      </text>
      <text x="24" y="198" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        Embedding dimension 768 · Hugging Face processor for MCG-NJU/videomae-base
      </text>
    </svg>
  );
}

export function DualPipeline() {
  const Box = ({
    x,
    y,
    w,
    h,
    label,
    sub,
    fill,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    sub?: string;
    fill: string;
  }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke="#1a1610" />
      <text x={x + 10} y={y + 18} fill="#1a1610" fontFamily="IBM Plex Mono, monospace" fontSize="10">
        {label}
      </text>
      {sub ? (
        <text x={x + 10} y={y + 34} fill="#3a332a" fontFamily="Newsreader, serif" fontSize="12">
          {sub}
        </text>
      ) : null}
    </g>
  );

  return (
    <svg viewBox="0 0 920 430" role="img" aria-labelledby="pipe-title">
      <title id="pipe-title">Cached training pipeline versus full inference pipeline</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        FIG. 1 · TWO PATHS, ONE SELECTED HEAD
      </text>
      <text x="0" y="48" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="20">
        Cached Stage 2 search
      </text>
      <text x="470" y="48" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="20">
        Full-video inference
      </text>
      <Box x={0} y={64} w={420} h={44} fill="#efe6d4" label="RAW VIDEO" sub="OpenCV decode at 8 FPS" />
      <Box x={470} y={64} w={420} h={44} fill="#efe6d4" label="RAW VIDEO" sub="OpenCV decode at 8 FPS" />
      {[108, 164, 220, 276, 332].map((y) => (
        <g key={y}>
          <line x1="210" y1={y} x2="210" y2={y + 12} stroke="#1a1610" />
          <line x1="680" y1={y} x2="680" y2={y + 12} stroke="#1a1610" />
        </g>
      ))}
      <Box x={0} y={120} w={420} h={44} fill="#c9d0dc" label="CLIP BUILDER" sub="16-frame clips · 0.5 s spacing" />
      <Box x={470} y={120} w={420} h={44} fill="#c9d0dc" label="CLIP BUILDER" sub="16-frame clips · 0.5 s spacing" />
      <Box x={0} y={176} w={420} h={44} fill="#efc4b0" label="STAGE 1 ENCODER" sub="VideoMAE-base cumulative adaptation" />
      <Box x={470} y={176} w={420} h={44} fill="#efc4b0" label="PAIRED ARTIFACTS" sub="stage1_best.pt + selected Stage 2 head" />
      <Box x={0} y={232} w={420} h={44} fill="#c5d8cc" label="FEATURE CACHE" sub="clip embeddings, labels, timestamps" />
      <Box x={470} y={232} w={420} h={44} fill="#c5d8cc" label="WINDOW BUILDER" sub="12 clips / window · stride 6" />
      <Box x={0} y={288} w={420} h={44} fill="#e7dcc6" label="STAGE 2 SEARCH" sub="dilated Conv1D and alternatives" />
      <Box x={470} y={288} w={420} h={44} fill="#e7dcc6" label="STAGE 2 INFERENCE" sub="step logits + video-level logit" />
      <Box x={0} y={344} w={420} h={52} fill="#1a1610" label="" />
      <text x="12" y="368" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        MODEL SELECTION
      </text>
      <text x="12" y="384" fill="#efc4b0" fontFamily="Newsreader, serif" fontSize="13">
        threshold sweep · recall floor 0.90
      </text>
      <Box x={470} y={344} w={420} h={52} fill="#1a1610" label="" />
      <text x="482" y="368" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        DECODER OUTPUT
      </text>
      <text x="482" y="384" fill="#efc4b0" fontFamily="Newsreader, serif" fontSize="13">
        timestamp averaging → onset or no incident
      </text>
    </svg>
  );
}

export function CumulativeLabels() {
  const steps = Array.from({ length: 16 }, (_, i) => i);
  const g = 6;
  return (
    <svg viewBox="0 0 920 250" role="img" aria-labelledby="cum-title">
      <title id="cum-title">Onset spike labels versus cumulative step targets</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        TARGET FORMULATION
      </text>
      <text x="0" y="52" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="18">
        Onset
      </text>
      {steps.map((i) => (
        <rect
          key={`o-${i}`}
          x={20 + i * 54}
          y={i === g ? 64 : 100}
          width="44"
          height={i === g ? 52 : 16}
          fill={i === g ? "#c24a18" : "#d3c6b0"}
        />
      ))}
      <text x="0" y="150" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="18">
        Cumulative  y_t = 1 if t ≥ g
      </text>
      {steps.map((i) => (
        <rect
          key={`c-${i}`}
          x={20 + i * 54}
          y={164}
          width="44"
          height="52"
          fill={i >= g ? "#c24a18" : "#d3c6b0"}
          opacity={i >= g ? 0.35 + Math.min(0.65, (i - g) * 0.08) : 1}
        />
      ))}
      <text x="344" y="246" fill="#c24a18" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        ↑ onset g
      </text>
    </svg>
  );
}

export function DilatedConv() {
  const layers = [
    { name: "Conv1D 768→512", k: 3, d: 1, y: 70, fill: "#c9d0dc" },
    { name: "Conv1D 512→512", k: 3, d: 2, y: 140, fill: "#c5d8cc" },
    { name: "Conv1D 512→256", k: 3, d: 4, y: 210, fill: "#efc4b0" },
  ];
  return (
    <svg viewBox="0 0 920 300" role="img" aria-labelledby="dil-title">
      <title id="dil-title">Three-layer dilated temporal convolution with receptive field of 15 clip steps</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        STAGE 2 HEAD · SYMMETRIC ZERO PADDING · GELU + DROPOUT 0.1
      </text>
      {Array.from({ length: 15 }, (_, i) => (
        <rect key={i} x={40 + i * 56} y={40} width="44" height="14" fill="#d3c6b0" />
      ))}
      {layers.map((layer, idx) => {
        const span = 1 + (layer.k - 1) * layer.d;
        const w = span * 56 - 12;
        return (
          <g key={layer.name}>
            <rect x={40} y={layer.y} width={w} height="42" fill={layer.fill} stroke="#1a1610" />
            <text x="52" y={layer.y + 18} fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#1a1610">
              {layer.name}
            </text>
            <text x="52" y={layer.y + 34} fontFamily="Newsreader, serif" fontSize="12" fill="#3a332a">
              kernel 3 · dilation {layer.d} · span {span} steps
            </text>
            {idx < 2 ? (
              <line x1="62" y1={layer.y + 42} x2="62" y2={layers[idx + 1].y} stroke="#1a1610" />
            ) : null}
          </g>
        );
      })}
      <text x="520" y="228" fill="#c24a18" fontFamily="IBM Plex Mono, monospace" fontSize="12">
        RF = 15 clips ≈ 7 s
      </text>
    </svg>
  );
}

export function LossWeights() {
  const parts = [
    { label: "L_step", w: 1, note: "masked BCE on cumulative steps", fill: "#c24a18" },
    { label: "λv L_video", w: 0.5, note: "video-level BCE  ·  λv = 0.5", fill: "#2a5c4a" },
    { label: "λa L_aux", w: 0.2, note: "4-bin temporal distance  ·  λa = 0.2", fill: "#2e3d5c" },
    { label: "λm L_mono", w: 0.05, note: "downward-transition penalty  ·  λm = 0.05", fill: "#8a6a12" },
  ];
  return (
    <svg viewBox="0 0 920 280" role="img" aria-labelledby="loss-title">
      <title id="loss-title">Stage 2 loss composition and weights</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        L = L_step + λv L_video + λm L_mono + λa L_aux
      </text>
      {parts.map((part, i) => (
        <g key={part.label}>
          <text x="0" y={52 + i * 58} fill="#1a1610" fontFamily="IBM Plex Mono, monospace" fontSize="13">
            {part.label}
          </text>
          <rect x="160" y={36 + i * 58} width="760" height="16" fill="#e7dcc6" />
          <rect x="160" y={36 + i * 58} width={Math.max(10, part.w * 760)} height="16" fill={part.fill} />
          <text x="160" y={70 + i * 58} fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
            {part.note}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function DecoderViz() {
  const steps = [0.04, 0.08, 0.12, 0.18, 0.31, 0.55, 0.74, 0.81, 0.78, 0.71, 0.66, 0.62];
  return (
    <svg viewBox="0 0 920 260" role="img" aria-labelledby="decoder-title">
      <title id="decoder-title">Thresholded onset decoding after median filtering</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        POSTPROCESSING · MEDIAN k=3 · RECALL FLOOR 0.90
      </text>
      <line x1="40" y1="40" x2="40" y2="200" stroke="#1a1610" />
      <line x1="40" y1="200" x2="880" y2="200" stroke="#1a1610" />
      <line x1="40" y1={200 - 0.7 * 150} x2="820" y2={200 - 0.7 * 150} stroke="#c24a18" strokeDasharray="4 4" />
      <text x="828" y={204 - 0.7 * 150} fill="#c24a18" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        τstart 0.70
      </text>
      <line x1="40" y1={200 - 0.2 * 150} x2="820" y2={200 - 0.2 * 150} stroke="#2e3d5c" strokeDasharray="3 4" />
      <text x="828" y={204 - 0.2 * 150} fill="#2e3d5c" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        τempty 0.20
      </text>
      <polyline
        fill="none"
        stroke="#1a1610"
        strokeWidth="2"
        points={steps.map((v, i) => `${70 + i * 60},${200 - v * 150}`).join(" ")}
      />
      {steps.map((v, i) => (
        <circle key={i} cx={70 + i * 60} cy={200 - v * 150} r="4" fill={v >= 0.7 ? "#c24a18" : "#1a1610"} />
      ))}
      <rect x={70 + 6 * 60 - 8} y="208" width="16" height="16" fill="#c24a18" />
      <text x={70 + 6 * 60 + 14} y="220" fill="#c24a18" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        first valid onset
      </text>
      <text x="40" y="250" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        τkeep = 0.10 · τvideo = 0.00 · min consecutive = 1
      </text>
    </svg>
  );
}

export function SearchBars() {
  const rows = [
    { name: "Stage 1 baseline", v: 0.6238, fill: "#d3c6b0" },
    { name: "Transformer + onset", v: 0.65, fill: "#c9d0dc" },
    { name: "Conv + onset", v: 0.6645, fill: "#c9d0dc" },
    { name: "Transformer + cumulative", v: 0.6948, fill: "#c5d8cc" },
    { name: "Conv + cum. RGB 3407", v: 0.7385, fill: "#efc4b0" },
    { name: "Conv + cum. motion 1337", v: 0.7439, fill: "#8a6a12" },
    { name: "Conv + cum. RGB 1337", v: 0.7477, fill: "#efc4b0" },
    { name: "Conv + cum. RGB 2026", v: 0.7598, fill: "#c24a18" },
    { name: "Conv + cum. motion 2026", v: 0.7651, fill: "#8a6a12" },
  ];
  return (
    <svg viewBox="0 0 920 430" role="img" aria-labelledby="search-title">
      <title id="search-title">Cached development-search F1 scores</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        TABLE IV · TRAINING-LOOP BEST F1  ·  NOT CONTROLLED ABLATIONS
      </text>
      {rows.map((row, i) => (
        <g key={row.name}>
          <text x="0" y={52 + i * 42} fill="#1a1610" fontFamily="IBM Plex Mono, monospace" fontSize="12">
            {row.name}
          </text>
          <rect x="280" y={36 + i * 42} width={row.v * 520} height="22" fill={row.fill} />
          <text x={292 + row.v * 520} y={52 + i * 42} fill="#1a1610" fontFamily="IBM Plex Mono, monospace" fontSize="12">
            {row.v.toFixed(4)}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function FullEvalBars() {
  const rows = [
    { name: "RGB-only · seed 2026", p: 0.6643, r: 0.9324, f: 0.7756 },
    { name: "Motion fusion · seed 2026", p: 0.6731, r: 0.7721, f: 0.7192 },
  ];
  return (
    <svg viewBox="0 0 920 260" role="img" aria-labelledby="full-title">
      <title id="full-title">End-to-end validation precision, recall, and F1</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        TABLE V · AID-EVAL FULL PROTOCOL
      </text>
      {rows.map((row, i) => {
        const y = 50 + i * 100;
        return (
          <g key={row.name}>
            <text x="0" y={y} fill="#1a1610" fontFamily="Newsreader, serif" fontSize="18">
              {row.name}
            </text>
            <rect x="0" y={y + 12} width={row.p * 780} height="14" fill="#2e3d5c" />
            <rect x="0" y={y + 30} width={row.r * 780} height="14" fill="#2a5c4a" />
            <rect x="0" y={y + 48} width={row.f * 780} height="14" fill="#c24a18" />
            <text x={row.p * 780 + 8} y={y + 23} fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#2e3d5c">
              P {row.p.toFixed(4)}
            </text>
            <text x={row.r * 780 + 8} y={y + 41} fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#2a5c4a">
              R {row.r.toFixed(4)}
            </text>
            <text x={row.f * 780 + 8} y={y + 59} fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#c24a18">
              F1 {row.f.toFixed(4)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ProxyVsFull() {
  const rows = [
    { name: "RGB 1337", train: 0.7477, full: 0.7398 },
    { name: "RGB 2026", train: 0.7598, full: 0.7756 },
    { name: "Motion 2026", train: 0.7651, full: 0.7192 },
  ];
  return (
    <svg viewBox="0 0 920 280" role="img" aria-labelledby="proxy-title">
      <title id="proxy-title">Training-loop F1 versus full aid-eval F1</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        TABLE VI · PROXY METRIC CAN DISAGREE WITH DEPLOYMENT
      </text>
      {rows.map((row, i) => {
        const x = 40 + i * 300;
        return (
          <g key={row.name}>
            <text x={x} y="50" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="18">
              {row.name}
            </text>
            <rect x={x} y={220 - row.train * 200} width="44" height={row.train * 200} fill="#2e3d5c" />
            <rect x={x + 58} y={220 - row.full * 200} width="44" height={row.full * 200} fill="#c24a18" />
            <text x={x} y="244" fill="#2e3d5c" fontFamily="IBM Plex Mono, monospace" fontSize="11">
              loop {row.train.toFixed(4)}
            </text>
            <text x={x} y="262" fill="#c24a18" fontFamily="IBM Plex Mono, monospace" fontSize="11">
              full {row.full.toFixed(4)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function TimingChart() {
  return (
    <svg viewBox="0 0 920 210" role="img" aria-labelledby="time-title">
      <title id="time-title">Wall-clock comparison of raw versus cached Stage 2 training</title>
      <text x="0" y="18" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        TABLE III · A100 LOG MEASUREMENTS, NOT A CONTROLLED BENCHMARK
      </text>
      <text x="0" y="58" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="18">
        Raw Stage 2  ·  ~74 min / epoch
      </text>
      <rect x="0" y="70" width="880" height="22" fill="#2e3d5c" />
      <text x="12" y="85" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="12">
        batch 1 · 4020 batches/ep · 1.4–1.6 GB
      </text>
      <text x="0" y="128" fill="#1a1610" fontFamily="Newsreader, serif" fontSize="18">
        Cached Stage 2  ·  ~4 s / epoch
      </text>
      <rect x="0" y="140" width="8" height="22" fill="#c24a18" />
      <text x="20" y="156" fill="#c24a18" fontFamily="IBM Plex Mono, monospace" fontSize="12">
        batch 8 · 503 batches/ep · ~0.05 GB  ·  ~1100× faster per epoch
      </text>
      <text x="0" y="196" fill="#6f665b" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        Bottleneck was video decode / dataloader contention, not GPU memory.
      </text>
    </svg>
  );
}

export function MetricCases() {
  const cases = [
    { title: "True positive", note: "positive video, ĝ ∈ [g−1, g+30]", fill: "#2a5c4a" },
    { title: "False negative", note: "positive video, no prediction", fill: "#8a6a12" },
    { title: "False positive", note: "negative prediction, or positive outside interval", fill: "#c24a18" },
  ];
  return (
    <svg viewBox="0 0 920 150" role="img" aria-labelledby="cases-title">
      <title id="cases-title">Asymmetric error accounting used by the validation metric</title>
      {cases.map((c, i) => (
        <g key={c.title}>
          <rect x={i * 310} y="8" width="292" height="120" fill={c.fill} />
          <text x={i * 310 + 16} y="42" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="11">
            {String(i + 1).padStart(2, "0")}
          </text>
          <text x={i * 310 + 16} y="72" fill="#efe6d4" fontFamily="Newsreader, serif" fontSize="22">
            {c.title}
          </text>
          <text x={i * 310 + 16} y="102" fill="#efe6d4" fontFamily="IBM Plex Mono, monospace" fontSize="11">
            {c.note}
          </text>
        </g>
      ))}
    </svg>
  );
}
