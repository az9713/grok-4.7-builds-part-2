# Grok Build showcase

Public MIT portfolio. Eight greenfield projects, two per domain. This repo will be pushed as-is; no personal paths, names, emails, or secrets.

Built to show what Grok Build can do that Codex and Claude Code cannot do in one harness: native Imagine (`image_gen` / `image_edit`), video (`image_to_video` / `reference_to_video`), identity-locked game assets, and Rhai workflow fan-out. Every project still has a real coding half a rival agent could attempt — they lose on the Grok-only surface.

The round-1 hold is closed. The tree now has one hundred thirty-eight slices. `README.md` is the current index. The eight rows below are the round-1 spec.

| # | Folder | Domain | One-line |
|---|--------|--------|----------|
| 1 | `service-door/` | Game | Unity 2D infiltration slice. Locked operative, tileset, harvested cycles, one room. |
| 2 | `service-door-reel/` | Film | Trailer cut from the same locks. HTML player with storyboard vs footage. |
| 3 | `locksmith/` | Multi-agent | Watchable Rhai DAG that generates, verifies, and manifests the art bible. |
| 4 | `phylum-tray/` | Game | Browser creature lab. One ancestor, eight edit-chained morphs, terrarium. |
| 5 | `sodium-night/` | Film | Six-shot original short. Last-frame continuity. Not a game trailer. |
| 6 | `closed-stack/` | Site | Press/studio site for Service Door. Same character lock. Working pages. |
| 7 | `continuity-bench/` | Multi-agent | Adversarial stills bench. Skeptics fail-closed on identity drift. |
| 8 | `gimbal-goods/` | Site | Fictional lamp catalog. One object, twelve edit-chained shots, cart. |

Hard no: AI-wrapper SaaS. No chat skins.

---

## Ranked pitches

Each pitch names the Grok-only surface, the coding proof, the 30-second clip, and how Codex/Claude fail the same brief.

### 1. Service Door — Unity 2D vertical slice

Night-shift contractor. Brutalist archive. One guard. One freight elevator.

- **Grok-only:** hero lock (front/side, idle/walk/takedown harvested from video), guard lock, one interior tileset verified seamless.
- **Coding proof:** Unity 2D, tilemap, input, camera follow, patrol, takedown, win trigger, WebGL build in-repo.
- **Clip:** walk, takedown, elevator doors, win.
- **Rival failure:** runnable room with placeholder or regenerated-every-time art. Identity drifts across frames.

Full spec below. This is the only project specified for build.

### 2. Service Door Reel — film

Same operative, same wardrobe, same interior. 6–8 shots, 6s each, ffmpeg concat, custom player.

- **Grok-only:** `image_edit` from the game’s canonical stills, `image_to_video` per shot, last-frame seeding.
- **Coding proof:** shot list as data, player UI (storyboard | footage | timecode), deterministic concat script.
- **Clip:** the trailer itself.
- **Rival failure:** video they cannot generate; or stills that do not match the playable character.

### 3. Locksmith — multi-agent product

Browser UI + Rhai. Spec YAML in, `manifest.json` out. Parallel generate → blind-describe skeptics → fail-closed edit-chain.

- **Grok-only:** Imagine inside a Grok workflow, verification against a frozen spec, watchable fan-out.
- **Coding proof:** workflow scripts, schema, UI that renders the DAG and artifacts, Unity-readable manifest.
- **Clip:** cards light up, skeptics reject a drifted face, a sheet lands in the manifest.
- **Rival failure:** Claude can spawn subagents; it cannot run this Imagine+Rhai loop as one product.

### 4. Phylum Tray — browser game

One ancestor creature. Eight morphological variants, all `image_edit`-chained. Idle + walk each. Drop into a terrarium.

- **Grok-only:** character-consistency at set scale, palette/morph rules, animation frames.
- **Coding proof:** engine-free web game (Phaser or Pixi), atlas loader, no backend.
- **Clip:** click morphs, they walk, they are obviously the same animal.
- **Rival failure:** eight unrelated animals.

### 5. Sodium Night — original short

Six shots, one passenger, wet street, sodium lamps. Not Service Door IP.

- **Grok-only:** new character lock, shot-to-shot continuity, assembled film.
- **Coding proof:** same player stack as the reel, different data.
- **Clip:** the short.
- **Rival failure:** no native video; continuity collapse if they fake stills.

### 6. Closed Stack — studio site

In-universe press kit for Service Door. Dossiers, key art, playable embed or link, press zip.

- **Grok-only:** key art and portraits from the *same* hero lock as the game.
- **Coding proof:** static site, real IA, desktop + mobile verified in a browser.
- **Clip:** scroll dossiers, art matches the WebGL character.
- **Rival failure:** pretty site, wrong face.

### 7. Continuity Bench — multi-agent

Contact sheet of stills in. Parallel skeptics score identity / wardrobe / lighting. Fail closed.

- **Grok-only:** vision+workflow product, not a chat UI.
- **Coding proof:** Rhai, schemas, bench UI, golden fixtures.
- **Clip:** one frame goes red, reason attached.
- **Rival failure:** a checklist markdown file.

### 8. Gimbal Goods — catalog site

One lamp. Twelve catalog shots (angle, material, time of day) via `image_edit`. Lookbook + cart.

