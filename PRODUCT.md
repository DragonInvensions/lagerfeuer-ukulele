# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: ES modules and CSS without a framework or bundler, a PWA with a service worker for offline use, logic in `app/kern/` without DOM, tests with `node --test`. Hosted on Jarvis (own Node server for login, private songs and the QR sync). Reasons in `docs/entscheidungen.md`.

## Users

- **Jakob**, who has been learning ukulele from zero since 16.08.2026 and wants to play at the campfire soon. He sings and plays at the same time and needs to see at a glance which syllable comes when and which chord to play when and for how long.
- **Friends at the campfire**, who sing along: they scan a QR code and see the lyrics on their own phones, in sync with Jakob's playback.

The app is not meant for strangers. It needs no onboarding for new users and no marketing.

## Product Purpose

Play and sing at the same time at the campfire. The heart is the play-along screen with three lanes on one beat:
chords with their duration, syllables like karaoke, and the strum pattern. It runs at your own tempo without a recording, or in sync with the official YouTube video.
Around it sit the songbook (42 songs), the handbook chapters, chord diagrams, tuner and practice plan.
It is a success when Jakob plays a song through without looking up from the screen to figure out what comes next.

## Positioning

German folk songs and the German dubbed versions of the theme songs he wants (SpongeBob, Pokémon, Pippi …), with beginner-friendly, barré-free chords. Syllable timing comes from real sheet music, UltraStar files or a recording, never guessed. The campfire mode works offline without a recording. Kala, Chord ai and Yousician cover none of this combination.

## Operating Context

- **Main scene:** at night by the fire, dark, phone on the knee or a stand, both hands on the ukulele. Quick glances from about an arm's length, at most one tap now and then.
- At home Jakob also practises at slower tempo, with a loop and a count-in.
- Friends follow along on their own phones (QR code, live sync).

## Capabilities and Constraints

- Song format `liedspur/1` (`lieder/*.json`, positions in quarter notes, tempo map). Logic in `app/kern/liedspur.js`.
- Songs whose lyrics are protected are delivered only from Jarvis after login. The public repo holds only public-domain songs and chords.
- Playback runs against a YouTube embed (IFrame API). For the analysis on the PC, audio may be downloaded from YouTube (Jakob's decision, against YouTube's terms of service).
- Tuner via the microphone, later "wait for me" (does the app hear the right chord?).
- UI language German.
- **Undecided:** login method (login service with Google or a password), address on Jarvis, whether GitHub Pages is switched off.

## Brand Commitments

- Name: **Lagerfeuer-Ukulele**.
- Existing app icon `icon.svg` (dark green ground, ember glow). It exists but has not been confirmed as binding.

## Evidence on Hand

- 42 songs in `lieder/` (23 public domain with lyrics, 19 chords only). Alle meine Entchen has sheet-music rhythm, the rest are estimated.
- Handbook texts of the old app (`quelle/p2-shell.html`, `p3-chapters.html`): your instrument, reading chord diagrams, the first three chords, rhythm and strum patterns, the campfire chords, barré, key and transposing, at the campfire, chord lexicon.
- Chord database with fingerings and 6 strum patterns (`quelle/p5-core.js`), tuner (`quelle/p9-stimmer.js`), 8-week plan (`quelle/p8-render.js`).
- No testimonials, no users besides Jakob and friends. Nothing like that may be invented.

## Product Principles

1. **One glance is enough.** Hands play and eyes look up briefly. What is now and what comes next must be readable from an arm's length.
2. **Musical time is the truth.** Everything hangs on the beat, and the tempo belongs to the player.
3. **Beginners first.** The simplest fingering, the friendliest key, no shaming over mistakes.
4. **Works at the fire.** Offline, in the dark, without a recording.
5. **Rights stay clean.** Protected lyrics never end up anywhere public.

## Accessibility & Inclusion

- Adjustable text size (the old app had three steps). Reading distance is an arm's length in the dark.
- A chord change is never signalled by colour alone, and contrast also holds in the dark.
- Motion is part of the function (playhead, syllable fill). Pure decoration respects `prefers-reduced-motion`.
