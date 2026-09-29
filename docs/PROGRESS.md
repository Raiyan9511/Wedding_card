# PROGRESS — Kya Kya Kiya

> Har kaam ke baad yahan entry add karo (latest upar).

## 2026-09-29 — Card A consolidated fix pass (review pending)
- RSVP + Gallery sections Card A se poori tarah hataye (`Rsvp.tsx`, `Gallery.tsx` deleted, `.noScrollbar` CSS gaya). Shared `components/shared/rsvp.ts` + config `rsvp` fields B/C ke liye rahe.
- Seams: ek hi background — damask pattern ab `.shell` (page column) par, saare sections transparent. Hero ka neeche ka ~110px `mask-image` se pattern me ghulta hai (solid ivory band nahi).
- Flowers: section `overflow-clip` hataye → sirf `.shell` (`overflow: clip`) crop karta hai, yaani screen/card edge par. Box transparent, bob chalu. Countdown ke sprays text se hata ke upar/neeche gap me.
- Scratch tiles: foil gradient + grain + diagonal sheen + arch ke saath double gold rule + ✦ "scratch here" (italic serif); tile par slim foil rim, ivory inner border, soft shadow. `ScratchCard` mechanics unchanged.
- Verified (headless Edge, reduced motion ON = client PC, 390 + 1440): 7 sections, 0 dialogs / RSVP / wa.me, sab backgrounds transparent, 14 flowers transparent + unclipped + bob running, scroll ke baad 0 hidden text (390), scratch → message ✅, 0 console errors. Build ✅ lint ✅ tsc ✅.

## 2026-09-29 — Card A motion fixes (review pending)
- Root cause of "video nahi chala / hero nahi aaya / flowers static": is PC par Windows "Animation effects" off → browser `prefers-reduced-motion: reduce` = true → code reduced-motion path chala raha tha. Client ki marzi se ab envelope video, hero loop video, flower bob aur text rise reduced motion me bhi chalte hain (petals / events line draw / icon pop abhi bhi off).
- Flowers: scroll drift + sway hataye. Ab corner par fixed, sirf `translateY` ±6px bob, 3.4–5s per cycle, alag phase. Hero bottom-right par bhi ek cluster.
- Text: har block 40px neeche + opacity 0 se rise, power3.out 0.9s, 0.15s stagger; hero envelope video khatam hone par, baaki sections ScrollTrigger `once`. Greeting message ka word-scrub hata ke same rise.
- `[envelope]` console logs abhi code me hain (debug ke liye) — review ke baad hatane hain.
- Headless Edge kabhi-kabhi ~1 fps par throttle hota hai (page ki galti nahi — same code dusre run me 60 fps); us waqt animations dheere dikhte hain.

## 2026-09-29 — Card A video envelope + card layout (review pending)
- Code wala envelope hataya → `envelope-blank-seal.mp4` (720×1280, 8.15s). Closed = frame 0 (`envelope-poster.webp`, headless Edge canvas se nikala — ffmpeg is PC par nahi), monogram seal par (49.3% / 52.4%, gold gradient + emboss). Tap → monogram/hint turant hide, video wahi jagah play, music same tap par; `ended` → 0.5s crossfade to hero. Reduced motion: video skip, seedha crossfade.
- Layout shell: phone (≤640px) full width; bada screen = 480px card centre me, baaki page `--canvas` #E6DCD0 (video ke border ka average). Card A ke saare `sm:`/`md:` hataye (ek hi phone layout), `vw` sizes column-relative kiye, music button card ke andar.
- Verified 390 / 1440 / reduced: video plays after tap, crossfade, no h-scroll, main 390/480 wide. Rule 3: B build me envelope video/poster nahi. Build ✅ lint ✅ tsc ✅.

