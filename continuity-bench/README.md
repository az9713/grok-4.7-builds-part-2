# Continuity Bench

Adversarial stills bench. A contact sheet, three skeptics (identity, wardrobe, lighting), red / green, fail-closed. Not a chat UI.

Built with Grok Build.

## View

Serve the repo (the UI fetches `fixtures/run.json`):

```
python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/continuity-bench/ui/`.

Golden fixture: `fixtures/run.json`. Canonical lock is the Sodium Night passenger. Four in-lock frames pass. Six adversary stills (Service Door operative, guard, lamp) fail identity and fail the run.

## Scoring

Threshold 0.80 on each axis. A frame fails if any skeptic fails. The run fails if any frame fails.
