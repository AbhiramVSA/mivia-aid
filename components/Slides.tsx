import {
  CONFIG,
  DATASET,
  FULL_EVAL,
  INFERENCE_STEPS,
  PAPER,
  PROXY_VS_FULL,
  SEARCH_RUNS,
} from "@/lib/paper";
import type { ReactNode } from "react";

export type Slide = { id: string; title: string; node: ReactNode };

function Head({ kicker, title }: { kicker: string; title: string }) {
  return (
    <>
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
    </>
  );
}

function DualPipeline() {
  const left = [
    ["Raw video", "OpenCV decode at 8 FPS", "fill-a"],
    ["Clip builder", "16-frame clips · 0.5 s spacing", "fill-b"],
    ["Stage 1 encoder", "VideoMAE-base cumulative adaptation", "fill-c"],
    ["Feature cache", "clip embeddings, labels, timestamps", "fill-d"],
    ["Stage 2 search", "dilated Conv1D and alternatives", "fill-e"],
  ];
  const right = [
    ["Raw video", "OpenCV decode at 8 FPS", "fill-a"],
    ["Clip builder", "16-frame clips · 0.5 s spacing", "fill-b"],
    ["Paired artifacts", "stage1_best.pt + selected Stage 2 head", "fill-c"],
    ["Window builder", "12 clips / window · stride 6", "fill-d"],
    ["Stage 2 inference", "step logits + video-level logit", "fill-e"],
  ];
  return (
    <div className="pipe">
      <div className="pipe-col">
        <h3>Cached Stage 2 search</h3>
        {left.map(([tag, sub, fill]) => (
          <div className={`step ${fill}`} key={tag}>
            <div className="tag">{tag}</div>
            <div className="sub">{sub}</div>
          </div>
        ))}
        <div className="step end">
          <div className="tag">Model selection</div>
          <div className="sub">threshold sweep · recall floor 0.90</div>
        </div>
      </div>
      <div className="pipe-col">
        <h3>Full-video inference</h3>
        {right.map(([tag, sub, fill]) => (
          <div className={`step ${fill}`} key={tag}>
            <div className="tag">{tag}</div>
            <div className="sub">{sub}</div>
          </div>
        ))}
        <div className="step end">
          <div className="tag">Decoder output</div>
          <div className="sub">timestamp averaging → onset or no incident</div>
        </div>
      </div>
    </div>
  );
}

