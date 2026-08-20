import {
  CONFIG,
  DATASET,
  INFERENCE_STEPS,
  PAPER,
  PROXY_VS_FULL,
  SEARCH_RUNS,
} from "@/lib/paper";
import type { ReactNode } from "react";

export type Slide = { id: string; title: string; node: ReactNode };

function Head({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header>
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
    </header>
  );
}

function Corridor({ hero = false }: { hero?: boolean }) {
  return (
    <div className={hero ? "corridor corridor-hero" : "corridor"} aria-hidden="true">
      <div className="corridor-band" />
      <div className="corridor-axis" />
      <div className="corridor-g" />
      <span className="corridor-lab" style={{ left: "1rem", top: "0.5rem", color: "var(--onset)" }}>
        g · annotated onset
      </span>
      <span className="corridor-lab" style={{ left: "1rem", bottom: "0.45rem" }}>0 s</span>
      <span className="corridor-lab" style={{ left: "14%", bottom: "0.45rem", color: "var(--accept)" }}>
        g − 1 s
      </span>
      <span className="corridor-lab" style={{ right: "1.2rem", bottom: "0.45rem", color: "var(--accept)" }}>
        g + 30 s
      </span>
    </div>
  );
}

function StageStrip() {
  return (
    <div className="stages">
      <article className="stage">
        <div className="n">Stage 1</div>
        <h3>VideoMAE</h3>
        <p>Adapt the clip encoder with cumulative labels, then cache 768-d embeddings.</p>
      </article>
      <div className="stage-arrow" aria-hidden="true">→</div>
      <article className="stage">
        <div className="n">Stage 2</div>
        <h3>Dilated Conv1D</h3>
        <p>Train a temporal head on windows of 12 clips. Search stays on the cache.</p>
      </article>
      <div className="stage-arrow" aria-hidden="true">→</div>
      <article className="stage">
        <div className="n">Decode</div>
        <h3>Full video</h3>
        <p>Average overlapping windows, then apply a recall-constrained threshold tuple.</p>
      </article>
    </div>
  );
}

function ScoreCurve() {
  const heights = [10, 11, 12, 13, 16, 22, 38, 62, 82, 91, 95, 97, 98, 98];
  return (
    <div className="score" aria-hidden="true">
      {heights.map((h, i) => (
        <div className="score-bar" key={i} style={{ height: `${h}%` }} />
      ))}
      <span className="score-lab" style={{ left: "1rem", top: "0.45rem", color: "var(--onset)" }}>
        τstart = 0.70
      </span>
      <span className="score-lab" style={{ left: "1rem", bottom: "28%", color: "var(--clip)" }}>
        τempty = 0.20
      </span>
      <span className="score-lab" style={{ right: "1rem", bottom: "0.4rem" }}>
        averaged step probability
      </span>
    </div>
  );
}