- **Grok-only:** object lock across a catalog.
- **Coding proof:** working cart, filters, persistence, browser-verified.
- **Clip:** same lamp, twelve photographs, add to cart.
- **Rival failure:** twelve different lamps.

Suggested build order later: 1 → 3 (feeds 1’s art bible) → 2 → 6 → 4 → 5 → 7 → 8. Spec and first implementation target is only **1**.

---

## #1 spec: Service Door

### Intent

A playable Unity 2D infiltration slice that is only impressive because the art is identity-locked and engine-ready. Tight vertical slice. Long Grok session comes from the asset pipeline, not from extra systems.

### Player-facing slice

1. Boot to the room (no company logo, no settings).
2. Move the operative with keyboard (WASD / arrows). Idle and walk play.
3. One guard patrols two points.
4. Get in range, press the takedown key, play the takedown cycle, guard down.
5. Reach the freight elevator trigger. Doors, win state, Restart.

Out of slice: menus, inventory, dialogue, LOS stealth meter, multiple rooms, soundtracks, pathfinding beyond two-point patrol, save system, mobile touch.

### Grok-only surface (must all pass)

| Asset | Lock rule |
|-------|-----------|
| Hero canonical | One `image_gen` master. Every later hero image is `image_edit` from it or from a child of it. Never a fresh gen. |
| Hero turnaround | Front and side, same wardrobe, silhouette, palette. |
| Hero cycles | Idle, walk, takedown. Video-first: stage a frame with `image_edit`, `image_to_video`, harvest, composite a sheet (no divider lines, subject registered per cell). |
| Guard | Separate canonical lock. Idle + walk only. |
| Interior tileset | Floor, wall, door, elevator, one prop. 2×2 seam check must pass. Non-directional lighting. |
| UI | No generated text on sprites. If a button exists, geometry-identical states, no letters in the bitmap. |

Style lock (freeze before any gen): brutalist interior, practical sodium/fluorescent, limited palette (concrete, oxide orange, moth-grey operative, no neon soup), readable silhouette at 32–48 px.

### Coding proof

- Unity 2D (LTS). 2D renderer. One scene.
- C#: `PlayerController`, `GuardPatrol`, `Takedown`, `ElevatorWin`, `Restart`.
- Tilemap collider. Camera follow with clamp.
- Sprite import: single PPU, consistent filter mode (Point), sheets sliced from the manifest.
- WebGL build checked in under `service-door/play/` so a visitor does not need the editor.
- Edit-mode tests: player spawns, elevator trigger exists, takedown radius > 0, scene has exactly one guard.
- `Assets/Art/manifest.json` lists every sprite, source ref, and cycle. Game loads sheets by that manifest, not by magic strings scattered in the inspector.

### 30-second clip

Record the WebGL or editor play: spawn → walk past shelves → takedown → elevator → win. No voiceover required. File: `service-door/clip.mp4`. Keep it small (480p, <15 MB).

### Bakeoff

Same brief given to Codex or Claude: they can ship the room. They cannot ship a hero that is the same person on the box art, the idle, the walk, and the takedown. That is the point of the folder.

### Repo rules

- MIT `LICENSE`
- No home-folder paths, no machine names, no API keys, no `.env`
- Art prompts and refs live in `service-door/art-record/` (markdown + images). No account identifiers.
- README: what it is, how to play the WebGL build, how to open in Unity, “Built with Grok Build.”
- Git: if PNGs exceed GitHub’s comfort zone, use Git LFS. Prefer small indexed palettes.

### Folder (when build starts)

```
service-door/
  README.md
  LICENSE
  clip.mp4
  play/                 WebGL
  art-record/
  Assets/               Unity project
  ProjectSettings/
  Packages/
  Tests/
```

### Stack

- Unity 2D LTS, C#, WebGL
- Imagine tools via Grok Build sessions (not a checked-in client)
- ffmpeg + Python/PIL for harvest and sheets
- No third-party asset-store characters. No paid packs.

### Acceptance (slice is done when all true)

1. `play/index.html` runs the slice in a browser with no editor.
2. Hero idle, walk, and takedown are recognizably the canonical still (side-by-side in README).
3. Tileset 2×2 composite shows no seam.
4. Guard is a different lock, not a recolor of the hero.
5. Keyboard flow reaches the win state without cheating in the inspector.
6. Edit-mode tests pass in batchmode.
7. `clip.mp4` exists and matches the live build.
8. Grep of the folder finds no local usernames, home paths, or keys.
9. A rival agent following only the coding half still needs Imagine to match the art. That gap is documented in README in one paragraph.

### Non-goals for this slice

Locksmith (project 3) may later generate this art bible. Service Door v1 may generate assets in-session and check them in. Do not block the slice on the DAG UI.

---

## Constraints carried from the grill

- CWD: this folder. Subproject = subfolder.
- Public GitHub, MIT, scrub personal info and secrets.
- Token-heavy means long greenfield sessions, not brownfield archaeology.
- Distinctiveness filter: if Codex/Claude can ship the whole artifact, it does not belong on this list.
- Audience: engineers (clone, run, tests) and a 30-second clip.
- Unity is allowed; visitors still get a WebGL play path for #1.
- Multi-agent projects (3, 7) ship UI + scripts, not one or the other.
- Eight ideas, two per domain; only #1 is specified to implementation depth.