export function getSlides(): Slide[] {
  return [
    {
      id: "title",
      title: "Title",
      node: (
        <>
          <div className="kicker">Surveillance video · accident-onset estimation · development-set protocol</div>
          <h1>{PAPER.shortTitle} on MIVIA-AID</h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            A two-stage offline pipeline: adapt VideoMAE with clip-level cumulative
            supervision, then train a dilated temporal head on cached embeddings and
            decode a timestamp only after full-video aggregation.
          </p>
          <div className="authors">
            {PAPER.authors.map((a) => (
              <div key={a.name}>{a.name}</div>
            ))}
          </div>
          <div className="metrics" aria-label="Selected checkpoint metrics">
            <div className="metric">
              <div className="lbl">Precision</div>
              <div className="val">{PAPER.metrics.precision.toFixed(4)}</div>
            </div>
            <div className="metric">
              <div className="lbl">Recall</div>
              <div className="val">{PAPER.metrics.recall.toFixed(4)}</div>
            </div>
            <div className="metric hot">
              <div className="lbl">F1 · selected RGB</div>
              <div className="val">{PAPER.metrics.f1.toFixed(4)}</div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "abstract",
      title: "Abstract",
      node: (
        <>
          <Head kicker="00" title="Abstract" />
          <div className="copy grow">
            <p>
              This paper presents a two-stage pipeline for offline accident-onset
              timestamp estimation on the MIVIA-AID validation split. A pretrained
              VideoMAE clip encoder is combined with a dilated temporal head trained
              on overlapping windows. Stage 1 adapts the encoder with clip-level
              cumulative supervision. Stage 2 trains on per-clip embeddings, using a
              cached-feature path so architecture and threshold sweeps remain feasible
              under heavy video I/O cost.
            </p>
            <p>
              The selected model is an RGB-only temporal convolution head with
              cumulative targets, auxiliary video-level supervision, monotonic
              regularization, and recall-constrained threshold selection. End-to-end
              on the validation protocol: precision 0.6643, recall 0.9324, F1 0.7756.
            </p>
            <p>
              A lightweight motion-fusion extension improved some cached-search runs,
              but underperformed RGB-only under full-video evaluation. The strongest
              selected checkpoint used cumulative supervision, a dilated temporal
              convolution head, and full-protocol checkpoint selection.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "contributions",
      title: "Contributions",
      node: (
        <>
          <Head kicker="00 · framing" title="Contributions and operating regime" />
          <div className="grid-2 grow">
            <article className="box">
              <h3>Contributions</h3>
              <ol>
                <li>A complete two-stage pipeline derived from the implemented system.</li>
                <li>The exact metric, aggregation path, and model-selection rule for the reported F1.</li>
                <li>Evidence that cached temporal training made architecture search practical.</li>
                <li>RGB-only vs. lightweight motion fusion under full evaluation, with RGB selected.</li>
              </ol>
            </article>
            <article className="box">
              <h3>Operating regime</h3>
              <p>
                The selected system is offline, not streaming. Stage 2 uses symmetric
                temporal convolutions over overlapping windows. Decoding runs after
                aggregating scores across the full video. The first complete clip
                endpoint is at ≈ 1.875 s, so the task is incident declaration / onset
                timestamp estimation, not early anticipation.
              </p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "problem",
      title: "Problem",
      node: (
        <>
          <Head kicker="01" title="The system must decide when to declare the incident" />
          <p className="lede">
            Accident analysis in surveillance video is more than binary video
            classification.
          </p>
          <div className="grid-3 grow" style={{ marginTop: "1rem" }}>
            <article className="box">
              <h3>Long videos</h3>
              <p>Raw end-to-end experimentation is slow. The bottleneck was decode, preprocess, and dataloader contention — not GPU memory.</p>
            </article>
            <article className="box">
              <h3>Asymmetric metric</h3>
              <p>The protocol rewards stable post-onset declaration more than precise sub-second localization.</p>
            </article>
            <article className="box">
              <h3>Imbalanced train</h3>
              <p>The training split is class-imbalanced at the video level. These constraints shaped the recipe more than architectural novelty.</p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "dataset",
      title: "Dataset",
      node: (
        <>
          <Head kicker="01 · table I" title="MIVIA-AID splits from the annotation files" />
          <p className="copy">
            Labels from <code>Train_GT.csv</code> and <code>Val_GT.csv</code>. Timestamps parsed from mm:ss into integer seconds.
          </p>
          <div className="bars" style={{ marginTop: "0.8rem" }}>
            <div className="bar-row">
              <span>Train 1246 · 959 pos</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(959 / 1246) * 100}%`, background: "var(--onset)" }} />
              </div>
              <span>77%</span>
            </div>
            <div className="bar-row">
              <span>Train · 287 neg</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(287 / 1246) * 100}%`, background: "var(--clip)" }} />
              </div>
              <span>23%</span>
            </div>
            <div className="bar-row">
              <span>Val 310 · 155 / 155</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: "50%", background: "var(--onset)" }} />
              </div>
              <span>50%</span>
            </div>
          </div>
          <table style={{ marginTop: "0.9rem" }}>
            <thead>
              <tr>
                <th>Split</th>
                <th className="num">Videos</th>
                <th className="num">Pos</th>
                <th className="num">Neg</th>
                <th className="num">Mean s</th>
                <th className="num">Median onset</th>
              </tr>
            </thead>
            <tbody>
              {DATASET.map((row) => (
                <tr key={row.split}>
                  <td>{row.split}</td>
                  <td className="num">{row.videos}</td>
                  <td className="num">{row.positive}</td>
                  <td className="num">{row.negative}</td>
                  <td className="num">{row.meanDuration.toFixed(2)}</td>
                  <td className="num">{row.medianOnset} s</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="caption">Train is strongly positive-skewed. Validation is balanced at the video level.</p>
        </>
      ),
    },
    {
      id: "related",
      title: "Related work",
      node: (
        <>
          <Head kicker="01 · context" title="Related work, different operating regime" />
          <div className="grid-2 grow">
            <article className="box">
              <h3>Accident anticipation</h3>
              <p>
                DSTA and DRIVE target egocentric or dashcam video and reward the
                earliest possible prediction. This study uses fixed surveillance-style
                videos and accepts a broad post-onset interval.
              </p>
            </article>
            <article className="box">
              <h3>Localization / anomalies</h3>
              <p>
                Sultani et al., UntrimmedNet, and ActionFormer provide context for
                window-level scoring and weak supervision. They are not directly
                comparable to this benchmark-specific decoder and reused validation split.
              </p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "metric",
      title: "Metric",
      node: (
        <>
          <Head kicker="02" title="A true positive lives in [g − 1, g + 30]" />
          <p className="copy">
            Let <em>g</em> be the annotated onset and <em>ĝ</em> the prediction. Labels are integer seconds.
          </p>
          <div className="corridor" aria-hidden="true">
            <div className="corridor-band" />
            <div className="corridor-axis" />
            <div className="corridor-g" />
            <span className="corridor-lab" style={{ left: "1rem", top: "0.45rem", color: "var(--onset)" }}>
              g · annotated onset
            </span>
            <span className="corridor-lab" style={{ left: "1rem", bottom: "0.4rem" }}>
              0 s
            </span>
            <span className="corridor-lab" style={{ left: "14%", bottom: "0.4rem", color: "var(--accept)" }}>
              g − 1 s
            </span>
            <span className="corridor-lab" style={{ right: "1.2rem", bottom: "0.4rem", color: "var(--accept)" }}>
              g + 30 s
            </span>
          </div>
          <p className="caption">
            The corridor is wide on purpose: the protocol accepts stable post-onset declaration rather than sub-second localization.
          </p>
        </>
      ),
    },
    {
      id: "errors",
      title: "Error accounting",
      node: (
        <>
          <Head kicker="02" title="Asymmetric errors" />
          <div className="cases grow">
            <article className="case" style={{ background: "var(--accept)" }}>
              <div className="n">01</div>
              <h3>True positive</h3>
              <p>Positive video, and ĝ ∈ [g−1, g+30].</p>
            </article>
            <article className="case" style={{ background: "var(--warn)" }}>
              <div className="n">02</div>
              <h3>False negative</h3>
              <p>Positive video with no prediction. Only misses count as FN.</p>
            </article>
            <article className="case" style={{ background: "var(--onset)" }}>
              <div className="n">03</div>
              <h3>False positive</h3>
              <p>A negative video gets a prediction, or a positive prediction falls outside the interval.</p>
            </article>
          </div>
          <div className="eq">Precision = TP / (TP+FP) · Recall = TP / (TP+FN) · F1 = 2PR / (P+R)</div>
        </>
      ),
    },
    {
      id: "resolution",
      title: "Resolution",
      node: (
        <>
          <Head kicker="02" title="Temporal resolution forbids early anticipation" />
          <div className="note">
            <strong>First complete clip endpoint ≈ 1.875 s</strong>
            Frames are sampled at 8 FPS. Each clip has 16 sampled frames. The model cannot emit any score before that time.
          </div>
          <div className="grid-2 grow" style={{ marginTop: "0.9rem" }}>
            <article className="box">
              <h3>Clip construction</h3>
              <p>Causal 16-frame clips. Consecutive endpoints are 4 sampled frames apart, i.e. 0.5 s. Embedding dimension 768 from MCG-NJU/videomae-base.</p>
            </article>
            <article className="box">
              <h3>Median onsets</h3>
              <p>Training median onset is 2 s; validation median onset is 1 s. The implemented task is benchmark-specific incident declaration, not early accident anticipation.</p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "pipeline",
      title: "Pipeline",
      node: (
        <>
          <Head kicker="03 · fig. 1" title="Search and deployment are two graphs, one head" />
          <DualPipeline />
          <p className="caption">Cached search extracts embeddings once. Full inference recomputes encoder features, averages overlapping windows, then decodes.</p>
        </>
      ),
    },
    {
      id: "frontend",
      title: "Front end",
      node: (
        <>
          <Head kicker="03" title="Shared video front end" />
          <p className="copy">OpenCV decode → 8 FPS → causal 16-frame clips → Hugging Face VideoMAE processor.</p>
          <div className="clips">
            {Array.from({ length: 8 }, (_, i) => (
              <div className="clip" key={i}>
                clip t={i}
              </div>
            ))}
          </div>
          <div className="grid-3" style={{ marginTop: "1rem" }}>
            <article className="box"><h3>8 FPS</h3><p>Sampled frames, not native video rate.</p></article>
            <article className="box"><h3>0.5 s step</h3><p>Consecutive clip endpoints 4 frames apart.</p></article>
            <article className="box"><h3>768-d</h3><p>One embedding per clip from VideoMAE-base.</p></article>
          </div>
        </>
      ),
    },
    {
      id: "cache",
      title: "Cached training",
      node: (
        <>
          <Head kicker="03 · table III" title="Cached Stage 2 made search practical" />
          <p className="caption" style={{ marginTop: 0, marginBottom: "0.8rem" }}>
            A100 log measurements — representative, not a controlled benchmark.
          </p>
          <article className="box">
            <h3>Raw Stage 2 · ~74 min / epoch</h3>
            <div className="bar-track" style={{ margin: "0.55rem 0" }}>
              <div className="bar-fill" style={{ width: "100%", background: "var(--clip)" }} />
            </div>
            <p>batch 1 · 4020 batches/ep · 1.4–1.6 GB</p>
          </article>
          <article className="box">
            <h3>Cached Stage 2 · ~4 s / epoch</h3>
            <div className="bar-track" style={{ margin: "0.55rem 0" }}>
              <div className="bar-fill" style={{ width: "1.2%", background: "var(--onset)" }} />
            </div>
            <p>batch 8 · 503 batches/ep · ~0.05 GB · ~1100× faster per epoch</p>
          </article>
          <p className="caption">Bottleneck was video decode / dataloader contention, not GPU memory.</p>
        </>
      ),
    },
    {
      id: "stage1",
      title: "Stage 1",
      node: (
        <>
          <Head kicker="04" title="Stage 1 adapts the clip encoder" />
          <div className="eq">z<sub>t</sub> = wᵀ x<sub>t</sub> + b &nbsp; · &nbsp; y<sub>t</sub> = 1 if t ≥ g</div>
          <div className="grid-2 grow">
            <article className="box">
              <h3>Balanced three-group loss</h3>
              <ul>
                <li>clips from negative videos</li>
                <li>clips from positive videos before onset</li>
                <li>clips from positive videos after onset</li>
              </ul>
            </article>
            <article className="box">
              <h3>Not the deployed model</h3>
              <p>Stage 1 provides domain-adapted embeddings for Stage 2. Best Stage 1 validation: precision 0.4974, recall 0.8362, F1 0.6238.</p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "targets",
      title: "Targets",
      node: (
        <>
          <Head kicker="04" title="Cumulative labels match this metric" />
          <div className="grid-2 grow">
            <article className="box">
              <h3>Onset spike</h3>
              <div className="cells">
                {Array.from({ length: 12 }, (_, i) => (
                  <div className={`cell ${i === 5 ? "on" : ""}`} key={i} />
                ))}
              </div>
              <p>A sharp delta at g. The tested RGB Conv1D head was weaker with this target.</p>
            </article>
            <article className="box">
              <h3>Cumulative · y<sub>t</sub> = 1 if t ≥ g</h3>
              <div className="cells">
                {Array.from({ length: 12 }, (_, i) => (
                  <div className={`cell ${i >= 5 ? "cum" : ""}`} key={i} />
                ))}
              </div>
              <p>Stable post-onset activation. A prediction is accepted over a broad interval, so this is better aligned than a peak.</p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "stage2",
      title: "Stage 2",
      node: (
        <>
          <Head kicker="04" title="Dilated Conv1D head, not a causal transformer" />
          <p className="copy">Windows of 12 clip embeddings. Symmetric zero padding. GELU and dropout 0.1. Receptive field: 15 clip steps, about 7 seconds.</p>
          <div className="stack" style={{ marginTop: "0.7rem" }}>
            <div className="layer fill-b" style={{ width: "38%" }}>
              <strong>Conv1D 768 → 512</strong>
              <span>kernel 3 · dilation 1 · span 3</span>
            </div>
            <div className="layer fill-d" style={{ width: "58%" }}>
              <strong>Conv1D 512 → 512</strong>
              <span>kernel 3 · dilation 2 · span 5</span>
            </div>
            <div className="layer fill-c" style={{ width: "84%" }}>
              <strong>Conv1D 512 → 256</strong>
              <span>kernel 3 · dilation 4 · span 9 · RF 15 clips</span>
            </div>
          </div>
          <div className="grid-2" style={{ marginTop: "0.8rem" }}>
            <article className="box">
              <h3>Outputs</h3>
              <ul>
                <li>per-step cumulative logits</li>
                <li>auxiliary video-level logit</li>
                <li>4-way temporal-distance bins</li>
              </ul>
            </article>
            <article className="box">
              <h3>Distance bins vs g</h3>
              <ul>
                <li>far before: t−g &lt; −5 s</li>
                <li>near before: −5 ≤ t−g &lt; 0</li>
                <li>near after: 0 ≤ t−g ≤ 5</li>
                <li>far after: t−g &gt; 5</li>
              </ul>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "loss",
      title: "Loss",
      node: (
        <>
          <Head kicker="04" title="Stage 2 objective" />
          <div className="eq">L = L_step + λv L_video + λm L_mono + λa L_aux</div>
          <div className="bars">
            {[
              ["L_step", "masked BCE on cumulative steps", 1, "var(--onset)"],
              ["λv L_video", "video-level BCE · λv = 0.5", 0.5, "var(--accept)"],
              ["λa L_aux", "4-bin temporal distance · λa = 0.2", 0.2, "var(--clip)"],
              ["λm L_mono", "downward-transition penalty · λm = 0.05", 0.05, "var(--warn)"],
            ].map(([lab, note, w, color]) => (
              <div className="bar-row" key={String(lab)} style={{ alignItems: "start" }}>
                <span>
                  {lab}
                  <br />
                  <em style={{ fontStyle: "normal", color: "var(--muted)", fontSize: "0.68rem", letterSpacing: 0, textTransform: "none" }}>
                    {note}
                  </em>
                </span>
                <div className="bar-track" style={{ marginTop: "0.25rem" }}>
                  <div className="bar-fill" style={{ width: `${Number(w) * 100}%`, background: String(color) }} />
                </div>
                <span>{String(w)}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "motion",
      title: "Motion probe",
      node: (
        <>
          <Head kicker="04" title="A lightweight motion branch, not optical flow" />
          <div className="grid-3 grow">
            <article className="box">
              <h3>24-d descriptor</h3>
              <p>Frame differences summarized into a handcrafted 24-dimensional motion vector per clip.</p>
            </article>
            <article className="box">
              <h3>Gated fusion</h3>
              <p>A small MLP maps it to 768-d. A learned gate modulates motion against the RGB embedding, then the fused vector is normalized.</p>
            </article>
            <article className="box">
              <h3>Probe, not a stream</h3>
              <p>It asks whether explicit motion helps under this setup. Full evaluation later selects RGB-only over this checkpoint.</p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "decode",
      title: "Decoding",
      node: (
        <>
          <Head kicker="05" title="Full-video aggregation, then a threshold tuple" />
          <p className="copy">
            Windows of 12 clips, stride 6. Average per-timestamp step scores and average window-level video scores. Median filter, kernel 3. Then decode — not stream.
          </p>
          <div className="grid-4" style={{ marginTop: "1rem" }}>
            {[
              ["τempty", "0.20", "reject empty"],
              ["τstart", "0.70", "declare onset"],
              ["τkeep", "0.10", "continue run"],
              ["τvideo", "0.00", "video gate off"],
            ].map(([k, v, n]) => (
              <article className="box" key={k}>
                <h3>{k} = {v}</h3>
                <p>{n}</p>
              </article>
            ))}
          </div>
          <p className="caption">
            Sweep ranked lexicographically by F1, then precision, then recall, subject to recall ≥ 0.90. Min consecutive = 1.
          </p>
        </>
      ),
    },
    {
      id: "config",
      title: "Configuration",
      node: (
        <>
          <Head kicker="05 · table II" title="Selected RGB-only recipe" />
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Setting</th>
              </tr>
            </thead>
            <tbody>
              {CONFIG.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="caption">Executable pair: cached_conv_rgb_r90_s2026.pt + stage1_best.pt</p>
        </>
      ),
    },
    {
      id: "algorithm",
      title: "Algorithm 1",
      node: (
        <>
          <Head kicker="05" title="Full-video inference and onset decoding" />
          <ol className="algo-grid">
            {INFERENCE_STEPS.map((step, i) => (
              <li key={step}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </>
      ),
    },
    {
      id: "two-metrics",
      title: "Two metrics",
      node: (
        <>
          <Head kicker="06" title="Training-loop F1 is not full evaluation" />
          <div className="grid-2 grow">
            <article className="box">
              <h3>Training-loop validation</h3>
              <p>Best threshold-swept F1 observed during model training on cached features. Useful for search. Not the deployable number.</p>
            </article>
            <article className="box">
              <h3>Full aid-eval</h3>
              <p>Load the paired checkpoint and run the end-to-end inference pipeline across the validation set. This is how the final model is chosen.</p>
            </article>
          </div>
          <div className="note">
            <strong>Still a development protocol</strong>
            The same labeled validation split is reused for threshold selection, early stopping, checkpoint selection, and reporting.
          </div>
        </>
      ),
    },
    {
      id: "search",
      title: "Search",
      node: (
        <>
          <Head kicker="06 · table IV" title="Cached development-search F1" />
          <div className="bars">
            {SEARCH_RUNS.map((row) => (
              <div className="bar-row" key={`${row.variant}-${row.seed}`}>
                <span title={`${row.variant} · ${row.seed}`}>
                  {row.variant} · {row.seed}
                </span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(row.f1 / 0.8) * 100}%`,
                      background: row.f1 >= 0.75 ? "var(--onset)" : "var(--clip)",
                    }}
                  />
                </div>
                <span>{row.f1.toFixed(4)}</span>
              </div>
            ))}
          </div>
          <p className="caption">Not controlled single-factor ablations. RGB cumulative Conv seeds: 0.7477 / 0.7598 / 0.7385 · mean 0.7487 · sd ≈ 0.0087.</p>
        </>
      ),
    },
    {
      id: "fulleval",
      title: "Full evaluation",
      node: (
        <>
          <Head kicker="06 · table V" title="aid-eval selects RGB-only" />
          <div className="bars" style={{ justifyContent: "flex-start", gap: "0.7rem" }}>
            {FULL_EVAL.map((row) => (
              <article className="box" key={row.variant}>
                <h3>
                  {row.variant}
                  {row.selected ? " · selected" : ""} · seed {row.seed}
                </h3>
                <div className="bar-row">
                  <span>Precision</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${row.precision * 100}%`, background: "var(--clip)" }} />
                  </div>
                  <span>{row.precision.toFixed(4)}</span>
                </div>
                <div className="bar-row">
                  <span>Recall</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${row.recall * 100}%`, background: "var(--accept)" }} />
                  </div>
                  <span>{row.recall.toFixed(4)}</span>
                </div>
                <div className="bar-row">
                  <span>F1</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${row.f1 * 100}%`, background: "var(--onset)" }} />
                  </div>
                  <span>{row.f1.toFixed(4)}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="caption">RGB-only has the highest recall and the highest F1 among evaluated deployable checkpoints.</p>
        </>
      ),
    },
    {
      id: "proxy",
      title: "Proxy vs full",
      node: (
        <>
          <Head kicker="06 · table VI" title="Cached ranking can disagree with deployment" />
          <div className="vbars">
            {PROXY_VS_FULL.map((row) => (
              <div className="vcol" key={`${row.variant}-${row.seed}`}>
                <h3>
                  {row.variant} {row.seed}
                </h3>
                <div className="vpairs">
                  <div className="vbar" style={{ height: `${row.train * 100}%` }} title={`loop ${row.train}`} />
                  <div className="vbar full" style={{ height: `${row.full * 100}%` }} title={`full ${row.full}`} />
                </div>
                <div className="vlab">loop {row.train.toFixed(4)}</div>
                <div className="vlab" style={{ color: "var(--onset)" }}>
                  full {row.full.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
          <p className="caption">Motion looked best in-loop (0.7651) and dropped to 0.7192 under aid-eval. RGB 2026 rose from 0.7598 to 0.7756.</p>
        </>
      ),
    },
    {
      id: "discussion",
      title: "Discussion",
      node: (
        <>
          <Head kicker="07" title="What the selected pipeline is associated with" />
          <div className="grid-2 grow">
            <article className="box">
              <h3>Observed factors</h3>
              <ul>
                <li>Stage 1 + Stage 2 provide clip-level and sequence-level signal.</li>
                <li>Dilated convolution supplies temporal smoothing and decoding.</li>
                <li>Cached training decouples search from video I/O.</li>
                <li>Recall-constrained thresholds match the asymmetric metric.</li>
              </ul>
            </article>
            <article className="box">
              <h3>Why cumulative may win here</h3>
              <p>
                Out-of-window positives are false positives; only missing predictions are false negatives. Stable, selective post-onset detection can beat aggressive boundary chasing. For the tested RGB Conv1D head, cumulative supervision produced substantially higher validation F1 than onset-style supervision.
              </p>
            </article>
          </div>
          <div className="note">
            <strong>Warm-start comparison was not informative</strong>
            Checked stage1_best and pretrained cache tensors were numerically identical, so the paper draws no warm-start claim from cached Stage 2 alone.
          </div>
        </>
      ),
    },
    {
      id: "limits",
      title: "Limitations",
      node: (
        <>
          <Head kicker="08" title="Read the numbers as a validation protocol" />
          <div className="grid-3 grow">
            <article className="box">
              <h3>No held-out test</h3>
              <p>Thresholds, early stopping, checkpoint choice, and reporting all reuse the same validation split.</p>
            </article>
            <article className="box">
              <h3>Offline / non-causal</h3>
              <p>Scores are aggregated over the full video. No score before ≈ 1.875 s. Not online anticipation.</p>
            </article>
            <article className="box">
              <h3>Motion is a probe</h3>
              <p>24-d frame differences, not a learned motion encoder. No object, trajectory, or interaction modeling. No external baselines.</p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "conclusion",
      title: "Conclusion",
      node: (
        <>
          <Head kicker="09" title="Selected checkpoint" />
          <p className="lede">
            VideoMAE clip encoder + cached dilated Conv1D head + cumulative supervision + monotonic regularization + recall-constrained thresholds.
          </p>
          <div className="metrics" style={{ marginTop: "1.4rem", maxWidth: "44rem" }}>
            <div className="metric">
              <div className="lbl">Precision</div>
              <div className="val">0.6643</div>
            </div>
            <div className="metric">
              <div className="lbl">Recall</div>
              <div className="val">0.9324</div>
            </div>
            <div className="metric hot">
              <div className="lbl">F1</div>
              <div className="val">0.7756</div>
            </div>
          </div>
          <p className="caption" style={{ marginTop: "1.1rem" }}>
            Cached development favored cumulative convolution. Full evaluation selected RGB-only over lightweight motion fusion.
          </p>
        </>
      ),
    },
    {
      id: "references",
      title: "References",
      node: (
        <>
          <Head kicker="09" title="References" />
          <ol className="refs">
            <li>Z. Tong et al., “VideoMAE,” NeurIPS, 2022.</li>
            <li>K. He et al., “Masked autoencoders are scalable vision learners,” CVPR, 2022.</li>
            <li>W. Sultani, C. Chen, and M. Shah, “Real-world anomaly detection in surveillance videos,” CVPR, 2018.</li>
            <li>W. Bao, Q. Yu, and Y. Kong, “DRIVE,” ICCV, 2021.</li>
            <li>M. M. Karim et al., “DSTA,” arXiv:2106.10197, 2021.</li>
            <li>L. Wang et al., “UntrimmedNets,” CVPR, 2017.</li>
            <li>C. Zhang, J. Wu, and Y. Li, “ActionFormer,” ECCV, 2022.</li>
            <li>
              MIVIA Lab, Public datasets.{" "}
              <a href={PAPER.datasetUrl} rel="noreferrer" target="_blank">
                mivia.unisa.it/datasets
              </a>
              . Implementation:{" "}
              <a href={PAPER.github} rel="noreferrer" target="_blank">
                github.com/AbhiramVSA/mivia-aid-dataset
              </a>
              .
            </li>
          </ol>
        </>
      ),
    },
  ];
}
