---
name: SaQreeZ Demon List
description: Cyberpunk Neon Vault - High-energy competitive Geometry Dash challenge platform
colors:
  primary: "#a83dff"
  primary-hover: "#be63ff"
  primary-dark: "#8d2be2"
  primary-dark-hover: "#b05bf5"
  primary-glow: "rgba(168, 61, 255, 0.35)"
  on-primary: "#ffffff"
  background-light: "#f8f9fc"
  background-dark: "#0b0c10"
  black: "#000000"
  surface-dark: "#12141c"
  surface-dark-card: "#181a26"
  surface-dark-hover: "#222536"
  surface-light: "#ffffff"
  surface-light-card: "#ffffff"
  surface-light-hover: "#f0f2f8"
  text-light: "#0f172a"
  text-dark: "#ffffff"
  text-muted-dark: "#94a3b8"
  text-muted-light: "#64748b"
  podium-gold: "#ffd166"
  podium-silver: "#e0e1dd"
  podium-bronze: "#cd7f32"
  discord: "#5865f2"
  error: "#ef4444"
  success: "#10b981"
typography:
  display:
    fontFamily: "'Lexend Deca', sans-serif"
    fontSize: "51.4px"
    fontWeight: 700
    lineHeight: "52px"
    letterSpacing: "-2px"
  headline:
    fontFamily: "'Lexend Deca', sans-serif"
    fontSize: "34.3px"
    fontWeight: 700
    lineHeight: "40px"
    letterSpacing: "-1px"
  title:
    fontFamily: "'Lexend Deca', sans-serif"
    fontSize: "22.9px"
    fontWeight: 700
    lineHeight: "28px"
  title-md:
    fontFamily: "'Lexend Deca', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "26px"
  body:
    fontFamily: "'Lexend Deca', sans-serif"
    fontSize: "17.1px"
    fontWeight: 500
    lineHeight: "28px"
  label:
    fontFamily: "'Lexend Deca', sans-serif"
    fontSize: "17.1px"
    fontWeight: 500
    lineHeight: "20px"
  label-md:
    fontFamily: "'Lexend Deca', sans-serif"
    fontSize: "14.3px"
    fontWeight: 500
    lineHeight: "18px"
  label-sm:
    fontFamily: "'Lexend Deca', sans-serif"
    fontSize: "11.4px"
    fontWeight: 500
    lineHeight: "12px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

# Design System: SaQreeZ Demon List (Cyberpunk Neon Vault)

## Overview

**Creative North Star: "The Cyberpunk Neon Vault"**

SaQreeZ Demon List (SDL) is reimagined as an electric, high-performance competitive vault for Geometry Dash challenge grinders and list verifiers. The visual world is defined by deep obsidian canvases (`#0b0c10`), frosted glass containers (`backdrop-filter: blur(16px)`), vibrant electric violet accents (`#a83dff` / `#8d2be2`), luminous ambient glows, and prestigious gold/silver/bronze podium distinctions.

Every screen provides instant tactile response, high visual clarity, seamless video proof playback, and modern micro-actions like one-click copy buttons for level IDs and copy passwords.

