import { Algorithm } from "@/components/Algorithm";
import {
  ClipTimeline,
  CumulativeLabels,
  DatasetChart,
  DecoderViz,
  DilatedConv,
  DualPipeline,
  FullEvalBars,
  LossWeights,
  MetricCases,
  OnsetCorridor,
  ProxyVsFull,
  SearchBars,
  TimingChart,
} from "@/components/Diagrams";
import { SiteNav } from "@/components/SiteNav";
import { DATASET, FULL_EVAL, PAPER, PROXY_VS_FULL, SEARCH_RUNS } from "@/lib/paper";

export default function Home() {
  return (
    <>
      <a className="skip" href="#abstract">
        Skip to content
      </a>
      <header className="topbar">
        <div className="kicker">Adabala and Chakkaravarthy · MIVIA-AID</div>
        <div className="topbar-meta">
          <span>VideoMAE-base</span>
          <span>Dilated Conv1D</span>
          <span>Offline protocol</span>
        </div>
      </header>

      <div className="layout">
        <SiteNav />
        <main className="main">
          <header className="hero">
            <div className="eyebrow">
              <span>Surveillance video</span>
              <span>Accident-onset estimation</span>
              <span>Development-set protocol</span>
            </div>
            <h1>{PAPER.shortTitle} on MIVIA-AID</h1>
            <p className="lede" style={{ marginTop: "1.2rem", maxWidth: "38rem" }}>
              A two-stage, offline pipeline: adapt VideoMAE with clip-level cumulative
              supervision, then train a dilated temporal head on cached embeddings and
              decode a timestamp only after full-video aggregation.
            </p>
            <div className="authors">
              {PAPER.authors.map((author) => (
                <div key={author.name}>{author.name}</div>
              ))}
            </div>
            <div className="readouts" aria-label="Selected checkpoint metrics">
              <div className="readout">
                <div className="label">Precision</div>
                <div className="value">{PAPER.metrics.precision.toFixed(4)}</div>
              </div>
              <div className="readout">
                <div className="label">Recall</div>
                <div className="value">{PAPER.metrics.recall.toFixed(4)}</div>
              </div>
              <div className="readout selected">
                <div className="label">F1 · selected RGB</div>
                <div className="value">{PAPER.metrics.f1.toFixed(4)}</div>
              </div>
            </div>
          </header>

          <section className="section" id="abstract">
            <div className="section-head">
              <span className="num">00</span>
              <h2>Abstract</h2>
            </div>
            <div className="prose">
              <p>
                <span className="drop">T</span>
                his paper presents a two-stage pipeline for offline accident-onset
                timestamp estimation on the MIVIA-AID validation split. The system
                combines a pretrained VideoMAE clip encoder with a dilated temporal
                head trained on overlapping video windows. Stage 1 adapts the encoder
                using clip-level cumulative supervision. Stage 2 trains a temporal
                model on top of per-clip embeddings, using a cached-feature path to
                make threshold and architecture sweeps feasible under heavy video I/O
                cost.
              </p>
              <p>
                The selected model uses an RGB-only temporal convolution head with
                cumulative targets, auxiliary video-level supervision, monotonic
                regularization, and recall-constrained threshold selection. On the
                validation-set end-to-end protocol used throughout this work, the
                final checkpoint achieves precision 0.6643, recall 0.9324, and F1
                0.7756.
              </p>
              <p>
                A lightweight motion-fusion extension was also evaluated. Although the
                tested motion branch improved some cached-search runs, the evaluated
                motion-fusion checkpoint underperformed the selected RGB-only model
                under end-to-end full-video evaluation. Within the reported MIVIA-AID
                validation experiments, the strongest selected checkpoint used
                cumulative supervision, a dilated temporal convolution head, and
                full-protocol checkpoint selection.
              </p>
            </div>

            <div className="grid-2">
              <article className="card">
                <h3>Contributions</h3>
                <ol>
                  <li>A complete two-stage pipeline derived from the implemented system.</li>
                  <li>Exact metric, aggregation path, and model-selection rule for the reported F1.</li>
                  <li>Evidence that cached temporal training made architecture search practical.</li>
                  <li>RGB-only vs. lightweight motion fusion under full evaluation, with RGB selected.</li>
                </ol>
              </article>
              <article className="card">
                <h3>Operating regime</h3>
                <p>
                  The selected system is offline, not streaming. Stage 2 uses symmetric
                  temporal convolutions over overlapping windows. Final decoding runs
                  after aggregating scores across the full video. The first complete
                  clip endpoint occurs at approximately 1.875 seconds, so the task is
                  incident declaration / onset timestamp estimation, not early
                  anticipation.
                </p>
              </article>
            </div>
          </section>

          <section className="section" id="problem">
            <div className="section-head">
              <span className="num">01</span>
              <h2>Problem setup</h2>
            </div>
            <div className="prose">
              <p className="lede">
                Accident analysis in surveillance video requires more than binary
                video classification: the system must decide when to declare the
                incident.
              </p>
              <p>
                Training and evaluation are constrained by three factors. Long videos
                make raw end-to-end experimentation slow. The evaluation metric
                rewards stable post-onset declaration more than precise sub-second
                localization. The training split is class-imbalanced at the video
                level. These constraints shaped the final system more strongly than
                architectural novelty. The main bottleneck was not GPU memory, but
                video decoding, preprocessing, and dataloader contention.
              </p>
              <h3>Dataset and splits</h3>
              <p>
                All experiments use the annotation and file conventions in the
                codebase and the public MIVIA dataset release. Training labels come
                from <code>Train_GT.csv</code>; validation labels come from{" "}
                <code>Val_GT.csv</code>. Timestamps are parsed from mm:ss strings into
                integer seconds.
              </p>
            </div>

            <figure className="figure">
              <DatasetChart />
              <figcaption>
                Table I. Dataset statistics extracted from the annotation files. The
                training set is strongly positive-skewed (959 / 287), while the
                validation set is balanced at the video level (155 / 155).
              </figcaption>
            </figure>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Split</th>
                    <th className="num">Videos</th>
                    <th className="num">Positive</th>
                    <th className="num">Negative</th>
                    <th className="num">Mean duration (s)</th>
                    <th className="num">Median onset (s)</th>
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
                      <td className="num">{row.medianOnset}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose">
              <h3>Related context</h3>
              <p>
                The work sits at the intersection of accident anticipation, temporal
                event localization, and surveillance anomaly detection. Prior traffic
                anticipation systems such as DSTA and DRIVE target egocentric or
                dashcam video and reward earliest possible prediction. The present
                setting uses fixed surveillance-style videos and accepts a broad
                post-onset interval. Weakly supervised anomaly scoring (Sultani et
                al.), UntrimmedNet, and ActionFormer provide broader context for
                window-level scoring, but they are not directly comparable to this
                benchmark.
              </p>
            </div>
          </section>

          <section className="section" id="metric">
            <div className="section-head">
              <span className="num">02</span>
              <h2>Evaluation metric</h2>
            </div>
            <div className="prose">
              <p>
                The implemented validation metric differs from a standard temporal
                localization metric and must be stated precisely. Let <em>g</em> be
                the annotated onset time and <em>ĝ</em> the predicted onset. Labels
                are given at integer-second granularity.
              </p>
            </div>

            <figure className="figure">
              <OnsetCorridor />
              <figcaption>
                A true positive is counted only if the video is positive and the
                prediction falls in the closed interval [g − 1, g + 30] seconds. The
                corridor is wide on purpose: the protocol accepts stable post-onset
                declaration rather than sub-second localization.
              </figcaption>
            </figure>

            <figure className="figure">
              <MetricCases />
              <figcaption>
                Asymmetry in error accounting. Missing predictions affect recall
                directly. Mistimed positive predictions mainly affect precision. Only
                the absence of a prediction on a positive video counts as a false
                negative.
              </figcaption>
            </figure>

            <div className="eq" aria-label="Precision, recall, and F1">
              Precision = TP / (TP + FP) &nbsp;·&nbsp; Recall = TP / (TP + FN)
              &nbsp;·&nbsp; F1 = 2PR / (P + R)
            </div>

            <div className="callout">
              <strong>Temporal resolution limit</strong>
              Frames are sampled at 8 FPS and each clip contains 16 sampled frames, so
              the first complete clip endpoint occurs at approximately 1.875 seconds.
              The model cannot emit any score before that time. Given median positive
              onsets of 2 s in training and 1 s in validation, the implemented task is
              better described as benchmark-specific incident declaration than as
              early accident anticipation.
            </div>
          </section>

          <section className="section" id="pipeline">
            <div className="section-head">
              <span className="num">03</span>
              <h2>End-to-end pipeline</h2>
            </div>
            <div className="prose">
              <p className="lede">
                Search and deployment are two different computation graphs that share
                one selected temporal head.
              </p>
              <p>
                During model selection, Stage 2 is trained primarily on cached clip
                embeddings extracted from the adapted Stage 1 encoder. For full-video
                inference, that head is paired with the Stage 1 encoder, overlapping
                window predictions are averaged by timestamp, window-level video
                logits are averaged across windows, and the same thresholded decoding
                logic is applied.
              </p>
            </div>

            <figure className="figure">
              <DualPipeline />
              <figcaption>
                Figure 1. Left: cached Stage 2 training extracts clip embeddings once
                and reuses them for temporal-model and threshold search. Right: full
                inference recomputes encoder features online, scores overlapping
                windows, averages timestamp-level and video-level outputs, then
                applies the selected decoding rule.
              </figcaption>
            </figure>

            <figure className="figure">
              <ClipTimeline />
              <figcaption>
                Shared video front end. Videos are decoded with OpenCV, sampled at 8
                FPS, and packed into causal 16-frame clips whose endpoints are 0.5
                seconds apart. The VideoMAE encoder returns a 768-dimensional
                embedding per clip.
              </figcaption>
            </figure>

            <figure className="figure">
              <TimingChart />
              <figcaption>
                Table III. Representative A100 log measurements. Cached Stage 2
                training dropped epoch time from about 74 minutes to about 4 seconds
                and GPU memory from 1.4–1.6 GB to ~0.05 GB, making architecture and
                threshold sweeps practical.
              </figcaption>
            </figure>
          </section>

          <section className="section" id="method">
            <div className="section-head">
              <span className="num">04</span>
              <h2>Method</h2>
            </div>
            <div className="prose">
              <h3>Stage 1 · clip-level encoder adaptation</h3>
              <p>
                Stage 1 places a single linear classifier on the clip embedding{" "}
                <em>x<sub>t</sub></em>:
              </p>
            </div>
            <div className="eq">z<sub>t</sub> = wᵀ x<sub>t</sub> + b</div>
            <div className="prose">
              <p>
                The target is cumulative: y<sub>t</sub> = 1 if t ≥ g, and 0 otherwise.
                To counteract the strong positive skew and the large number of
                post-onset positive clips, the loss is balanced across three groups:
                clips from negative videos, clips from positive videos before onset,
                and clips from positive videos after onset.
              </p>
              <p>
                Stage 1 is not the deployed model. Its role is to adapt the encoder to
                the accident-onset domain. The best Stage 1 checkpoint reached
                precision 0.4974, recall 0.8362, and F1 0.6238 on the validation
                split.
              </p>
            </div>

            <figure className="figure">
              <CumulativeLabels />
              <figcaption>
                Why cumulative targets fit this metric. A prediction is accepted over
                a broad post-onset interval, so the model benefits more from learning
                stable activation after onset than from a sharp delta-like peak. For
                the tested RGB-only Conv1D head, cumulative supervision produced
                substantially higher validation F1 than onset-style supervision.
              </figcaption>
            </figure>

            <div className="prose">
              <h3>Stage 2 · dilated temporal head</h3>
              <p>
                Stage 2 consumes overlapping windows of 12 clip embeddings. The
                selected head is a three-layer dilated Conv1D with hidden widths
                512 / 512 / 256, GELU, and dropout 0.1 after each convolution. The
                implementation uses symmetric zero padding rather than left-only
                causal padding, so the head is a dilated temporal convolution, not a
                strictly causal model. The receptive field is 15 clip steps,
                approximately 7 seconds at 0.5-second spacing.
              </p>
              <p>The head predicts three outputs:</p>
              <ul>
                <li>per-step logits for cumulative incident activation</li>
                <li>an auxiliary video-level incident logit after masked temporal pooling</li>
                <li>a 4-way temporal-distance bin logit per step</li>
              </ul>
              <p>Distance bins relative to ground-truth onset g:</p>
              <ul>
                <li>far before: t − g &lt; −5 s</li>
                <li>near before: −5 ≤ t − g &lt; 0</li>
                <li>near after: 0 ≤ t − g ≤ 5</li>
                <li>far after: t − g &gt; 5</li>
              </ul>
            </div>

            <figure className="figure">
              <DilatedConv />
              <figcaption>
                Selected Conv1D stack: 768→512 (dilation 1), 512→512 (dilation 2),
                512→256 (dilation 4), kernel size 3 throughout.
              </figcaption>
            </figure>

            <figure className="figure">
              <LossWeights />
              <figcaption>
                Stage 2 objective for the selected RGB model. L_step is masked binary
                cross-entropy over cumulative step labels. L_mono penalizes downward
                transitions in consecutive cumulative probabilities.
              </figcaption>
            </figure>

            <div className="prose">
              <h3>Motion-fusion probe</h3>
              <p>
                A lightweight motion branch was implemented as a controlled extension.
                For each clip, frame differences are summarized into a 24-dimensional
                handcrafted descriptor. A small MLP maps this descriptor into the
                768-dimensional hidden space, a learned gate modulates motion relative
                to the RGB embedding, and the fused representation is normalized
                before temporal modeling. It was treated as a probe for whether
                explicit motion cues help under the current training and evaluation
                setup—not as a full optical-flow stream.
              </p>
            </div>
          </section>

          <section className="section" id="algorithm">
            <div className="section-head">
              <span className="num">05</span>
              <h2>Inference algorithm</h2>
            </div>
            <div className="prose">
              <p>
                Inference does not output a single onset time directly. It produces a
                sequence of step scores, then applies median filtering (kernel 3), a
                no-incident rejection threshold τ<sub>empty</sub>, a start threshold
                τ<sub>start</sub>, an optional continuation threshold τ<sub>keep</sub>
                , an auxiliary video threshold τ<sub>video</sub>, and a
                minimum-consecutive-step rule.
              </p>
              <p>
                Overlapping Stage 2 windows of length 12 and stride 6 are merged by
                averaging per-timestamp probabilities and averaging window-level video
                probabilities. Decoding is therefore performed after full-video
                scoring rather than in an online streaming manner.
              </p>
            </div>

            <figure className="figure">
              <DecoderViz />
              <figcaption>
                Selected operating point: τempty = 0.20, τstart = 0.70, τkeep = 0.10,
                τvideo = 0.00, min consecutive = 1. Candidates are ranked
                lexicographically by F1, then precision, then recall, subject to a
                recall floor of 0.90.
              </figcaption>
            </figure>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Setting</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Backbone</td>
                    <td>MCG-NJU/videomae-base</td>
                  </tr>
                  <tr>
                    <td>Input sampling</td>
                    <td>8 FPS, 16 frames per clip, 0.5-second clip spacing</td>
                  </tr>
                  <tr>
                    <td>Stage 1</td>
                    <td>10 epochs; learning rates 10⁻⁵ backbone and 10⁻⁴ head</td>
                  </tr>
                  <tr>
                    <td>Stage 2 head</td>
                    <td>3-layer dilated Conv1D, widths 512/512/256, dropout 0.1</td>
                  </tr>
                  <tr>
                    <td>Stage 2 windows</td>
                    <td>12 steps per window with stride 6</td>
                  </tr>
                  <tr>
                    <td>Stage 2 training</td>
                    <td>cached temporal-head training, batch size 8, video-balanced sampling</td>
                  </tr>
                  <tr>
                    <td>Optimization</td>
                    <td>AdamW, head LR 10⁻⁴, weight decay 0.05, cosine schedule, 2 warmup epochs</td>
                  </tr>
                  <tr>
                    <td>Loss weights</td>
                    <td>λvideo = 0.5, λmono = 0.05, λaux = 0.2</td>
                  </tr>
                  <tr>
                    <td>Selection</td>
                    <td>early-stopping patience 4, seed 2026, best F1 subject to recall ≥ 0.90</td>
                  </tr>
                  <tr>
                    <td>Decoding thresholds</td>
                    <td>τempty = 0.20, τstart = 0.70, τkeep = 0.10, τvideo = 0.00, min consecutive = 1</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Algorithm />

            <div className="chips" aria-label="Selected configuration">
              <span className="chip">Backbone {PAPER.backbone}</span>
              <span className="chip">Windows 12 / stride 6</span>
              <span className="chip">AdamW 10⁻⁴ · wd 0.05</span>
              <span className="chip">Seed 2026</span>
              <span className="chip">Recall floor 0.90</span>
              <span className="chip">{PAPER.checkpoint}</span>
              <span className="chip">{PAPER.encoder}</span>
            </div>
          </section>

          <section className="section" id="results">
            <div className="section-head">
              <span className="num">06</span>
              <h2>Results</h2>
            </div>
            <div className="prose">
              <p className="lede">
                Two classes of numbers appear in the paper. They are not interchangeable.
              </p>
              <ul>
                <li>
                  <strong>Training-loop validation</strong> — the best threshold-swept
                  F1 observed during model training.
                </li>
                <li>
                  <strong>Full evaluation</strong> — aid-eval, which loads a checkpoint
                  and runs the end-to-end inference pipeline across the validation set.
                </li>
              </ul>
              <p>
                The final model is chosen using full evaluation. Those numbers remain
                development-set results: the same labeled validation split is reused
                for threshold selection, early stopping, checkpoint selection, and
                final reporting.
              </p>
            </div>

            <figure className="figure">
              <SearchBars />
              <figcaption>
                Table IV. Representative development-search runs. Target formulation,
                temporal architecture, warm-starting, and training path were not all
                isolated independently. Read as recipe-level trends inside the reported
                search space, not as clean single-factor ablations.
              </figcaption>
            </figure>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>Seed</th>
                    <th className="num">Best loop F1</th>
                  </tr>
                </thead>
                <tbody>
                  {SEARCH_RUNS.map((row) => (
                    <tr key={`${row.variant}-${row.seed}`}>
                      <td>{row.variant}</td>
                      <td>{row.seed}</td>
                      <td className="num">{row.f1.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stat-row">
              <div className="stat">
                <b>0.7487</b>
                <span>Mean RGB cumulative Conv F1 across 3 seeds</span>
              </div>
              <div className="stat">
                <b>0.0087</b>
                <span>Approx. std. of those three loop F1 values</span>
              </div>
              <div className="stat">
                <b>0.6238</b>
                <span>Stage 1 clip baseline F1</span>
              </div>
              <div className="stat">
                <b>0.90</b>
                <span>Recall floor used for selection</span>
              </div>
            </div>

            <figure className="figure">
              <FullEvalBars />
              <figcaption>
                Table V. Validation-split end-to-end results from aid-eval. The
                RGB-only checkpoint is the selected architecture: highest recall and
                highest F1 among evaluated deployable checkpoints.
              </figcaption>
            </figure>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>Seed</th>
                    <th className="num">Precision</th>
                    <th className="num">Recall</th>
                    <th className="num">F1</th>
                  </tr>
                </thead>
                <tbody>
                  {FULL_EVAL.map((row) => (
                    <tr key={row.variant} className={row.selected ? "selected" : undefined}>
                      <td>
                        {row.variant}
                        {row.selected ? " · selected" : ""}
                      </td>
                      <td>{row.seed}</td>
                      <td className="num">{row.precision.toFixed(4)}</td>
                      <td className="num">{row.recall.toFixed(4)}</td>
                      <td className="num">{row.f1.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figure className="figure">
              <ProxyVsFull />
              <figcaption>
                Table VI. Cached-search ranking and full-evaluation ranking can
                diverge. Motion fusion looked strongest in the training loop (0.7651)
                and then dropped to 0.7192 under aid-eval. RGB seed 2026 improved from
                0.7598 to 0.7756. That disagreement is why the paper selects
                checkpoints with the full protocol.
              </figcaption>
            </figure>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>Seed</th>
                    <th className="num">Train-loop F1</th>
                    <th className="num">Full aid-eval F1</th>
                  </tr>
                </thead>
                <tbody>
                  {PROXY_VS_FULL.map((row) => (
                    <tr key={`${row.variant}-${row.seed}`}>
                      <td>{row.variant}</td>
                      <td>{row.seed}</td>
                      <td className="num">{row.train.toFixed(4)}</td>
                      <td className="num">{row.full.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="section" id="discussion">
            <div className="section-head">
              <span className="num">07</span>
              <h2>Discussion</h2>
            </div>
            <div className="prose">
              <p>
                Several factors were associated with the selected pipeline in the
                reported runs. The Stage 1 encoder and Stage 2 temporal head together
                provide usable clip-level and sequence-level signal. Stage 2 supplies
                dilated temporal smoothing and onset decoding across clip sequences.
                Cached training decouples architecture search from the raw video I/O
                bottleneck. Recall-constrained threshold selection produced operating
                points compatible with the benchmark’s asymmetric error profile.
              </p>
              <h3>Why cumulative supervision aligns with this metric</h3>
              <p>
                Because a prediction is accepted over a broad post-onset interval, the
                model can benefit more from learning stable activation after onset
                than from learning a sharp peak. Out-of-window positive predictions
                count as false positives, while only missing predictions count as
                false negatives. Under that accounting, stable but selective
                post-onset detection can be more valuable than aggressive boundary
                chasing.
              </p>
              <h3>Systems lesson</h3>
              <p>
                Training logs showed that raw Stage 2 training was CPU- and I/O-bound
                rather than GPU-memory-bound. GPU memory stayed around 1.4–1.6 GB on
                the A100 runs while data loading and decoding dominated wall-clock
                time. Without the cached-feature path, the reported search loop would
                have been much slower.
              </p>
              <h3>Conclusion</h3>
              <p>
                The final system combines a VideoMAE clip encoder with a
                cached-trained dilated temporal convolution head, cumulative
                supervision, monotonic regularization, and recall-constrained
                threshold selection. On the validation-set full-evaluation protocol,
                the selected RGB-only encoder-plus-head pair achieved precision
                0.6643, recall 0.9324, and F1 0.7756. Cached development runs favored
                cumulative supervision and a dilated convolutional temporal head,
                while full end-to-end evaluation selected RGB-only over the tested
                lightweight motion-fusion alternative. Full-protocol evaluation was
                necessary for final checkpoint selection even when cached training
                made architecture search practical.
              </p>
              <div className="callout">
                <strong>Warm-start comparison was not informative</strong>
                One reproduced cache comparison extracted features from the adapted
                Stage 1 encoder and from the unadapted pretrained encoder. In the
                checked files, per-video feature tensors were numerically identical
                across those two roots. The paper therefore does not draw a warm-start
                conclusion from cached Stage 2 alone.
              </div>
            </div>
          </section>

          <section className="section" id="limitations">
            <div className="section-head">
              <span className="num">08</span>
              <h2>Limitations</h2>
            </div>
            <div className="prose">
              <p>
                Reported numbers are development-set results on the validation split
                used throughout the codebase. That split is reused for threshold
                tuning, early stopping, checkpoint selection, and final reporting, so
                the results should be read as validation-protocol results rather than
                held-out challenge estimates.
              </p>
              <p>
                The selected system is offline and non-causal: it aggregates scores
                across the full video before decoding and cannot emit any score before
                approximately 1.875 seconds. The paper is evidence about offline onset
                timestamp estimation under the MIVIA-AID protocol, not about online
                accident anticipation.
              </p>
              <p>
                The motion branch is intentionally lightweight—a 24-dimensional
                frame-difference descriptor rather than a learned motion encoder.
                Stronger motion streams, object/trajectory modeling, external
                baselines, cleaner single-factor comparisons, and a held-out benchmark
                evaluation remain open.
              </p>
            </div>
          </section>

          <section className="section" id="references">
            <div className="section-head">
              <span className="num">09</span>
              <h2>References</h2>
            </div>
            <ol className="refs">
              <li>
                <span>[1]</span>
                <span>
                  Z. Tong, Y. Song, J. Wang, and L. Wang, “VideoMAE: Masked
                  autoencoders are data-efficient learners for self-supervised video
                  pre-training,” NeurIPS, 2022.
                </span>
              </li>
              <li>
                <span>[2]</span>
                <span>
                  K. He, X. Chen, S. Xie, Y. Li, P. Dollár, and R. Girshick, “Masked
                  autoencoders are scalable vision learners,” CVPR, 2022.
                </span>
              </li>
              <li>
                <span>[3]</span>
                <span>
                  W. Sultani, C. Chen, and M. Shah, “Real-world anomaly detection in
                  surveillance videos,” CVPR, 2018.
                </span>
              </li>
              <li>
                <span>[4]</span>
                <span>
                  W. Bao, Q. Yu, and Y. Kong, “DRIVE: Deep reinforced accident
                  anticipation with visual explanation,” ICCV, 2021.
                </span>
              </li>
              <li>
                <span>[5]</span>
                <span>
                  M. M. Karim, Y. Li, R. Qin, and Z. Yin, “A dynamic spatial-temporal
                  attention network for early anticipation of traffic accidents,”
                  arXiv:2106.10197, 2021.
                </span>
              </li>
              <li>
                <span>[6]</span>
                <span>
                  L. Wang, Y. Xiong, D. Lin, and L. Van Gool, “UntrimmedNets for weakly
                  supervised action recognition and detection,” CVPR, 2017.
                </span>
              </li>
              <li>
                <span>[7]</span>
                <span>
                  C. Zhang, J. Wu, and Y. Li, “ActionFormer: Localizing moments of
                  actions with transformers,” ECCV, 2022.
                </span>
              </li>
              <li>
                <span>[8]</span>
                <span>
                  MIVIA Lab, “Public datasets,” University of Salerno.{" "}
                  <a href={PAPER.datasetUrl} rel="noreferrer" target="_blank">
                    mivia.unisa.it/datasets
                  </a>
                  . Implementation repository:{" "}
                  <a href={PAPER.github} rel="noreferrer" target="_blank">
                    github.com/AbhiramVSA/mivia-aid-dataset
                  </a>
                  .
                </span>
              </li>
            </ol>
          </section>

          <footer className="footer">
            <span>Adabala · Chakkaravarthy · MIVIA-AID presentation</span>
            <span>Selected checkpoint F1 0.7756 · validation protocol</span>
          </footer>
        </main>
      </div>
    </>
  );
}
