# Service Door art lock

Style: stylized 2D game art, cel shading, moth-grey / oxide orange / concrete, flat magenta key.

| Asset | Source | Rule |
|-------|--------|------|
| Hero canonical | `_shared/locks/hero.jpg` | Single `image_gen`. All later hero images are `image_edit` or video from this. |
| Hero side | `_shared/variants/hero-side.jpg` | Profile for walk. |
| Hero idle sheet | video from canonical, 8 harvested frames | `play/art/hero-idle.png` |
| Hero walk sheet | video from side lock, 8 harvested frames | `play/art/hero-walk.png` |
| Guard | `_shared/locks/guard.jpg` then full-body edit | Separate lock, not a recolor of the hero. |
| Floor / wall | Imagine seamless tiles, 2×2 checked | `play/art/floor.jpg`, `wall.jpg` |
| Elevator | text stripped via `image_edit` | `elevator-clean.png` |

Defects left in: garbled badge micro-text on the hero still (image models cannot be trusted with letters). Sheets are the playable truth.
