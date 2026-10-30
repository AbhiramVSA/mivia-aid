# MIVIA-AID presentation

An interactive research deck about offline accident-onset timestamp estimation on MIVIA-AID. The work is by Adabala and Chakkaravarthy and uses VideoMAE with dilated temporal convolutions.

The companion [AID2026 research scaffold](https://github.com/AbhiramVSA/mivia-aid-dataset) contains the training and submission code.

## Navigate the deck

- Use the **Prev** and **Next** buttons, or click near the left or right edge of the page.
- Use the arrow keys, `PageUp` / `PageDown`, or `Space` to move between slides.
- Use `Home` and `End` to go to the first or last slide.
- Swipe left or right on a touch screen.
- Open a slide directly with its URL hash, such as `#3`.

## Run locally

This is a Next.js App Router project. The package manifest pins Bun as the package manager.

```bash
bun install
bun run dev
```

Open the local URL printed by Next.js. For a production build, run:

```bash
bun run build
bun run start
```
