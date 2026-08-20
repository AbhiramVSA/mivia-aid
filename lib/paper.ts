export const PAPER = {
  title: "Offline Accident-Onset Timestamp Estimation on MIVIA-AID with VideoMAE and Dilated Temporal Convolutions",
  shortTitle: "Offline Accident-Onset Timestamp Estimation",
  authors: [
    { name: "Abhiram Venkat Sai Adabala" },
    { name: "Sibi Chakkaravarthy S" },
  ],
  metrics: {
    precision: 0.6643,
    recall: 0.9324,
    f1: 0.7756,
  },
  github: "https://github.com/AbhiramVSA/mivia-aid-dataset",
  datasetUrl: "https://mivia.unisa.it/datasets/",
} as const;

export const DATASET = [
  { split: "Train", videos: 1246, positive: 959, negative: 287, meanDuration: 11.79, medianOnset: 2 },
  { split: "Val", videos: 310, positive: 155, negative: 155, meanDuration: 10.39, medianOnset: 1 },
] as const;

export const SEARCH_RUNS = [
  { variant: "Stage 1 clip baseline", seed: "—", f1: 0.6238 },
  { variant: "Conv + onset, RGB", seed: "2026", f1: 0.6645 },
  { variant: "Transformer + onset, RGB", seed: "2026", f1: 0.65 },
  { variant: "Conv + cumulative, RGB", seed: "1337", f1: 0.7477 },
  { variant: "Conv + cumulative, RGB", seed: "2026", f1: 0.7598 },
  { variant: "Conv + cumulative, RGB", seed: "3407", f1: 0.7385 },
  { variant: "Transformer + cumulative, RGB", seed: "2026", f1: 0.6948 },
  { variant: "Conv + cumulative, motion", seed: "1337", f1: 0.7439 },
  { variant: "Conv + cumulative, motion", seed: "2026", f1: 0.7651 },
] as const;

export const FULL_EVAL = [
  { variant: "RGB-only", seed: 2026, precision: 0.6643, recall: 0.9324, f1: 0.7756, selected: true },
  { variant: "Motion fusion", seed: 2026, precision: 0.6731, recall: 0.7721, f1: 0.7192, selected: false },
] as const;

export const PROXY_VS_FULL = [
  { variant: "RGB-only", seed: 1337, train: 0.7477, full: 0.7398 },
  { variant: "RGB-only", seed: 2026, train: 0.7598, full: 0.7756 },
  { variant: "Motion fusion", seed: 2026, train: 0.7651, full: 0.7192 },
] as const;

export const CONFIG = [
  ["Backbone", "MCG-NJU/videomae-base"],
  ["Input sampling", "8 FPS · 16 frames/clip · 0.5 s spacing"],
  ["Stage 1", "10 epochs · LR 10⁻⁵ backbone · 10⁻⁴ head"],
  ["Stage 2 head", "Dilated Conv1D 512/512/256 · dropout 0.1"],
  ["Windows", "12 clips · stride 6"],
  ["Training", "Cached head · batch 8 · video-balanced"],
  ["Optim", "AdamW · LR 10⁻⁴ · wd 0.05 · cosine · 2 warmup"],
  ["Loss", "λvideo = 0.5 · λmono = 0.05 · λaux = 0.2"],
  ["Selection", "Patience 4 · seed 2026 · best F1 if recall ≥ 0.90"],
  ["Decode", "τempty 0.20 · τstart 0.70 · τkeep 0.10 · τvideo 0.00 · min=1"],
] as const;

export const INFERENCE_STEPS = [
  "Decode the input video with OpenCV and sample frames at 8 FPS.",
  "Build causal 16-frame clips with 0.5-second step spacing.",
  "Partition clips into overlapping windows of 12 with stride 6.",
  "Preprocess each window with the VideoMAE image processor.",
  "Encode clips with the adapted Stage 1 VideoMAE encoder.",
  "Apply the Stage 2 head: per-step logits + one video-level logit.",
  "Convert logits to probabilities with the sigmoid function.",
  "Record step probabilities at their corresponding timestamps.",
  "Record the window-level video probability.",
  "Average step probabilities for timestamps in multiple windows.",
  "Average window-level video probabilities across windows.",
  "Apply median filtering with kernel size 3.",
  "Apply τempty=0.20, τstart=0.70, τkeep=0.10, τvideo=0.00, min=1.",
  "Return the first valid onset, or no incident.",
] as const;
