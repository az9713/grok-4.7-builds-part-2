# Service Door

Night-shift contractor. Brutalist archive. One guard. One freight lift.

Play the vertical slice in a browser (no Unity required):

```
python -m http.server 8766
```

Then open `http://127.0.0.1:8766/service-door/play/` from the repo root.

WASD move, Space takedown plays the strike sheet, reach the lift after the guard is down, R restart.

## What is Grok-only here

Hero idle and walk sheets were generated from one Imagine lock, animated with `image_to_video`, harvested, and chroma-keyed. The guard is a second lock. Codex or Claude can ship this room; they cannot ship this face across idle, walk, and stills from the same harness.

## Unity

C# for the same slice lives in `Assets/Scripts`. Open the folder in Unity 6000.5.7f1 (or any 6.x 2D) and wire the scene to the scripts. The visitor play path is the web build in `play/`.

## License

MIT. No secrets. Art records in `art-record/` contain prompts' outputs only.
