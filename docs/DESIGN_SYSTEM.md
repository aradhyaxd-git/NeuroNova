# NeuroNova — Production Design System & Visual Hierarchy

NeuroNova enforces an anti-slop, high-craft design system designed for professional educational technology and AI tools.

---

## 🎨 Color Palette & Themes

The app supports dual theme modes using CSS custom variables defined in [`client/src/styles.css`](file:///Users/aradhya.dev/Desktop/chatapp/AI_study_assistant/client/src/styles.css):

### Light Theme (Serene Paper Canvas)
- `--bg-primary`: `#fafafa`
- `--bg-surface`: `#ffffff`
- `--bg-surface-hover`: `#f3f4f6`
- `--text-primary`: `#0f172a` (Slate 900)
- `--text-secondary`: `#475569` (Slate 600)
- `--text-muted`: `#94a3b8` (Slate 400)
- `--border-color`: `#e2e8f0` (Slate 200)

### Dark Theme (Obsidian Studio Slate)
- `--bg-primary`: `#0b0c10`
- `--bg-surface`: `#14161f`
- `--bg-surface-hover`: `#1e212d`
- `--text-primary`: `#f8fafc`
- `--text-secondary`: `#cbd5e1`
- `--text-muted`: `#64748b`
- `--border-color`: `rgba(255, 255, 255, 0.08)`

---

## 💜 Purposeful Accent Gradients

- **Primary Accent**: `--accent-primary: #6366f1` (Indigo 500)
- **Vibrant Primary Gradient**: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)`
- **Subtle Highlight Overlay**: `--accent-subtle: rgba(99, 102, 241, 0.08)`

---

## 🔤 Typography Hierarchy

- **Headings**: `Outfit`, -apple-system, sans-serif
- **Body & Copy**: `DM Sans`, -apple-system, sans-serif
- **Data, Percentages & Code**: `JetBrains Mono`, monospace

---

## 🧱 Component Cards & Layout Bounds

- **Card Surfaces**: `.card-surface` with `border: 1px solid var(--border-color)` and `border-radius: 20px - 24px`.
- **Glow Borders**: `.glow-border` applying subtle indigo rim lighting.
- **Logo Bounds**: `.dock-logo-img` strictly bounded to `width: 42px !important; height: 42px !important; object-fit: cover; flex-shrink: 0;`.
- **Navbar Dock**: `.floating-capsule` max-width `960px` with `backdrop-filter: blur(18px)`.
