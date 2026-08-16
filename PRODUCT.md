# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are Geometry Dash players, challenge level creators, list verifiers, and SaQreeZ community members who grind difficult challenge levels, verify completions with video evidence, compete on the points leaderboard, and complete themed level packs or roulette runs.

## Product Purpose

Provide an authoritative, accessible, and community-driven ranking and record-tracking platform for Geometry Dash challenge levels (SaQreeZ Demon List / SDL). The list organizes levels by difficulty, calculates player scores for verifications and records, tracks completion of curated packs, and offers challenge roulette gamification.

## Positioning

A community-centric Geometry Dash challenge list adapted from the open-source TheShittyList framework for SaQreeZ's community, featuring specialized level pack scoring (50% bonus aggregate), mobile/FPS metadata tracking, and integrated Discord record submission workflows.

## Operating Context

- Browsed on desktop and mobile web by players checking level stats, IDs, copy passwords, and video proofs.
- Linked closely with the SaQreeZ Discord server for submissions, streaming verifications, and community discussion.
- Zero-backend static hosting loading flat JSON data files directly from the repository.

## Capabilities and Constraints

- **Architecture**: Static single-page application using Vue 3 (CDN global), Vue Router 4, vanilla CSS, and JavaScript ES modules.
- **Data Model**: Static JSON files in `/data/` (`_list.json`, `_packs.json`, `_editors.json`, and individual level JSON records).
- **Core Features**:
  - Ranked level catalogue with search, ID, password, points value, embedded verification/showcase videos, and qualifying percent thresholds.
  - Dynamic points leaderboard aggregating verified, 100% completed, and progressed records, plus completed pack bonuses.
  - Themed Level Packs with combined difficulty point rewards and player completion tracking.
  - Interactive Challenge Roulette with list filtering (Main, Extended, Other), percentage progression, and JSON save import/export.
  - Theme toggling (Dark / Light) persisted in `localStorage`.
- **Language / Copy**: Bilingual experience (Polish with English fallback).
- **Submission Rules**: Specific community guidelines (min 3s length, CBF & FPS bypass permitted, no secret ways/physics abuse, proof required).

## Brand Commitments

- **Name**: SDL / SaQreeZ Demon List (SaQreeZ Challenge List).
- **Logo**: `SDL_logo.png`.
- **Typography**: Lexend Deca.
- **Attribution**: Based on TheShittyList (TSL) by matcool/TSL contributors, customized by SaQreeZ and list staff.
- **Discord Community**: Linked directly via `https://discord.gg/nqCAccHWJu`.

## Evidence on Hand

- 300+ existing level JSON files with verified records, IDs, and YouTube links in `/data/`.
- Active list editor roster in `/data/_editors.json` (Owner: SaQreeZ, Admins: gopsolaptop, MaybeGurt, YoungSzxmus, Helper: kubusszn, Dev: SaQreeZ).
- Real pack configurations in `/data/_packs.json`.

## Product Principles

- **Competitive Accuracy**: Transparent formulas for level ranking, record qualification, and pack bonuses.
- **Fast & Direct Navigation**: Instant search and filtering across hundreds of levels and players without server latency.
- **Clarity of Proof**: Prominent embedding of verifier/record proof videos with FPS and mobile indicator badges.
- **Community Pride**: Highlighting player milestones, editor contributions, and pack achievements.

## Accessibility & Inclusion

- Support for high-contrast dark and light color schemes.
- Legible typography sizing and strong visual affordances for interactive elements.
- Responsive design tailored for both desktop grind setups and mobile viewing.
