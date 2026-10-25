---
version: 1
slug: "app-index-html"
primary_target: "app/index.html"
related_targets: ["app/ansicht/mitspielen.js","app/stil.css"]
---

# Surface brief: Play-along screen

Scope: the play-along screen of the new app (`#/lied/<id>`), mobile-first. Mode: Operate.
Audience and task: Jakob plays ukulele and sings at the same time, at night by the fire, phone at arm's length. He needs now and next for chord, syllable and strum at a glance, and taps at most start/pause, tempo, loop.
Content: real songs from `lieder/*.json` (Liedspur). Songs without lyrics show their chord lines and a note that the lyrics come after login.
Memorable moment: the red reading thread with its needle, the chords run under it, the current chord becomes the one red plate.
Open: the login path for private songs, the YouTube clock (next step), the song list as a separate surface, the Sing-along button (QR sync for friends, E3): it appears only once the Jarvis server can sync, never as a dead button.

## Direction contract

THESIS: The campfire songbook held in the hand and read at night. Chord above the syllable as in the Mundorgel, but the page moves in time. It refuses the karaoke neon highway and the cream paper songbook.

OWN-WORLD: Warm black ground #141110, page surface #1f1a18, thin-paper ivory #efe9dd for text, Mundorgel red #d2342a only for the song number, the current chord (the only red plate), the reading thread and start. Yellow #f0c419 only for sung syllables and the next chord. Archivo in three weights, chord letters 800 above the syllables, hairlines #332b27, no shadow, no gradient.

STORY: From an arm's length Jakob sees which chord now (red plate plus chord diagram), which one next (yellow, beats until the change), which syllable right now (yellow fill), how to strum. The previous line stays faint and readable. He only taps start/pause.

FIRST VIEWPORT: Header with a 64px red song number on the left, title plus level/key, nothing on the right for now (the Sing-along button comes later, see Open). Below it, full width, a 56px chord reading thread: red thread on top with a needle, blocks as wide as their duration, beat ticks as the shared grid. Then the chord diagram 74px, chord name 44px, "then X · in n beats". Lyrics: previous line 19px faint, current line 34px with red chord letters above the changing syllables, next line 21px. Strum row with 8 cells and an underline. Fixed bar at the bottom: red start 70px, tempo, loop, fire mode.

FORM: Mundorgel at night, #1 of my own list (pick card), seed:c21e772d3f747853. Signature interaction: the chord thread glides continuously under the needle; during the count-in the song number counts the bar in 1-2-3-4 in yellow. Motion grammar: one continuous glide, everything else switches without animation.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
