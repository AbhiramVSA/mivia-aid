export const PAPER = {
  title: "Offline Accident-Onset Timestamp Estimation on MIVIA-AID with VideoMAE and Dilated Temporal Convolutions",
  shortTitle: "Offline Accident-Onset Timestamp Estimation",
  authors: [
    { name: "Abhiram Venkat Sai Adabala" },
    { name: "Sibi Chakkaravarthy S" },
  ],
  venue: "Technical report · MIVIA-AID validation protocol",
  metrics: {
    precision: 0.6643,
    recall: 0.9324,
    f1: 0.7756,
  },
  stage1: {
    precision: 0.4974,
    recall: 0.8362,
    f1: 0.6238,
  },
  motion: {
    precision: 0.6731,
    recall: 0.7721,
    f1: 0.7192,
  },
  checkpoint: "cached_conv_rgb_r90_s2026.pt",
  encoder: "stage1_best.pt",
  backbone: "MCG-NJU/videomae-base",
  recipe: "cached_conv_rgb_r90_s2026",
  github: "https://github.com/AbhiramVSA/mivia-aid-dataset",
  datasetUrl: "https://mivia.unisa.it/datasets/",
} as const;

export const DATASET = [
  {
    split: "Train",
    videos: 1246,
    positive: 959,
    negative: 287,
    meanDuration: 11.79,
    medianOnset: 2,
  },
  {
    split: "Val",
    videos: 310,
    positive: 155,
    negative: 155,
    meanDuration: 10.39,
    medianOnset: 1,
  },
] as const;

export const SEARCH_RUNS = [
  { variant: "Stage 1 clip baseline", seed: "—", f1: 0.6238, group: "stage1" },
  { variant: "Conv + onset, RGB", seed: "2026", f1: 0.6645, group: "onset" },
  { variant: "Transformer + onset, RGB", seed: "2026", f1: 0.65, group: "onset" },
  { variant: "Conv + cumulative, RGB", seed: "1337", f1: 0.7477, group: "cum" },
  { variant: "Conv + cumulative, RGB", seed: "2026", f1: 0.7598, group: "cum" },
  { variant: "Conv + cumulative, RGB", seed: "3407", f1: 0.7385, group: "cum" },
  { variant: "Transformer + cumulative, RGB", seed: "2026", f1: 0.6948, group: "cum" },
  { variant: "Conv + cumulative, motion", seed: "1337", f1: 0.7439, group: "motion" },
  { variant: "Conv + cumulative, motion", seed: "2026", f1: 0.7651, group: "motion" },
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

export const NAV = [
  { id: "abstract", label: "Abstract", num: "00" },
  { id: "problem", label: "Problem", num: "01" },
  { id: "metric", label: "Metric", num: "02" },
  { id: "pipeline", label: "Pipeline", num: "03" },
  { id: "method", label: "Method", num: "04" },
  { id: "algorithm", label: "Algorithm", num: "05" },
  { id: "results", label: "Results", num: "06" },
  { id: "discussion", label: "Discussion", num: "07" },
  { id: "limitations", label: "Limits", num: "08" },
  { id: "references", label: "References", num: "09" },
] as const;

export const INFERENCE_STEPS = [
  "Decode the input video with OpenCV and sample frames at 8 FPS.",
  "Build causal 16-frame clips with 0.5-second step spacing.",
  "Partition the clip sequence into overlapping windows of 12 clips with stride 6.",
  "For each window: preprocess clips with the VideoMAE image processor.",
  "Encode clips with the adapted Stage 1 VideoMAE encoder.",
  "Apply the Stage 2 temporal head to obtain per-step logits and one video-level logit.",
  "Convert logits to probabilities with the sigmoid function.",
  "Record step probabilities at their corresponding timestamps.",
  "Record the window-level video probability.",
  "Average step probabilities for timestamps that appear in multiple windows.",
  "Average the window-level video probabilities across windows.",
  "Apply median filtering with kernel size 3 to the merged step sequence.",
  "Apply the selected threshold tuple: τempty = 0.20, τstart = 0.70, τkeep = 0.10, τvideo = 0.00, min consecutive = 1.",
  "Return the first valid onset timestamp if the decoding rule is satisfied; otherwise return no incident.",
] as const;
