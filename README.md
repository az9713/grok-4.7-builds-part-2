# Grok 4.7 builds, part 2

Forty-two browser slices in this repository. Eight are round 1. Ten are round 2. Four are round 3. Four are round 4. Four are round 5. Four are round 6. Four are round 7. Four are round 8. The license is MIT.

This repository is separate from [az9713/grok-4.7-builds](https://github.com/az9713/grok-4.7-builds). That repository holds forty-five variations of the Top 15 video. This repository holds the showcase slices: playable rooms, film players, catalogs, and two saved workflow replays.

The slices show Imagine locks, harvested animation, and Rhai workflows.

## Live page

The GitHub Pages site is [https://az9713.github.io/grok-4.7-builds-part-2/](https://az9713.github.io/grok-4.7-builds-part-2/).

`index.html` is the live page. Each card says what the slice is. The orange line names the controls.

[What each build is](builds.html) explains all forty-two pages. The twenty-four games have their rules on that page.

## Open locally

```
python3 -m http.server 8766
```

Open http://127.0.0.1:8766/. A direct file open can break a page that loads JSON.

`server.py` listens on port 8765. The script saves `questionnaire.html` into `answers.json`. GitHub Pages does not run `server.py`.

## Slices

| # | Live page | What it is |
|---|-----------|------------|
| 1 | [service-door/play/](https://az9713.github.io/grok-4.7-builds-part-2/service-door/play/) | Playable infiltration slice (WASD, Space, lift) |
| 2 | [service-door-reel/play/](https://az9713.github.io/grok-4.7-builds-part-2/service-door-reel/play/) | Trailer player from the same lock |
| 3 | [locksmith/ui/](https://az9713.github.io/grok-4.7-builds-part-2/locksmith/ui/) | Watchable art-bible DAG + Rhai |
| 4 | [phylum-tray/play/](https://az9713.github.io/grok-4.7-builds-part-2/phylum-tray/play/) | Creature lab, eight edit-chained morphs |
| 5 | [sodium-night/play/](https://az9713.github.io/grok-4.7-builds-part-2/sodium-night/play/) | Six-shot original short |
| 6 | [closed-stack/](https://az9713.github.io/grok-4.7-builds-part-2/closed-stack/) | Press site for Service Door |
| 7 | [continuity-bench/ui/](https://az9713.github.io/grok-4.7-builds-part-2/continuity-bench/ui/) | Adversarial stills bench |
| 8 | [gimbal-goods/play/](https://az9713.github.io/grok-4.7-builds-part-2/gimbal-goods/play/) | Lamp catalog + cart |
| 9 | [twin-orbit/play/](https://az9713.github.io/grok-4.7-builds-part-2/twin-orbit/play/) | Two locked heroes hand a battery across a gap |
| 10 | [yard-ledger/play/](https://az9713.github.io/grok-4.7-builds-part-2/yard-ledger/play/) | Isometric railyard occupancy ledger |
| 11 | [ash-court/play/](https://az9713.github.io/grok-4.7-builds-part-2/ash-court/play/) | Eighteen-card woodcut microgame |
| 12 | [glass-index/](https://az9713.github.io/grok-4.7-builds-part-2/glass-index/) | Museum collection, one sculpture |
| 13 | [dieline-press/play/](https://az9713.github.io/grok-4.7-builds-part-2/dieline-press/play/) | Bottle colorways + SVG dieline |
| 14 | [night-shift-os/play/](https://az9713.github.io/grok-4.7-builds-part-2/night-shift-os/play/) | Diegetic desktop, phosphor icons |
| 15 | [kiln-reel/play/](https://az9713.github.io/grok-4.7-builds-part-2/kiln-reel/play/) | Process film of one pot |
| 16 | [cutaway-house/play/](https://az9713.github.io/grok-4.7-builds-part-2/cutaway-house/play/) | House lock, click-to-enter rooms |
| 17 | [broadcast-kit/play/](https://az9713.github.io/grok-4.7-builds-part-2/broadcast-kit/play/) | Kite FC overlay package |
| 18 | [swarm-brief/ui/](https://az9713.github.io/grok-4.7-builds-part-2/swarm-brief/ui/) | Rhai swarm + waterline explainer |
| 19 | [apsis/play/](https://az9713.github.io/grok-4.7-builds-part-2/apsis/play/) | Orbit plot. Two prograde burns round a higher circle |
| 20 | [spillway/play/](https://az9713.github.io/grok-4.7-builds-part-2/spillway/play/) | Roof-flow puzzle. Keep the archive dry |
| 21 | [sort-case/play/](https://az9713.github.io/grok-4.7-builds-part-2/sort-case/play/) | Letterpress ticket. Mirrored metal, right-reading proof |
| 22 | [partial/play/](https://az9713.github.io/grok-4.7-builds-part-2/partial/play/) | Four-sine instrument and a bowed loudness curve |
| 23 | [snell/play/](https://az9713.github.io/grok-4.7-builds-part-2/snell/play/) | Refraction bench. Bend one ray onto a bell |
| 24 | [traverse/play/](https://az9713.github.io/grok-4.7-builds-part-2/traverse/play/) | Survey chain around a pond |
| 25 | [heddle/play/](https://az9713.github.io/grok-4.7-builds-part-2/heddle/play/) | Four-shaft loom. Weave a 2/2 twill |
| 26 | [hour-angle/play/](https://az9713.github.io/grok-4.7-builds-part-2/hour-angle/play/) | Courtyard dial from latitude, day, and hour |
| 27 | [cam/play/](https://az9713.github.io/grok-4.7-builds-part-2/cam/play/) | Plate cam. Match a rise, dwell, and fall |
| 28 | [pendulum/play/](https://az9713.github.io/grok-4.7-builds-part-2/pendulum/play/) | Double pendulum. RK4 and a live energy number |
| 29 | [chroma/play/](https://az9713.github.io/grok-4.7-builds-part-2/chroma/play/) | CIE 1931 wavelength as a clipped sRGB patch |
| 30 | [settle/play/](https://az9713.github.io/grok-4.7-builds-part-2/settle/play/) | RC step. Hit 6.32 V at one second |
| 31 | [malus/play/](https://az9713.github.io/grok-4.7-builds-part-2/malus/play/) | Analyzer angle. Intensity is cos squared |
| 32 | [doppler/play/](https://az9713.github.io/grok-4.7-builds-part-2/doppler/play/) | Moving 500 Hz source. Hit 531.25 Hz |
| 33 | [bridge/play/](https://az9713.github.io/grok-4.7-builds-part-2/bridge/play/) | Wheatstone bridge. Null the galvanometer |
| 34 | [string/play/](https://az9713.github.io/grok-4.7-builds-part-2/string/play/) | Standing wave. Put a node on the chalk mark |
| 35 | [lens/play/](https://az9713.github.io/grok-4.7-builds-part-2/lens/play/) | Thin lens. Put the image on the 60 cm screen |
| 36 | [decay/play/](https://az9713.github.io/grok-4.7-builds-part-2/decay/play/) | Half-life. Leave 100 counts at 12 hours |
| 37 | [draft/play/](https://az9713.github.io/grok-4.7-builds-part-2/draft/play/) | Box hull. Set the waterline on the chalk |
| 38 | [shot/play/](https://az9713.github.io/grok-4.7-builds-part-2/shot/play/) | Level-ground shot. Land on 34.64 m |
| 39 | [beats/play/](https://az9713.github.io/grok-4.7-builds-part-2/beats/play/) | Two tones. Set the beat to 4 Hz |
| 40 | [boyle/play/](https://az9713.github.io/grok-4.7-builds-part-2/boyle/play/) | Fixed-temperature gas. Hit 250 kPa |
| 41 | [lever/play/](https://az9713.github.io/grok-4.7-builds-part-2/lever/play/) | Balance beam. Level a 24 cm arm |
| 42 | [rod/play/](https://az9713.github.io/grok-4.7-builds-part-2/rod/play/) | Thermal rod. Meet a stop at 1002.00 mm |

Round-1 stills: `_shared/locks/`. Round-2 stills: `_shared/locks-r2/`. Specs: `SHOWCASE.md`, `round-2-proposal.html`.

Unity C# for Service Door is under `service-door/Assets`. Visitors play the web slice. Visitors do not need the Unity editor.

## License

MIT. See [LICENSE](LICENSE).