function DualPipeline() {
  return (
    <div className="flow">
      <div className="flow-label">Shared front end</div>
      <div className="flow-shared">
        <div className="flow-node">
          <div className="tag">Raw video</div>
          <div className="sub">OpenCV decode at 8 FPS</div>
        </div>
        <div className="flow-join" aria-hidden="true">→</div>
        <div className="flow-node">
          <div className="tag">Clip builder</div>
          <div className="sub">16 frames · 0.5 s spacing</div>
        </div>
        <div className="flow-join" aria-hidden="true">→</div>
        <div className="flow-node">
          <div className="tag">VideoMAE-base</div>
          <div className="sub">768-d clip embeddings</div>
        </div>
      </div>
      <div className="flow-split">
        <article className="flow-arm search">
          <h3>Cached Stage 2 search</h3>
          <p className="why">
            Extract embeddings once so architecture and threshold sweeps stay feasible.
          </p>
          <ul>
            <li>Cache embeddings, labels, and timestamps</li>
            <li>Train dilated Conv1D heads on windows of 12 / stride 6</li>
            <li>Sweep thresholds with recall floor 0.90</li>
          </ul>
          <p className="stat">~4 s/epoch · ~0.05 GB · about 1100× vs raw video</p>
        </article>
        <article className="flow-arm infer">
          <h3>Full-video inference</h3>
          <p className="why">
            Deployment reloads the paired checkpoints and decodes after full-video aggregation.
          </p>
          <ul>
            <li>Load stage1_best.pt with the selected Stage 2 head</li>
            <li>Rebuild overlapping windows; average timestamps and video logits</li>
            <li>Apply the frozen threshold tuple: onset, or no incident</li>
          </ul>
          <p className="stat">The encoder runs again — this is not a cache lookup</p>
        </article>
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
          <p className="lede">
            Adapt VideoMAE with clip-level cumulative supervision, train a dilated
            temporal head on cached embeddings, and decode a timestamp only after
            full-video aggregation.
          </p>
          <div className="authors">
            {PAPER.authors.map((a) => (
              <div key={a.name}>{a.name}</div>
            ))}
          </div>
          <div className="chips">
            <span className="chip">VideoMAE-base</span>
            <span className="chip">Dilated Conv1D</span>
            <span className="chip">Offline, not streaming</span>
            <span className="chip">Recall floor 0.90</span>
          </div>
          <Corridor hero />
          <div className="metrics">
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
          <Head kicker="00" title="What was built, and which checkpoint was kept" />
          <p className="lede">
            A two-stage pipeline for offline accident-onset timestamp estimation on
            the MIVIA-AID validation split. Motion fusion looked strong in cached
            search, then lost under end-to-end evaluation — so the selected checkpoint
            is RGB-only.
          </p>
          <StageStrip />
          <div className="metrics">
            <div className="metric">
              <div className="lbl">RGB-only F1</div>
              <div className="val">0.7756</div>
            </div>
            <div className="metric">
              <div className="lbl">Motion F1</div>
              <div className="val">0.7192</div>
            </div>
            <div className="metric">
              <div className="lbl">Stage 1 clip F1</div>
              <div className="val">0.6238</div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "problem",
      title: "Problem",
      node: (
        <>
          <Head kicker="01" title="Declare when the incident starts" />
          <p className="lede">
            Accident analysis in surveillance video is more than binary classification.
            Three constraints shaped the system more than architectural novelty.
          </p>
          <div className="grid-3">
            <article className="card">
              <div className="card-n">01</div>
              <h3>Long videos</h3>
              <p>
                Raw Stage 2 was I/O-bound: about 74 min/epoch, batch 1, 4020 batches.
                GPU memory stayed at 1.4–1.6 GB. Decode and dataloading dominated, not VRAM.
              </p>
            </article>
            <article className="card">
              <div className="card-n">02</div>
              <h3>Asymmetric metric</h3>
              <p>
                A hit is accepted only on [g−1, g+30]. Misses hurt recall; mistimed
                positives hurt precision. Stable post-onset declaration can beat a sharp spike.
              </p>
            </article>
            <article className="card">
              <div className="card-n">03</div>
              <h3>Imbalanced train</h3>
              <p>
                Train is 959 positive / 287 negative. Val is balanced 155 / 155.
                Stage 1 balances loss across negative, pre-onset, and post-onset clips.
              </p>
            </article>
          </div>
          <div className="grid-2 grow">
            <article className="card">
              <div className="card-n">Contributions</div>
              <ol>
                <li>A complete two-stage pipeline from the implemented system.</li>
                <li>Exact metric, aggregation path, and selection rule for the reported F1.</li>
                <li>Cached temporal training made architecture search practical.</li>
                <li>RGB-only beats the tested motion-fusion checkpoint under full eval.</li>
              </ol>
            </article>
            <article className="card">
              <div className="card-n">Operating regime</div>
              <h3>Offline incident declaration</h3>
              <p>
                Not streaming. Symmetric, not causal, temporal convolutions. Decode after
                full-video aggregation. First complete clip endpoint is about 1.875 s —
                not early anticipation, unlike DSTA or DRIVE.
              </p>
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
          <Head kicker="01 · table I" title="MIVIA-AID splits, labels, and why they matter" />
          <div className="split">
            <div className="grow">
              <p>
                Annotations from <code>Train_GT.csv</code> and <code>Val_GT.csv</code>,
                parsed from mm:ss into integer seconds. Median positive onset is 2 s in
                train and 1 s in val — inside the period where the encoder still cannot
                emit a score.
              </p>
              <div className="bars">
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
              <table>
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
            </div>
            <article className="card">
              <div className="card-n">Related work</div>
              <h3>A different regime</h3>
              <p>
                DSTA and DRIVE anticipate accidents in egocentric or dashcam video and
                reward earliest prediction. Sultani et al., UntrimmedNet, and ActionFormer
                motivate window-level scoring under weak supervision.
              </p>
              <p>
                None are comparable here: fixed surveillance video, second-level labels,
                a benchmark-specific decoder, and one reused validation split. This is a
                study of a working pipeline — not a new generic localizer.
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
          <Head kicker="02" title="The validation metric is not standard localization" />
          <p className="lede">
            Let g be the annotated onset and ĝ the prediction. Labels are integer seconds.
            A true positive requires a positive video and ĝ ∈ [g−1, g+30].
          </p>
          <Corridor />
          <div className="cases">
            <article className="case" style={{ background: "var(--accept)" }}>
              <div className="n">01 · TP</div>
              <h3>True positive</h3>
              <p>Positive video, prediction inside the corridor. This is the only accepted hit.</p>
            </article>
            <article className="case" style={{ background: "var(--warn)" }}>
              <div className="n">02 · FN</div>
              <h3>False negative</h3>
              <p>Positive video with no prediction at all. Late hits inside the window are still TPs.</p>
            </article>
            <article className="case" style={{ background: "var(--onset)" }}>
              <div className="n">03 · FP</div>
              <h3>False positive</h3>
              <p>A negative video gets a prediction, or a positive prediction falls outside the corridor.</p>
            </article>
          </div>
          <p className="caption">
            P = TP / (TP+FP) · R = TP / (TP+FN) · F1 = 2PR / (P+R). First complete clip
            at 8 FPS × 16 frames ≈ 1.875 s, so median onsets (2 s train / 1 s val) sit at
            or before that horizon: incident declaration, not early anticipation.
          </p>
        </>
      ),
    },
    {
      id: "pipeline",
      title: "Pipeline",
      node: (
        <>
          <Head kicker="03 · fig. 1" title="Search and deployment share a front end, then fork" />
          <DualPipeline />
        </>
      ),
    },
    {
      id: "frontend",
      title: "Front end",
      node: (
        <>
          <Head kicker="03" title="Shared clip front end, and the I/O tax it imposes" />
          <div className="split">
            <div className="grow">
              <p>
                Every variant shares the same construction: OpenCV decode, 8 FPS, causal
                16-frame clips, 0.5 s endpoint spacing, Hugging Face processor for
                MCG-NJU/videomae-base, 768-d embeddings. Clips use frames up to the
                endpoint. Stage 2 windows are later scored with symmetric padding.
              </p>
              <div className="clips">
                {Array.from({ length: 8 }, (_, i) => (
                  <div className="clip" key={i}>t={i}</div>
                ))}
              </div>
              <div className="mini-metrics">
                <div className="mini"><div className="lbl">FPS</div><div className="val">8</div></div>
                <div className="mini"><div className="lbl">Frames / clip</div><div className="val">16</div></div>
                <div className="mini"><div className="lbl">Step</div><div className="val">0.5 s</div></div>
              </div>
            </div>
            <div className="grow">
              <article className="card">
                <div className="card-n">Table III · raw Stage 2</div>
                <h3>~74 min / epoch</h3>
                <div className="bar-track" style={{ margin: "0.7rem 0" }}>
                  <div className="bar-fill" style={{ width: "100%", background: "var(--clip)" }} />
                </div>
                <p>Batch 1 · 4020 batches · 1.4–1.6 GB</p>
              </article>
              <article className="card">
                <div className="card-n">Cached Stage 2</div>
                <h3>~4 s / epoch</h3>
                <div className="bar-track" style={{ margin: "0.7rem 0" }}>
                  <div className="bar-fill" style={{ width: "1.4%", background: "var(--onset)" }} />
                </div>
                <p>Batch 8 · 503 batches · ~0.05 GB · ~1100×</p>
              </article>
              <p className="caption" style={{ marginTop: "0.7rem" }}>
                Representative A100 logs, not a controlled benchmark.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "stage1",
      title: "Stage 1",
      node: (
        <>
          <Head kicker="04" title="Stage 1 adapts the encoder; cumulative labels fit the metric" />
          <div className="eq">z<sub>t</sub> = wᵀ x<sub>t</sub> + b &nbsp; · &nbsp; y<sub>t</sub> = 1 if t ≥ g, else 0</div>
          <div className="grid-2 grow">
            <article className="card">
              <div className="card-n">Linear head on 768-d clips</div>
              <h3>Adapt, then cache — do not deploy</h3>
              <p>
                Stage 1 is a single linear classifier on the VideoMAE embedding. It exists
                to adapt the encoder and to emit the cache that Stage 2 searches over.
              </p>
              <p>
                Loss is balanced across negative-video clips, positive pre-onset clips,
                and positive post-onset clips. Best Stage 1 val: P 0.4974 · R 0.8362 · F1 0.6238.
              </p>
            </article>
            <article className="card">
              <div className="card-n">Why cumulative wins</div>
              <h3>Onset spike vs stay-on step</h3>
              <p className="caption" style={{ margin: 0 }}>onset spike</p>
              <div className="cells">
                {Array.from({ length: 12 }, (_, i) => (
                  <div className={`cell ${i === 5 ? "on" : ""}`} key={`o${i}`} />
                ))}
              </div>
              <p className="caption" style={{ margin: 0 }}>cumulative step</p>
              <div className="cells">
                {Array.from({ length: 12 }, (_, i) => (
                  <div className={`cell ${i >= 5 ? "cum" : ""}`} key={`c${i}`} />
                ))}
              </div>
              <p>
                RGB Conv1D, seed 2026, training-loop: onset F1 0.6645 vs cumulative 0.7598.
                The wide TP corridor rewards staying on, not peaking.
              </p>
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
          <Head kicker="04" title="Dilated Conv1D over 12-clip windows" />
          <div className="split">
            <div className="grow">
              <p>
                Stage 2 consumes windows of 12 clip embeddings, stride 6. Three Conv1D
                layers with kernel 3, dilations 1 / 2 / 4, widths 512 / 512 / 256, GELU
                and dropout 0.1. Symmetric zero padding — the head is not strictly causal.
                Receptive field: 15 clip steps ≈ 7 s.
              </p>
              <div className="stack">
                <div className="layer fill-b" style={{ width: "42%" }}>
                  <strong>768 → 512</strong>
                  <span>dilation 1 · span 3</span>
                </div>
                <div className="layer fill-d" style={{ width: "62%" }}>
                  <strong>512 → 512</strong>
                  <span>dilation 2 · span 5</span>
                </div>
                <div className="layer fill-c" style={{ width: "88%" }}>
                  <strong>512 → 256</strong>
                  <span>dilation 4 · span 9 · RF 15</span>
                </div>
              </div>
            </div>
            <article className="card">
              <div className="card-n">Three outputs</div>
              <ul>
                <li>Per-step cumulative incident logits</li>
                <li>One video-level logit after masked pooling</li>
                <li>Four temporal-distance bins relative to g: far before (&lt; −5 s), near before, near after (0–5 s), far after</li>
              </ul>
              <p style={{ marginTop: "0.85rem" }}>
                Transformer + cumulative, seed 2026, reached loop F1 0.6948 — below the
                corresponding Conv1D recipe at 0.7598.
              </p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "loss",
      title: "Loss and motion",
      node: (
        <>
          <Head kicker="04" title="Stage 2 loss, and the motion probe that did not survive" />
          <div className="eq">L = L_step + λ<sub>v</sub> L_video + λ<sub>m</sub> L_mono + λ<sub>a</sub> L_aux</div>
          <div className="split">
            <div className="bars">
              {[
                ["L_step", "masked BCE on cumulative steps", 1, "var(--onset)"],
                ["λv = 0.5", "video-level BCE after masked pooling", 0.5, "var(--accept)"],
                ["λa = 0.2", "cross-entropy on 4 distance bins", 0.2, "var(--clip)"],
                ["λm = 0.05", "penalize downward probability jumps", 0.05, "var(--warn)"],
              ].map(([lab, note, w, color]) => (
                <div className="bar-row" key={String(lab)}>
                  <span>
                    {lab}
                    <br />
                    <span style={{ color: "var(--muted)" }}>{note}</span>
                  </span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Number(w) * 100}%`, background: String(color) }} />
                  </div>
                  <span>{String(w)}</span>
                </div>
              ))}
            </div>
            <article className="card">
              <div className="card-n">Motion fusion · probe</div>
              <h3>Looked best in-loop, lost on aid-eval</h3>
              <p>
                24-d frame-difference descriptor, MLP to 768-d, gated against RGB.
                Intentionally not optical flow.
              </p>
              <p>
                Cached loop, seed 2026: motion 0.7651 vs RGB 0.7598. Full aid-eval:
                motion F1 0.7192 vs RGB 0.7756, because recall fell from 0.9324 to 0.7721.
              </p>
              <p>Final selection therefore uses aid-eval, not the cache loop.</p>
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
          <Head kicker="05" title="Aggregate the whole video, then apply a recall-constrained tuple" />
          <p>
            Overlapping windows of 12 clips, stride 6. Average per-timestamp step
            probabilities and window-level video probabilities. Median filter of kernel 3.
            Then decode. This is not streaming.
          </p>
          <ScoreCurve />
          <div className="knobs">
            {[
              ["τempty", "0.20", "If the sequence never rises, emit no incident."],
              ["τstart", "0.70", "First crossing that can start an onset."],
              ["τkeep", "0.10", "Continuation floor; must be ≤ τstart."],
              ["τvideo", "0.00", "Video gate left off at the selected point."],
            ].map(([k, v, n]) => (
              <article className="knob" key={k}>
                <div className="lbl">{k}</div>
                <div className="val">{v}</div>
                <p className="caption" style={{ marginTop: "0.4rem" }}>{n}</p>
              </article>
            ))}
          </div>
          <p className="caption">
            Sweep ranks by F1, then precision, then recall. Keep the best candidate with
            recall ≥ 0.90. Selected recipe cached_conv_rgb_r90_s2026: 20 epochs, patience 4,
            batch 8, AdamW 10⁻⁴, cosine with 2 warmup epochs, min consecutive = 1.
          </p>
        </>
      ),
    },
    {
      id: "config",
      title: "Configuration",
      node: (
        <>
          <Head kicker="05 · table II" title="Selected RGB-only configuration" />
          <div className="knobs">
            <div className="knob"><div className="lbl">Backbone</div><div className="val">VideoMAE</div></div>
            <div className="knob"><div className="lbl">Windows</div><div className="val">12 / 6</div></div>
            <div className="knob"><div className="lbl">Recall floor</div><div className="val">0.90</div></div>
            <div className="knob"><div className="lbl">Selected seed</div><div className="val">2026</div></div>
          </div>
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
          <p className="caption">
            Full inference loads cached_conv_rgb_r90_s2026.pt together with stage1_best.pt.
            Motion probe: cached_conv_motion_r90_s2026.pt. Stage 1: 10 epochs, backbone LR 10⁻⁵, head LR 10⁻⁴.
          </p>
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
      id: "search",
      title: "Search",
      node: (
        <>
          <Head kicker="06 · table IV" title="Cached search steered the recipe — it did not pick the checkpoint" />
          <div className="split">
            <div className="bars">
              {SEARCH_RUNS.map((row) => (
                <div className="bar-row" key={`${row.variant}-${row.seed}`}>
                  <span>
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
            <article className="card">
              <div className="card-n">How to read Table IV</div>
              <h3>Two numbers, not one</h3>
              <p>
                Training-loop F1 is the best threshold-swept score during cached training.
                aid-eval F1 reloads the paired checkpoint and runs full-video inference on val.
              </p>
              <p>
                Cumulative beats onset for RGB Conv1D. Conv1D beats the tested transformer.
                RGB cumulative seeds 1337 / 2026 / 3407: 0.7477 / 0.7598 / 0.7385.
              </p>
              <p>
                Target, architecture, warm-start, and training path were not isolated.
                Read as search evidence, not single-factor claims.
              </p>
            </article>
          </div>
        </>
      ),
    },
    {
      id: "fulleval",
      title: "Full evaluation",
      node: (
        <>
          <Head kicker="06 · tables V–VI" title="aid-eval selects RGB-only; the proxy ranking can lie" />
          <div className="compare">
            <article>
              <div className="kicker">Selected · RGB-only · seed 2026</div>
              <div className="val hot">0.7756</div>
              <p>P 0.6643 · R 0.9324. Recall holds the floor. This is the deployable checkpoint.</p>
            </article>
            <article>
              <div className="kicker">Motion fusion · seed 2026</div>
              <div className="val">0.7192</div>
              <p>P 0.6731 · R 0.7721. Slightly better precision, much worse recall on full eval.</p>
            </article>
          </div>
          <table>
            <thead>
              <tr>
                <th>Variant</th>
                <th>Seed</th>
                <th className="num">Train-loop F1</th>
                <th className="num">Full aid-eval F1</th>
                <th>What happened</th>
              </tr>
            </thead>
            <tbody>
              {PROXY_VS_FULL.map((row) => (
                <tr
                  key={`${row.variant}-${row.seed}`}
                  className={row.variant === "RGB-only" && row.seed === 2026 ? "sel" : undefined}
                >
                  <td>{row.variant}</td>
                  <td>{row.seed}</td>
                  <td className="num">{row.train.toFixed(4)}</td>
                  <td className="num">{row.full.toFixed(4)}</td>
                  <td>
                    {row.variant === "Motion fusion"
                      ? "Looked best in-loop; recall collapsed on full eval"
                      : row.seed === 2026
                        ? "Improved on the real inference path"
                        : "Slight drop, still below the selected seed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="caption">
            Motion gained precision (0.6731 vs 0.6643) and lost much more recall.
          </p>
        </>
      ),
    },
    {
      id: "discussion",
      title: "Discussion",
      node: (
        <>
          <Head kicker="07–08" title="What the recipe is associated with, and what the numbers are not" />
          <div className="grid-3">
            <article className="card">
              <div className="card-n">Associated factors</div>
              <h3>Clip signal, then sequence</h3>
              <p>
                Stage 1 plus Stage 2 give clip and sequence signal. Dilated conv smooths
                over about 7 s. Caching decouples search from video I/O. Recall-constrained
                thresholds match the FN / FP asymmetry.
              </p>
            </article>
            <article className="card">
              <div className="card-n">Cumulative vs onset</div>
              <h3>Stay on after g</h3>
              <p>
                Out-of-window positives are FPs; only missing predictions are FNs.
                Staying on after onset is closer to the scoring rule than chasing a delta.
                RGB Conv1D cumulative 0.7598 vs onset 0.6645 (loop, seed 2026).
              </p>
            </article>
            <article className="card">
              <div className="card-n">Warm-start</div>
              <h3>No claim</h3>
              <p>
                Caches from adapted Stage 1 and from the unadapted pretrained encoder were
                numerically identical in the checked files. The paper does not claim a
                warm-start benefit from cached Stage 2 alone.
              </p>
            </article>
          </div>
          <div className="grid-3 grow">
            <article className="card">
              <div className="card-n">Limitation</div>
              <h3>Development protocol</h3>
              <p>
                Thresholds, early stopping, checkpoint choice, and reporting all reuse the
                same val split. These are not held-out challenge estimates.
              </p>
            </article>
            <article className="card">
              <div className="card-n">Limitation</div>
              <h3>Offline only</h3>
              <p>
                Non-causal aggregation over the full video. No score before about 1.875 s.
                Not evidence about online anticipation.
              </p>
            </article>
            <article className="card">
              <div className="card-n">Open extensions</div>
              <h3>Still untested</h3>
              <p>
                Learned motion or optical flow; object and trajectory modeling; cleaner
                single-factor ablations; external baselines; a true held-out evaluation.
              </p>
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
          <Head kicker="09" title="Selected system, and how to read it" />
          <StageStrip />
          <p className="lede">
            VideoMAE clip encoder, cached dilated Conv1D head, cumulative supervision,
            monotonic regularization, and recall-constrained thresholds.
          </p>
          <p>
            Cached development favored cumulative convolution over onset targets and over
            the tested transformer. Full end-to-end evaluation then selected RGB-only over
            lightweight motion fusion. Cached training made search possible; full-protocol
            evaluation was required to choose the checkpoint.
          </p>
          <div className="metrics">
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
            <li>Z. Tong, Y. Song, J. Wang, and L. Wang, “VideoMAE: Masked autoencoders are data-efficient learners for self-supervised video pre-training,” NeurIPS, 2022.</li>
            <li>K. He, X. Chen, S. Xie, Y. Li, P. Dollár, and R. Girshick, “Masked autoencoders are scalable vision learners,” CVPR, 2022.</li>
            <li>W. Sultani, C. Chen, and M. Shah, “Real-world anomaly detection in surveillance videos,” CVPR, 2018.</li>
            <li>W. Bao, Q. Yu, and Y. Kong, “DRIVE: Deep reinforced accident anticipation with visual explanation,” ICCV, 2021.</li>
            <li>M. M. Karim, Y. Li, R. Qin, and Z. Yin, “A dynamic spatial-temporal attention network for early anticipation of traffic accidents,” arXiv:2106.10197, 2021.</li>
            <li>L. Wang, Y. Xiong, D. Lin, and L. Van Gool, “UntrimmedNets for weakly supervised action recognition and detection,” CVPR, 2017.</li>
            <li>C. Zhang, J. Wu, and Y. Li, “ActionFormer: Localizing moments of actions with transformers,” ECCV, 2022.</li>
            <li>
              MIVIA Lab, “Public datasets,” University of Salerno.{" "}
              <a href={PAPER.datasetUrl} rel="noreferrer" target="_blank">mivia.unisa.it/datasets</a>
              . Implementation repository:{" "}
              <a href={PAPER.github} rel="noreferrer" target="_blank">github.com/AbhiramVSA/mivia-aid-dataset</a>.
            </li>
          </ol>
        </>
      ),
    },
  ];
}
