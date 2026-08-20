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
    <>
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
    </>
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
      <span className="corridor-lab" style={{ left: "14%", bottom: "0.45rem", color: "var(--accept)" }}>g − 1 s</span>
      <span className="corridor-lab" style={{ right: "1.2rem", bottom: "0.45rem", color: "var(--accept)" }}>
        g + 30 s · accepted corridor
      </span>
    </div>
  );
}

function StageStrip() {
  return (
    <div className="stages">
      <article className="stage fill-c">
        <div className="n">Stage 1</div>
        <h3>VideoMAE</h3>
        <p>Adapt the clip encoder with cumulative labels, then cache 768-d embeddings.</p>
      </article>
      <div className="stage-arrow" aria-hidden="true">→</div>
      <article className="stage fill-d">
        <div className="n">Stage 2</div>
        <h3>Dilated Conv1D</h3>
        <p>Train a temporal head on windows of 12 clips. Search stays on the cache.</p>
      </article>
      <div className="stage-arrow" aria-hidden="true">→</div>
      <article className="stage fill-b">
        <div className="n">Decode</div>
        <h3>Full-video</h3>
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
        averaged step probability over the video
      </span>
    </div>
  );
}

function DualPipeline() {
  const left = [
    ["Raw video", "OpenCV decode at 8 FPS", "fill-a"],
    ["Clip builder", "16-frame clips · 0.5 s spacing", "fill-b"],
    ["Stage 1 encoder", "VideoMAE-base cumulative adaptation", "fill-c"],
    ["Feature cache", "embeddings, labels, timestamps", "fill-d"],
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
          <p className="lede" style={{ marginTop: "0.75rem" }}>
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
          <div className="metrics" style={{ marginTop: "0.85rem", maxWidth: "none" }}>
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
          <p className="lede" style={{ marginBottom: "0.75rem" }}>
            A two-stage pipeline for offline accident-onset timestamp estimation on
            the MIVIA-AID validation split. Motion fusion looked strong in cached
            search, then lost under end-to-end evaluation — so the selected checkpoint
            is RGB-only.
          </p>
          <StageStrip />
          <div className="grid-2 compact" style={{ marginTop: "0.75rem" }}>
            <article className="box">
              <h3>Selected recipe</h3>
              <ul>
                <li>Cumulative targets, not onset spikes</li>
                <li>Conv1D 512/512/256, dilations 1/2/4</li>
                <li>Windows 12 / stride 6, seed 2026</li>
                <li>Recall floor 0.90 for operating-point search</li>
              </ul>
            </article>
            <article className="box">
              <h3>aid-eval numbers</h3>
              <p>RGB-only: P 0.6643 · R 0.9324 · F1 0.7756</p>
              <p>Motion fusion: P 0.6731 · R 0.7721 · F1 0.7192</p>
              <p>Stage 1 clip baseline F1 0.6238 — selection used full aid-eval, not training-loop F1.</p>
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
          <Head kicker="01" title="Declare when the incident starts — under three hard constraints" />
          <p className="lede" style={{ marginBottom: "0.7rem" }}>
            Accident analysis in surveillance video is more than binary classification.
            These constraints shaped the system more than architectural novelty.
          </p>
          <div className="grid-3 compact">
            <article className="box mark" data-n="01">
              <h3>Long videos</h3>
              <p>
                Raw Stage 2 was CPU- and I/O-bound: ~74 min/epoch, batch 1, 4020
                batches, while GPU memory stayed at 1.4–1.6 GB. Decode, preprocess,
                and dataloader contention dominated, not VRAM.
              </p>
            </article>
            <article className="box mark" data-n="02">
              <h3>Asymmetric metric</h3>
              <p>
                A prediction is accepted on [g−1, g+30]. Missing predictions hurt
                recall; mistimed positives hurt precision. Stable post-onset
                declaration can beat sharp localization.
              </p>
            </article>
            <article className="box mark" data-n="03">
              <h3>Imbalanced train</h3>
              <p>
                Train is 959 positive / 287 negative. Val is balanced 155 / 155.
                Stage 1 therefore balances loss across negative, pre-onset, and
                post-onset clips rather than using plain BCE.
              </p>
            </article>
          </div>
          <div className="grid-2 compact" style={{ marginTop: "0.7rem" }}>
            <article className="box">
              <h3>Contributions</h3>
              <ol>
                <li>A complete two-stage pipeline from the implemented system.</li>
                <li>Exact metric, aggregation path, and selection rule for the reported F1.</li>
                <li>Cached temporal training made architecture search practical.</li>
                <li>RGB-only beats the tested motion-fusion checkpoint under full eval.</li>
              </ol>
            </article>
            <article className="box">
              <h3>Operating regime</h3>
              <p>
                Offline, not streaming. Symmetric (non-causal) temporal convolutions.
                Decoding after full-video aggregation. First complete clip endpoint
                ≈ 1.875 s, so this is incident declaration / onset timestamp
                estimation — not early anticipation, unlike DSTA or DRIVE.
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
            <div>
              <p className="compact">
                Annotations from <code>Train_GT.csv</code> and <code>Val_GT.csv</code>,
                parsed from mm:ss into integer seconds, using the public MIVIA release
                conventions. Median positive onset is 2 s in train and 1 s in val —
                inside the period where the encoder still cannot emit a score.
              </p>
              <div className="bars" style={{ marginTop: "0.75rem" }}>
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
                  <span>Val 310 · 155 pos / 155 neg</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: "50%", background: "var(--onset)" }} />
                  </div>
                  <span>50%</span>
                </div>
              </div>
              <table style={{ marginTop: "0.75rem" }}>
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
            <div className="compact" style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <article className="box">
                <h3>Related work, different regime</h3>
                <p>
                  DSTA and DRIVE anticipate accidents in egocentric/dashcam video and
                  reward earliest prediction. Sultani et al., UntrimmedNet, and
                  ActionFormer motivate window-level scoring under weak supervision.
                </p>
                <p>
                  None are comparable here: this study uses fixed surveillance video,
                  second-level labels, a benchmark-specific decoder, and one reused
                  validation split.
                </p>
              </article>
              <article className="box">
                <h3>What this paper is</h3>
                <p>
                  A benchmark-specific empirical study of a working two-stage pipeline
                  and of the evaluation path needed to select the deployable checkpoint —
                  not a new generic localization architecture.
                </p>
              </article>
            </div>
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
          <p className="compact">
            Let <em>g</em> be the annotated onset and <em>ĝ</em> the prediction. Labels are integer seconds.
            A true positive requires a positive video and ĝ ∈ [g−1, g+30].
          </p>
          <Corridor />
          <div className="cases" style={{ marginTop: "0.65rem" }}>
            <article className="case" style={{ background: "var(--accept)" }}>
              <div className="n">01 · TP</div>
              <h3>True positive</h3>
              <p>Positive video, prediction inside the corridor. This is the only accepted hit.</p>
            </article>
            <article className="case" style={{ background: "var(--warn)" }}>
              <div className="n">02 · FN</div>
              <h3>False negative</h3>
              <p>Positive video with no prediction at all. Only misses count as FN — not late hits inside the window.</p>
            </article>
            <article className="case" style={{ background: "var(--onset)" }}>
              <div className="n">03 · FP</div>
              <h3>False positive</h3>
              <p>Negative video gets a prediction, or a positive prediction falls outside [g−1, g+30].</p>
            </article>
          </div>
          <div className="grid-2 compact" style={{ marginTop: "0.65rem" }}>
            <div className="eq" style={{ margin: 0 }}>P = TP/(TP+FP) · R = TP/(TP+FN) · F1 = 2PR/(P+R)</div>
            <article className="box">
              <h3>Resolution limit ≈ 1.875 s</h3>
              <p>
                8 FPS × 16-frame clips. No score before the first complete clip. Median
                onsets (2 s train / 1 s val) sit at or before that horizon, so the task
                is incident declaration, not early anticipation.
              </p>
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
          <Head kicker="03 · fig. 1" title="Search and deployment are two graphs that share one head" />
          <DualPipeline />
          <div className="grid-2 compact" style={{ marginTop: "0.55rem" }}>
            <article className="box">
              <h3>Why cache?</h3>
              <p>
                Stage 2 search needs many heads and threshold grids. Extracting
                768-d clip embeddings once from the adapted Stage 1 encoder turns a
                74 min/epoch loop into ~4 s/epoch (~1100×), ~0.05 GB vs 1.4–1.6 GB.
              </p>
            </article>
            <article className="box">
              <h3>Why recompute at inference?</h3>
              <p>
                Deployable inference pairs <code>stage1_best.pt</code> with the selected
                head, rebuilds overlapping windows, averages timestamps and video
                logits, then applies the frozen threshold tuple.
              </p>
            </article>
          </div>
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
            <div>
              <p className="compact">
                Every variant shares the same construction: OpenCV decode, 8 FPS,
                causal 16-frame clips, 0.5 s endpoint spacing, Hugging Face processor
                for MCG-NJU/videomae-base, 768-d embeddings. Clips are built from
                frames up to the endpoint — no future frames inside a clip — but Stage 2
                windows are later scored with symmetric padding.
              </p>
              <div className="clips">
                {Array.from({ length: 8 }, (_, i) => (
                  <div className="clip" key={i}>t={i}</div>
                ))}
              </div>
              <div className="mini-metrics" style={{ marginTop: "0.75rem" }}>
                <div className="mini"><div className="lbl">FPS</div><div className="val">8</div></div>
                <div className="mini"><div className="lbl">Frames / clip</div><div className="val">16</div></div>
                <div className="mini"><div className="lbl">Step</div><div className="val">0.5 s</div></div>
              </div>
            </div>
            <div className="compact" style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <article className="box">
                <h3>Raw Stage 2 · Table III</h3>
                <div className="bar-track" style={{ margin: "0.45rem 0" }}>
                  <div className="bar-fill" style={{ width: "100%", background: "var(--clip)" }} />
                </div>
                <p>~74 min/epoch · batch 1 · 4020 batches · 1.4–1.6 GB</p>
              </article>
              <article className="box">
                <h3>Cached Stage 2</h3>
                <div className="bar-track" style={{ margin: "0.45rem 0" }}>
                  <div className="bar-fill" style={{ width: "1.2%", background: "var(--onset)" }} />
                </div>
                <p>~4 s/epoch · batch 8 · 503 batches · ~0.05 GB · ~1100×</p>
              </article>
              <p className="caption" style={{ marginTop: 0 }}>
                Representative A100 logs, not a controlled benchmark. Cache stores
                embeddings, timestamps, labels, and auxiliary targets per video.
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
          <div className="grid-2 compact">
            <article className="box">
              <h3>Linear head on 768-d clips</h3>
              <p>
                Stage 1 is a single linear classifier on the VideoMAE embedding. It is
                not deployed. It exists to adapt the encoder to accident-onset clips
                and to emit the cache that Stage 2 searches over.
              </p>
              <p>
                Loss is balanced across three groups: negative-video clips, positive
                pre-onset clips, and positive post-onset clips — because post-onset
                positives would otherwise dominate.
              </p>
              <p>Best Stage 1 val: P 0.4974 · R 0.8362 · F1 0.6238.</p>
            </article>
            <article className="box">
              <h3>Onset spike vs cumulative step</h3>
              <p>Onset target: a delta at g. Cumulative: stay on after g.</p>
              <p className="caption" style={{ margin: "0.35rem 0 0" }}>onset spike</p>
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
                For the tested RGB Conv1D head, onset F1 0.6645 vs cumulative 0.7598
                (seed 2026, training-loop). The wide TP corridor rewards staying on,
                not peaking.
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
          <Head kicker="04" title="Dilated Conv1D over 12-clip windows — not a causal transformer" />
          <div className="split">
            <div>
              <p className="compact">
                Stage 2 consumes windows of 12 clip embeddings, stride 6. Three Conv1D
                layers with kernel 3, dilations 1/2/4, widths 512/512/256, GELU and
                dropout 0.1. Symmetric zero padding, so the head is not strictly causal.
                Receptive field: 15 clip steps ≈ 7 s at 0.5 s spacing.
              </p>
              <div className="stack" style={{ marginTop: "0.6rem" }}>
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
            <div className="compact" style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <article className="box">
                <h3>Three outputs</h3>
                <ul>
                  <li>per-step cumulative incident logits</li>
                  <li>one video-level logit after masked pooling</li>
                  <li>4-way temporal-distance bins per step</li>
                </ul>
              </article>
              <article className="box">
                <h3>Distance bins relative to g</h3>
                <ul>
                  <li>far before: t−g &lt; −5 s</li>
                  <li>near before: −5 ≤ t−g &lt; 0</li>
                  <li>near after: 0 ≤ t−g ≤ 5</li>
                  <li>far after: t−g &gt; 5</li>
                </ul>
              </article>
              <article className="box">
                <h3>Search-space note</h3>
                <p>
                  Tested transformer + cumulative, seed 2026, reached loop F1 0.6948 —
                  below the corresponding Conv1D recipe (0.7598).
                </p>
              </article>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "loss",
      title: "Loss and motion",
      node: (
        <>
          <Head kicker="04" title="Stage 2 loss, and the motion probe that did not survive aid-eval" />
          <div className="eq">L = L_step + λ<sub>v</sub> L_video + λ<sub>m</sub> L_mono + λ<sub>a</sub> L_aux</div>
          <div className="split">
            <div className="bars">
              {[
                ["L_step", "masked BCE on cumulative steps", 1, "var(--onset)"],
                ["λv L_video = 0.5", "video-level BCE after masked pooling", 0.5, "var(--accept)"],
                ["λa L_aux = 0.2", "cross-entropy on 4 distance bins", 0.2, "var(--clip)"],
                ["λm L_mono = 0.05", "penalize downward probability jumps", 0.05, "var(--warn)"],
              ].map(([lab, note, w, color]) => (
                <div className="bar-row" key={String(lab)} style={{ alignItems: "start" }}>
                  <span>
                    {lab}
                    <br />
                    <em style={{ fontStyle: "normal", color: "var(--muted)", fontSize: "0.68rem" }}>{note}</em>
                  </span>
                  <div className="bar-track" style={{ marginTop: "0.25rem" }}>
                    <div className="bar-fill" style={{ width: `${Number(w) * 100}%`, background: String(color) }} />
                  </div>
                  <span>{String(w)}</span>
                </div>
              ))}
            </div>
            <article className="box compact">
              <h3>Motion fusion (probe)</h3>
              <p>
                24-d handcrafted frame-difference descriptor → MLP to 768-d → learned
                gate vs RGB embedding → normalize → same temporal head. Intentionally
                not optical flow.
              </p>
              <p>
                Cached loop: motion seed 2026 reached 0.7651, slightly above RGB 0.7598.
                Full aid-eval: motion F1 0.7192 vs RGB 0.7756, because recall collapsed
                from 0.9324 to 0.7721.
              </p>
              <p>That disagreement is why final selection uses aid-eval, not the cache loop.</p>
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
          <Head kicker="05" title="Aggregate the whole video, then apply a recall-constrained threshold tuple" />
          <p className="compact">
            Overlapping windows of 12 clips, stride 6. Average per-timestamp step
            probabilities and average window-level video probabilities. Median filter
            of kernel 3. Then decode. This is not streaming.
          </p>
          <ScoreCurve />
          <div className="grid-4" style={{ marginTop: "0.65rem" }}>
            {[
              ["τempty", "0.20", "If the sequence never rises, emit no incident."],
              ["τstart", "0.70", "First crossing that can start an onset."],
              ["τkeep", "0.10", "Continuation floor; must be ≤ τstart."],
              ["τvideo", "0.00", "Video gate left off at the selected point."],
            ].map(([k, v, n]) => (
              <article className="box compact" key={k}>
                <h3>{k} = {v}</h3>
                <p>{n}</p>
              </article>
            ))}
          </div>
          <div className="grid-2 compact" style={{ marginTop: "0.65rem" }}>
            <article className="box">
              <h3>Sweep grid</h3>
              <p>τempty ∈ {"{0.2…0.6}"} · τstart ∈ {"{0.3…0.9}"} · τkeep ∈ {"{0.1…0.5}"} · τvideo ∈ {"{0.0, 0.3…0.9}"} · min consecutive ∈ {"{1,2,3,4}"}.</p>
              <p>Rank lexicographically by F1, then precision, then recall. Keep the best candidate with recall ≥ 0.90; else fall back to unconstrained best. Early-stopping patience is deferred until the floor has been met once.</p>
            </article>
            <article className="box">
              <h3>Selected operating point</h3>
              <p>τempty 0.20 · τstart 0.70 · τkeep 0.10 · τvideo 0.00 · min consecutive 1.</p>
              <p>Recipe <code>cached_conv_rgb_r90_s2026</code>: 20 epochs, patience 4, batch 8, AdamW 10⁻⁴, wd 0.05, cosine with 2 warmup epochs, video-balanced sampling.</p>
            </article>
          </div>
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
            <div className="knob">
              <div className="lbl">Backbone</div>
              <div className="val">VideoMAE</div>
            </div>
            <div className="knob">
              <div className="lbl">Windows</div>
              <div className="val">12 / 6</div>
            </div>
            <div className="knob">
              <div className="lbl">Recall floor</div>
              <div className="val">0.90</div>
            </div>
            <div className="knob">
              <div className="lbl">Selected seed</div>
              <div className="val">2026</div>
            </div>
          </div>
          <div className="split">
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
            <article className="box compact">
              <h3>Paired artifact</h3>
              <p>
                Full inference is not a single file. It loads
                <code> cached_conv_rgb_r90_s2026.pt</code> together with
                <code> stage1_best.pt</code>.
              </p>
              <p>
                Motion checkpoint tested in the same protocol:
                <code> cached_conv_motion_r90_s2026.pt</code>.
              </p>
              <p>
                Stage 1 itself: 10 epochs, backbone LR 10⁻⁵, head LR 10⁻⁴.
                Stage 2 head LR 10⁻⁴.
              </p>
            </article>
          </div>
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
            <div className="compact" style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <article className="box">
                <h3>Two numbers, not one</h3>
                <p>
                  <strong>Training-loop F1</strong> is the best threshold-swept score
                  during cached training. <strong>aid-eval F1</strong> reloads the paired
                  checkpoint and runs full-video inference on val.
                </p>
              </article>
              <article className="box">
                <h3>Recipe-level trends</h3>
                <p>Cumulative &gt; onset for RGB Conv1D. Conv1D &gt; the tested transformer. RGB cumulative seeds 1337/2026/3407: 0.7477 / 0.7598 / 0.7385 (mean 0.7487, sd ≈ 0.0087).</p>
              </article>
              <article className="box">
                <h3>Not clean ablations</h3>
                <p>Target, architecture, warm-start, and training path were not isolated independently. Read as search evidence, not single-factor claims.</p>
              </article>
            </div>
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
          <div className="compare" style={{ marginBottom: "0.7rem" }}>
            <article>
              <div className="kicker" style={{ marginBottom: 0 }}>Selected · RGB-only · seed 2026</div>
              <div className="val hot">0.7756</div>
              <p>P 0.6643 · R 0.9324. Recall holds the floor; this is the deployable checkpoint.</p>
            </article>
            <article>
              <div className="kicker" style={{ marginBottom: 0 }}>Motion fusion · seed 2026</div>
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
            Motion gained precision (0.6731 vs 0.6643) and lost much more recall. RGB-only is the selected deployable checkpoint.
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
          <div className="grid-3 compact">
            <article className="box fill-c">
              <h3>Associated factors</h3>
              <ul>
                <li>Stage 1 + Stage 2 give clip and sequence signal.</li>
                <li>Dilated conv smooths and decodes over ~7 s.</li>
                <li>Caching decouples search from video I/O.</li>
                <li>Recall-constrained thresholds match FN/FP asymmetry.</li>
              </ul>
            </article>
            <article className="box fill-d">
              <h3>Why cumulative can win</h3>
              <p>
                Out-of-window positives are FPs; only missing predictions are FNs.
                Staying on after onset is closer to the scoring rule than chasing a
                delta. RGB Conv1D cumulative 0.7598 vs onset 0.6645 (loop, seed 2026).
              </p>
            </article>
            <article className="box fill-b">
              <h3>Warm-start: no claim</h3>
              <p>
                Caches from adapted Stage 1 and from the unadapted pretrained encoder
                were numerically identical in the checked files. The paper does not
                claim a warm-start benefit from cached Stage 2 alone.
              </p>
            </article>
          </div>
          <div className="grid-3 compact" style={{ marginTop: "0.65rem" }}>
            <article className="box">
              <h3>Limitation · development protocol</h3>
              <p>Thresholds, early stopping, checkpoint choice, and reporting all reuse the same val split. These are not held-out challenge estimates.</p>
            </article>
            <article className="box">
              <h3>Limitation · offline</h3>
              <p>Non-causal aggregation over the full video. No score before ≈ 1.875 s. Not evidence about online anticipation.</p>
            </article>
            <article className="box">
              <h3>Open extensions</h3>
              <p>Learned motion / optical flow; object, trajectory, interaction modeling; cleaner single-factor ablations; external baselines; a true held-out evaluation.</p>
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
          <div className="split" style={{ marginTop: "0.85rem" }}>
            <div>
              <p className="lede">
                VideoMAE clip encoder + cached dilated Conv1D head + cumulative
                supervision + monotonic regularization + recall-constrained thresholds.
              </p>
              <p className="compact" style={{ marginTop: "0.8rem" }}>
                Cached development favored cumulative convolution over onset targets and
                over the tested transformer. Full end-to-end evaluation then selected
                RGB-only over lightweight motion fusion. For these experiments,
                full-protocol evaluation was required for checkpoint choice even though
                cached training was required to make search possible.
              </p>
            </div>
            <div className="metrics" style={{ maxWidth: "none", alignSelf: "start" }}>
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