## 2026-09-28 — Card A full upgrade (review pending)
- Assets `assest/` → `templates/cardA/assets/` (static imports; mp4 via `turbopack.rules` `type: "asset"`). Typo folder hataya; WhatsApp video → `C:\Users\acer\Videos\`.
- Monogram: `lib/config.ts` `monogram(config)` — `config.monogram` optional, warna "G&B". Card B/C abhi bhi `config.monogram` directly padhte hain (unhe touch nahi kiya).
- Config: `coverVideo` ("built-in" = card ka apna video, ya path), `venue.city` (optional) add.
- Hero: 100dvh video (open ke baad play, off-screen/hidden tab par pause, reduced motion = poster), upper-third text + cream scrim + halo, staggered rise (`motion.ts` `reveal()` — poore card ka ek hi reveal).
- Flowers: `Bloom` (decor.tsx) — outer `.js-drift` scroll parallax (GSAP scrub), inner CSS sway. Events: center gold line + diamonds, illustration icons (`EventArt`), alternating desktop.
- Bug fix: fast fling/jump par batch me 40+ elements aate the → 0.15s stagger se on-screen lines ~6s late. Ab scrolled-past elements turant dikhte hain.
- Verified (prod, 390 + 1440, real motion + reduced): 0 hidden, 0 broken images, no h-scroll, video pause off-screen. Rule 3: clean B build me Card A ka koi media/code nahi. Build ✅ lint ✅ tsc ✅.

## 2026-09-26 — Phase 5 Card C (Pastel Garden) ✅ (review pending)
**Card C** (`templates/cardC/`) — A (royal arches/gold) aur B (velvet/torn paper) dono se alag: blush/sage/cream, watercolour florals (gradient petals + eucalyptus), swans, butterflies. Fonts: Sacramento (light script) + Fraunces `SOFT` axis (rounded serif). Section order: Hero → Greeting → **Events → Scratch date → Countdown** → Gallery → Venue → RSVP → Footer.
- Envelope: pocketfold — 4 triangular flaps, sage pressed-flower seal. Tap → seal lift-off, flaps petals ki tarah bahar unfold (3D), 4 butterflies ud ke nikalti hain.
- Hero: do swans side se glide karke gardan se **heart** banate hain (paani ki ripples), cover photo circle me watercolour wreath, drifting butterflies (mobile 5 / desktop 8), off-screen par pause (`useVisible`).
- Reveal language (`index.tsx` + `motion.ts`): `.js-float` soft rise, `.wash` watercolour wipe (clip-path `--w`), `.js-bloom` flower-open (scale + rotate).
- Events: winding vine poore list me — scroll par "draw" hoti hai, leaves exactly vine pahunchne par sprout. Cards rounded, flower badge me line-art glyph. Scratch: 3 round watercolour "blooms", butterflies + petals burst. Countdown: 4 pastel watercolour blobs. Gallery: oval cameo frames staggered + lightbox. Venue: organic blob map + botanical label. RSVP: rounded dialog + pill options. Music: watercolour flower jo play par ghoomta hai. Footer: mini swans heart.
- Scratch fix confirm: Card C ka paint jaan-boojh kar translucent `strokeStyle` chhodta hai — tiles phir bhi 100% clear + reveal ✅.

**Performance (headless Edge, 390×844, CPU 4×, rAF timing, jank = frames > 25ms):**

| | Pehla version | Final |
|---|---|---|
| Envelope | 55–57 fps, jank 4–7% | 58.1–58.8 fps, p95 22–23ms, jank 2–3.3% |
| Flick 1 (hero → events) | 46–52 fps, jank 6–20% | 53.7–55 fps, jank 3.3–5% |
| Flick 2 (scratch → venue) | 50–56 fps, jank 5–14% | 57.3–58.7 fps, jank 1.6–4% |
| Slow scroll | kabhi 4–6 fps stalls | 57–60 fps |
| Desktop 1× env / flick | — | 58.8–59.3 / 56.3–58.6 fps |
| CLS | 0 | 0 (desktop 0.005) |

- Fix 1: SVG watercolour filter (`feTurbulence` + `feDisplacementMap`) hataya — raster itna slow tha ki multi-second stalls aate the. Look ab sirf gradients se.
- Fix 2: vine ka `stroke-dashoffset` scrub (har frame ~1600px SVG repaint) → transform-only reveal: clip box neeche slide, vine andar ulta slide (dono composited).
- Method: `Performance.getMetrics` se har phase ka main-thread time (script/style/layout/paint) naapa, phir ek-ek suspect hata ke compare kiya.

- Verified (production build, 390 + 1440, **real motion**): envelope → 9 sections, scratch → fade + message + burst, RSVP → `wa.me` + "Thank you", music autoplay + play/pause (temporary WAV, hataya), 0 hidden elements, 0 broken images, no horizontal scroll, 0 JS errors (sirf `song.mp3` ka expected 404). Reduced motion: 0 animations, sab visible, scratch kaam karta hai.
- Minimal config (events `[]`, photos/gallery/music/tagline/map/deadline hata ke): Events, Gallery, cover circle, couple photo, map, music button hide; 0 errors.
- Rule 3: C build me A/B ka ek bhi byte nahi (poora `.next`); A aur B builds me C ka kuch nahi. Build ✅ lint ✅ tsc ✅.
- ⚠️ **Testing correction:** is PC par Windows "animation effects" off hain → browser `prefers-reduced-motion: reduce` report karta hai. Card B ke 2026-09-26 wale "full motion" runs asal me reduced-motion the. Ab test driver motion explicitly set karta hai; Card B dobara real motion me test kiya: 9 sections ✅, 0 hidden ✅, scratch ✅, FPS 58.6–60 (jank ≤ 2.3%) ✅. Is PC par browser me preview karoge to animations nahi dikhengi (ye sahi behaviour hai).
- Note: ~30 headless runs me 2 baar CDP `evaluate` atka (alag-alag steps par); dobara reproduce nahi hua, page responsive tha. Real device par ek baar check karna.

## 2026-09-26 — Phase 5 Card B (Maroon Floral) ✅
**Card B** (`templates/cardB/`) — Card A se alag design (Rule 5): maroon velvet + ivory torn-paper, roses, gold flourishes. Section order bhi alag: Hero → Greeting → **Countdown → Scratch date** → Events → Gallery → Venue → RSVP → Footer.
- Envelope: gatefold — do velvet doors, beech me wax seal; seal seam par crack hota hai, doors viewer ki taraf 3D swing (shading ke saath), andar ka card lift → site.
- Hero: torn-paper name banner "tear-in" reveal, rose clusters corners se slide in + sway, cover par parallax, gold "drip" scroll cue.
- Reveal language (`index.tsx` + `motion.ts`): `.tear` / `.tearX` torn edge clip-path sweep, `.js-drop` drop & settle, `.js-bloom` spin open. Card A ke fade-up se alag, slower/weightier.
- Greeting: polaroid couple photo + tape; Countdown velvet par; Scratch date: torn-edge "ticket", velvet scratch layer, rose-petal burst; Events: wavy gold thread scroll par draw + torn blush cards; Gallery: tilted polaroid collage + lightbox; Venue: postcard (map + address + rose stamp); RSVP: torn-paper dialog; Music: spinning vinyl button.
- Shared: `useVisible` (off-screen / hidden tab par hero loops pause) aur `lib/config.ts` me `eventIcon()` (emoji ya naam → icon key; har card apne glyphs banata hai).

**Bug fix (shared `ScratchCard`):** `paint()` ke baad `strokeStyle` reset nahi hota tha. Card B ka paint translucent gold stroke (`rgba(...,.45)`) chhod deta tha → har scratch sirf 45% erase karta, pixels alpha ~1 par ruk jaate (dikhne me saaf, par coverage kabhi 50% nahi) → reveal / "Mark your calendar" kabhi fire nahi hota. Ab `ScratchCard` brush ko opaque set karta hai. Card A par koi farq nahi (uska paint stroke set hi nahi karta) — re-test kiya ✅.

- Verified (headless Edge, production build, 390px + 1440px): envelope → open → saare 9 sections, 3 tiles scratch → fade + message, RSVP → sahi `wa.me` link + "Thank you", music autoplay + play/pause (temporary WAV tone se, test ke baad hataya), horizontal scroll nahi, 0 broken images, 0 JS errors. Reduced motion: 0 running animations, 0 hidden elements, scratch kaam karta hai.
- Empty fields (events `[]`, photos/gallery/music/tagline/map hata ke): Events, Gallery, music button hide, 0 errors.
- Rule 3: B build me Card A ka ek bhi byte nahi. Build ✅ lint ✅ tsc ✅.
- `client.config.ts` sample data wapas daala (testing ke waqt strip hua tha) — 3 events, map, deadline, photos, gallery; `template: "B"`. `song.mp3` abhi nahi hai → console me 1 expected 404, button hide rehta hai.
- Note: headless Edge me CDP mouse events ka ack kabhi-kabhi atakta hai — scratch test in-page `PointerEvent`s se kiya. Real touch device par ek baar check karna.

## 2026-09-25 — Phase 4 Animation Polish (Card A) ✅
**FPS (headless Edge, 390×844 mobile, CPU 4× throttled; rAF frame timing; "jank" = frames > 25ms):**

| | Before | After |
|---|---|---|
| Envelope open | 52.5–53.6 fps, p95 33ms, jank 9–12% | 58.8–58.9 fps, p95 18–19ms, jank 1.1–1.4% |
| Fast flick scroll | 51–54.8 fps, p95 33ms, jank 8.6–16% | 57.1–57.6 fps, p95 17–18ms, jank 2.7–3.2% |
| Slow scroll | 60 fps | 60 fps |
| Desktop 1× envelope / flick | 56.8 / 57.8 fps | 59.4 / 58.3 fps |
| CLS | 0 (desktop 0.001) | 0 (desktop 0.001) |

- **Envelope:** timeline dobara likhi — phases overlap (seal dip → halves pop out + gravity drop → flap lift seal girte hi shuru → letter flap khatam hone se pehle uthna). Flap face shade + letter par cast shadow 90° par peak (opacity/scale only). Seal ka `filter: drop-shadow` hataya (har frame re-render) → gradient contact shadow. Glow ring: `box-shadow` animation → transform/opacity.
- **Scroll reveals:** ek hi system (`index.tsx`): `.js-reveal` fade-up + `.js-pop` icon scale-in, `ScrollTrigger.batch` (saath aane wale elements stagger), `once: true` (trigger fire hote hi khatam). Timing `motion.ts` me. Per-section alag reveal code hataya. Word scrub ko `scrub: 0.4`.
- **Resize/rotation:** `ignoreMobileResize` (URL bar jank), fonts load hone par `ScrollTrigger.refresh()`. `useGSAP` unmount par sab revert karta hai. 3 rotations ke baad timeline sync error ≤ 0.001.
- **Scratch:** `getCoalescedEvents` + rAF batching + midpoints se quadratic curves → fast swipe par gaps nahi. Coverage check ab time-throttled (200ms). Resize ke baad bhi coordinates sahi.
- **Confetti:** 70 → 36 (mobile) / 56 pieces, ~2.1s → ~1.3s, host `pointer-events-none`.
- **Petals:** 16 → 8 (mobile) / 14, per-petal `drop-shadow` filter hataya. Hero loops (petals, Ken Burns, shimmer, scroll arrow) pause hote hain jab envelope band ho, hero off-screen ho, ya tab hidden ho (verified: 20 running → 20 paused → 20 running).
- **Ken Burns:** `alternate` loop (koi jump nahi), `will-change: transform`, absolute layer → CLS 0.
- **Lenis sync:** GSAP ticker se Lenis chalta hai; timeline line fast flick ke beech me bhi geometry se ≤ 0.001 match.
- **Wasted animation hataya:** ~30 elements par `background-position` shimmer (main-thread repaint, barely visible) → sirf hero names par. Music bars `height` → `scaleY`.
- **Reduced motion (re-tested):** envelope 0.5s crossfade, 0 hidden elements, timeline line full, 0 petals, 0 running animations, Lenis off, scratch keyboard se kaam karta hai, confetti nahi.
- Limit: numbers headless Edge + CDP CPU throttle ke hain, real phone ke nahi. Real mid-range Android par ek baar check karna.

## 2026-09-25 — Phase 3 Card A (Ivory & Gold Royal) ✅
**Card A** (`templates/cardA/`) — `index.tsx` root + ek file per section: `Envelope`, `Hero`, `Greeting`, `DateReveal`, `Countdown`, `Events`, `Gallery`, `Location`, `Rsvp`, `Footer`, `MusicButton`. Look: `cardA.module.css` (scoped), `decor.tsx` (arch, dove, divider, floral corner, petal, event icons), `fonts.ts` (Great Vibes + Cormorant Garamond).
- Envelope: wax seal (monogram) do tukdon me crack → flap 3D rotateX → letter slide out → site. Tap hi music unlock karta hai.
- Hero: Ken Burns cover (na ho to damask pattern fallback), falling petals (CSS), arch frame + doves.
- Greeting: `greeting(config)`, couple photo arch frame me, invitation message word-by-word scroll fade.
- Scratch date: 3 gold-foil canvas tiles, teeno scratch hone par confetti.
- Countdown, events timeline (line scroll par draw hoti hai), gallery (scroll-snap swipe + lightbox), venue + map + directions, RSVP `<dialog>` → WhatsApp, footer, floating music button.
- Har section `has()` se hide hota hai. `prefers-reduced-motion` par petals/shimmer/Lenis band.

**Shared behaviour** (`components/shared/`, bina styling — har card apna look dega): `useCountdown`, `useAudio`, `useSmoothScroll` (Lenis + ScrollTrigger), `ScratchCard`, `rsvp.ts` (WhatsApp link + optional Google Sheet webhook). `lib/config.ts` me `toDate` / `formatDate` / `dateParts` add hue (date local midnight par parse hoti hai, UTC shift nahi).

**Rule 3 fix (architecture change):** template B select karne par bhi Card A ka CSS/fonts/JS page par load ho raha tha (static registry imports; lazy `import()` se bhi fix nahi hua). Ab `registry.ts` me folder names hain, aur `next.config.ts` build time par `@selected-card` alias ko sirf selected folder par point karta hai. Verified: B/C build me Card A ka ek bhi byte nahi, A build me B–E nahi. ⚠️ Template badalne ke baad `npm run dev` restart karna padta hai.

- Placeholder images generate kiye (`public/client/photos`, `gallery`). `song.mp3` abhi nahi hai — music button tab tak khud hide rehta hai.
- `next.config.ts`: `turbopack.root` set (home folder me ek stray `package-lock.json` hai jiski wajah se warning aati thi).
- Verified (headless Edge, 390px + 1440px): envelope → open → har section, scratch + confetti, RSVP modal, music play/pause (generated test tone se), console errors 0. Saare optional fields + events hata ke: sections hide, 0 errors, 0 broken images. Build ✅ lint ✅ tsc ✅.

## 2026-09-25 — Phase 2 Config System ✅
- `lib/types.ts` — `ClientConfig` type (poora data contract), `CardProps = { config }`. `template` ka type `registry.ts` se aata hai, to naya card add karne par type khud update hota hai.
- `lib/config.ts` — `has(value)`: undefined / null / "" (whitespace bhi) / [] → false → section hide. Convention: har section `has(x) && ...` me wrap. `greeting(config)`: `openingGreeting` override, warna religion default.
- `client.config.ts` — named export `clientConfig`, top par comment block, sample data: Salim & Neha, muslim, template A, 3 events (Mehndi/Nikah/Walima), venue, RSVP number.
- `app/page.tsx` — ab card ko `config` prop pass karta hai (cards khud config import nahi karte).
- `registry.ts` — `satisfies Record<string, ComponentType<CardProps>>` → har card ka props type check hota hai.
- Cards A–E — plain text dump of config (wiring check only). Har card independent copy, sirf `lib/` import.
- Verified: build ✅ lint ✅. Saare optional fields hata ke (template C) build ✅, koi optional section render nahi hua. `""` / `[]` values par bhi hide ✅. `template: "Z"` → TS error ✅. Config wapas original par restore.
- Note: sample asset paths (`/client/photos/cover.jpg` etc.) abhi exist nahi karte — Phase 3 me placeholder images daalni hongi.

## 2026-09-25 — Phase 1 Setup ✅
- Next.js 16.3.6 (App Router, TS) + Tailwind v4 + ESLint scaffold. Tailwind v4 me `tailwind.config` file nahi hoti — config `app/globals.css` (`@theme`) me hoti hai.
- Installed: `gsap`, `@gsap/react`, `lenis`.
- Folders: `public/client/{photos,gallery,music}`, `templates/cardA..E`, `components/shared` (empty, `.gitkeep`).
- `templates/cardX/index.tsx` — placeholder heading "Card X - Coming Soon", koi shared import nahi.
- `templates/registry.ts` — sirf yahi file template ID → card map karti hai. `TemplateId` type yahin se.
- `client.config.ts` — abhi sirf `template` field (typed, galat value par TS error).
- `app/page.tsx` — config se template padh ke registry se sirf wahi card render.
- Boilerplate hataya: default page, Vercel/Next SVGs, Geist fonts, metadata (Rule 6: no SEO).
- Verified: `npm run build` ✅, `npm run lint` ✅, routes sirf `/` + `/_not-found`. Dev server par A → C switch sirf config change se ✅. Client-side `.next/static` me kisi card ka text nahi; unselected cards sirf server chunk me (browser ko serve nahi hote).

## 2026-09-25
- `docs/` banaya: `RULES.md` (PDF se rules), `TASKS.md` (main task list), `PROGRESS.md` (ye file).
