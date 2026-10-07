# Phylum Tray

Browser creature lab. One ancestor lock (`Coleoptera striolata`) and seven `image_edit`-chained morphs drop into a live terrarium. The point is that they are obviously the same animal.

Built with Grok Build.

## Play

Serve the repo (canvas chroma-key needs http, not `file://`):

```
python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/phylum-tray/play/`.

Click a pinned morph on the specimen tray. It falls into the glass habitat and walks. Click the glass to drop the last-selected morph at that point. Evacuate clears the habitat.

## Art

Canonical lock: `art/creature-ancestor.jpg`. Morphs: armor, horn, legs, orange, pale, spread, wings. Magenta is keyed out in the tray and the canvas. No CDN, no backend.