**Key Characteristics:**
- **Obsidian Glass Foundations**: Translucent acrylic panels with subtle 1px border illumination (`rgba(255, 255, 255, 0.08)`) and deep obsidian depth.
- **Electric Violet Luminescence**: Vibrant purple energy accents powering active list selections, glowing button triggers, and interactive tabs.
- **Podium Prestige Hierarchy**: Top 3 ranks claim dedicated metallic styling (#1 Gold `#ffd166`, #2 Silver `#e0e1dd`, #3 Bronze `#cd7f32`) elevating tournament prestige.
- **Precision Typography**: Clean geometric rhythm powered by Lexend Deca with custom cap-height alignment.

## Colors

The palette combines deep obsidian space with electric violet highlights, tournament metals, and crisp semantic feedback.

### Primary
- **Electric Violet** (`#a83dff` / `#8d2be2` in dark mode): Core brand energy across active rows, CTA buttons, focus states, and badges.
- **Electric Violet Hover** (`#be63ff` / `#b05bf5`): High-intensity hover accent.
- **Electric Violet Glow** (`rgba(168, 61, 255, 0.35)`): Ambient back-light for active surfaces and buttons.

### Secondary
- **Podium Gold** (`#ffd166`): #1 Rank badge, champion crown, and top-tier achievement highlight.
- **Podium Silver** (`#e0e1dd`): #2 Rank badge.
- **Podium Bronze** (`#cd7f32`): #3 Rank badge.
- **Arcade Emerald** (`#10b981`): Verified completion status and positive score indicators.

### Neutral
- **Obsidian Dark** (`#0b0c10`): Root dark mode canvas background.
- **Glass Dark Surface** (`#12141c` / `rgba(18, 20, 28, 0.8)`): Frosted container surface.
- **Elevated Card Dark** (`#181a26`): List row and card backgrounds.
- **Hover Surface Dark** (`#222536`): Interactive hover fill.
- **Canvas White** (`#f8f9fc`): Light mode root background canvas.
- **Canvas Text Dark** (`#ffffff`): High-contrast primary text.
- **Muted Text Dark** (`#94a3b8`): Secondary metadata, authors, and helper text.
- **Signal Error Red** (`#ef4444`): Error notifications and disqualified states.

### Named Rules
**The Podium Distinction Rule.** Ranks #1, #2, and #3 are visually distinct from the rest of the list, proudly donning metallic gold, silver, and bronze badges to honor the hardest accomplishments in the game.

**The Obsidian Glass Rule.** Panels float over deep obsidian space using frosted translucency (`backdrop-filter: blur(16px)`) and subtle illuminated 1px borders, creating sophisticated depth without heavy opaque drop shadows.

## Typography

**Display Font:** Lexend Deca (sans-serif fallback)  
**Body Font:** Lexend Deca (sans-serif fallback)  
**Label/Mono Font:** Lexend Deca (with `font-variant-numeric: tabular-nums`)

### Hierarchy
- **Display / H1** (Bold 700, 51.4px, line-height 52px, letter-spacing -2px): Main level names, leaderboard titles, and page headers.
- **Headline / H2** (Bold 700, 34.3px, line-height 40px, letter-spacing -1px): Section titles (Records, Packs, List Editors).
- **Title / H3** (Bold 700, 22.9px, line-height 28px): Card headers, sub-sections, and score total numbers.
- **Title Medium / H4-H6** (Bold 700, 20px, line-height 26px, uppercase): Stat titles (Points, Level ID, Password).
- **Body** (Medium 500, 17.1px, line-height 28px): Rules, guidelines, and level descriptions.
- **Label Large** (Medium 500, 17.1px, line-height 20px): List items, navigation tabs, buttons, and badges.
- **Label Medium** (Medium 500, 14.3px, line-height 18px): Secondary labels, author tags, and FPS badges.
- **Label Small** (Medium 500, 11.4px, line-height 12px): Micro tags and mobile badges.

### Named Rules
**The Tabular Precision Rule.** All ranks, points, completion percentages, FPS counters, and level IDs employ `font-variant-numeric: tabular-nums` for rock-solid tabular alignment.

## Layout

SDL features a responsive multi-column layout with fixed-height desktop viewports and smooth single-column mobile stacking.

- **Floating Glass Topbar:** Fixed 4.25rem header with frosted backdrop blur (`backdrop-filter: blur(16px)`), luminous bottom active tab indicator, Discord CTA, and theme toggle.
- **3-Pane Master Grid (List / Roulette):**
  - Left Pane (`minmax(18rem, 1.2fr)`): Search bar with icon, difficulty filter, and scrollable level list.
  - Center Pane (`minmax(22rem, 2.2fr)`): Selected level hero (16:9 video embed, interactive copy cards for ID/Password, Points pill, Records table).
  - Right Pane (`minmax(18rem, 1.1fr)`): List editors roster, submission rules, and server announcements.
- **2-Pane Leaderboard Grid:** Centered container (`max-width: 84rem`) with top-3 podium showcase, ranked player table, and player score breakdown pane.
- **2-Pane Packs Grid:** 2-column pack grid with pack cards, progress bars, and level breakdown.
- **Responsive Stack:** Collapses gracefully to a single-column layout on screens $\le 992\text{px}$.

## Elevation & Depth

### Shadow Vocabulary
- **Neon Glow** (`box-shadow: 0 0 20px rgba(168, 61, 255, 0.35)`): Ambient glow on active buttons, selected list items, and video containers.
- **Glass Border** (`border: 1px solid rgba(255, 255, 255, 0.08)` / `border: 1px solid rgba(168, 61, 255, 0.2)` on active): Razor-sharp illuminated edge defining frosted cards.
- **Hover Micro-Lift** (`transform: translateY(-2px)`): Smooth upward translation on all interactive cards, buttons, and rows.

## Shapes

- **Card & Row Radius** (12px / `0.75rem`): Smooth modern rounded corners for level items, cards, and inputs.
- **Pill Badges** (9999px / `1rem`): Rounded pill tags for pack badges, FPS chips, and podium medals.
- **Icon Circles** (50%): Circular action buttons with hover luminescence.

## Components

### Buttons
- **Shape:** 12px rounded rectangle with subtle violet border.
- **Primary:** Solid electric violet (`#8d2be2` / `#a83dff`) with ambient violet glow (`0 0 16px rgba(168, 61, 255, 0.35)`).
- **Hover / Focus:** Lifts vertically (`translateY(-2px)`) with heightened luminescence.

### Selectable List Rows
- **Shape:** 12px rounded container with 1px glass border.
- **Default:** Translucent card surface (`#181a26`) with soft hover shift (`#222536`).
- **Active:** Glowing violet accent border with solid electric violet background and pure white text.
- **Podium Ranks:** Custom gold/silver/bronze rank badges.

### Interactive Copy Stat Cards (Level ID / Password)
- **Style:** Compact frosted card with label, value readout, and copy icon button.
- **Interaction:** Clicking triggers a copy-to-clipboard action with instant "Copied!" feedback badge.

### Search & Filter Bar
- **Style:** 12px radius glass input with 1px border, search icon prefix, and clear button.
- **Focus:** Luminous electric violet border with ambient glow.

### Video Showcase
- **Style:** 16:9 responsive iframe container with 12px border radius, 1px glass border, and soft ambient shadow.

## Do's and Don'ts

### Do:
- **Do** use `Lexend Deca` with `tabular-nums` for all stats, numbers, and headers.
- **Do** preserve the frosted obsidian glass aesthetics (`backdrop-filter: blur(16px)`).
- **Do** honor top-3 podium styling (#1 Gold, #2 Silver, #3 Bronze) across List and Leaderboard.
- **Do** provide instant visual feedback on one-click copy actions for IDs and passwords.

### Don't:
- **Don't** use opaque flat 2020-era tables without glass depth or rounded row treatments.
- **Don't** use multi-color rainbow gradient borders that distract from competitive content.
- **Don't** hide YouTube video embeds behind modal dialogs when direct inline playback is expected.
