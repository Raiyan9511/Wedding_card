# Wedding Invitation Website System — Rules

> Source: `Wedding-Invite-System-Rules.pdf`. Ye rules non-negotiable hain — har kaam se pehle padho.

## 1. Goal
Freelance system: har naye client ke liye premium animated wedding invitation website jaldi aur consistent bane. Client WhatsApp par card choose karta hai, developer sirf config file me details daal kar deploy karta hai. Start 5 cards (A–E), scale 20+ tak bina purana code tode.

## 2. Client Workflow
1. Client WhatsApp par contact → developer saare card previews bhejta hai.
2. Client card select karta hai (e.g. "Card A").
3. Client details deta hai: bride/groom naam, date, events time, venue, photo, song, RSVP contact.
4. Developer naya GitHub repo banata hai (e.g. `salim-weds-neha`).
5. Repo me poora card-library codebase, sirf `client.config.ts` edit hoti hai.
6. Vercel se deploy → client ka alag live link.
7. Live site par SIRF selected card — baaki cards ka koi trace/route/access nahi, URL guess karke bhi nahi.

## 3. Core Rules
- **Rule 1 — One Codebase, Many Cards:** saare cards ek codebase me reusable templates. Naya card = naya template folder.
- **Rule 2 — Config-Driven Selection:** `client.config.ts` decide karti hai kaunsa card render ho (`template = "A" | "B" | ...`). Sirf ye file + client photos/song badal kar naya site launch. Koi aur code file touch nahi.
- **Rule 3 — Only Selected Card Visible:** unselected cards build output me render/route/reachable nahi hone chahiye.
- **Rule 4 — Alag Repo + Alag Deployment:** har client ka naya repo (`bride-weds-groom`) + naya Vercel project.
- **Rule 5 — Independent Design:** "same layout, alag color" nahi. Har card ka unique layout, section order, decorative style (birds, flowers, arches, foil, dividers) aur animation feel. Sirf core functionality (RSVP, countdown, scratch-date, music) shared.
- **Rule 6 — Excluded Scope:** ❌ Dress code section. ❌ SEO / metadata / Open Graph / sitemap.

## 4. Tech Stack
| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Animation | GSAP + ScrollTrigger |
| Smooth Scroll | Lenis |
| Hosting | Vercel |

## 5. Folder Structure
```
project-root/
  client.config.ts        -> sirf ye file har client ke liye edit hoti hai
  /public/client/         -> client ki photo, song, gallery images
  /templates/
    /cardA/               -> Ivory & Gold Royal
    /cardB/               -> Maroon Floral
    /cardC/               -> Pastel Garden
    /cardD/               -> Sky Blue Coastal
    /cardE/               -> Desert Palace
    /cardF/ ... /cardT/   -> future cards
    registry.ts           -> template ID -> component mapping
  /components/shared/     -> RSVP modal, Countdown, ScratchCard, MusicButton, MapSection
```

## 6. Scaling Rule
- Naya card = `/templates/cardX/` + `registry.ts` me ek line.
- Purane card ka code kabhi touch nahi.
- Naya card bhi independent design (Rule 5), copy-paste reskin nahi.
- Shared components change karo to saare cards par test karo.
- 20+ cards par internal "card catalog" (previews + naam) banao.

## 7. `client.config.ts` Fields
- `template` — "A"–"E" (future "F"…"T")
- `brideName`, `groomName`, `monogram` (e.g. "S&N")
- `weddingDate`, `tagline`, `religion` (muslim / hindu / christian / general) — greeting text control
- `invitationMessage`, `openingGreeting` (optional)
- `events: [{ name, time, icon }]`
- `venue: { name, address, mapEmbedUrl, mapsLink }`
- `rsvp: { deadline, whatsappNumber, googleSheetWebhook? }`
- `music: { src, autoplayAfterOpen }`
- `coverImage`, `couplePhoto`, `gallery[]`
- `theme: { primary, accent, background }` — optional override

**Rule:** khaali field → wo section cleanly hide. Koi broken/empty box nahi.

## 8. Required Sections (har card me)
1. Envelope intro — wax seal tap → 3D open → music start
2. Hero — couple names + cover image + floating petals/particles
3. Greeting + invitation message (religion-based)
4. Scratch-to-reveal date (Day / Month / Year tiles)
5. Live countdown
6. Events timeline (scroll-animated)
7. Photo gallery
8. Location — venue card + Google Map embed
9. RSVP — modal form + WhatsApp pre-filled message
10. Footer + floating music play/pause button

Decorative: birds/swans, flowers, floral borders, Mughal arches, gold foil — har card me alag combination.

## 9. Per-Client Deployment Checklist
- [ ] Naya GitHub repo: `bride-weds-groom`
- [ ] `client.config.ts` me template + details
- [ ] `/public/client/` me photo, couple photo, gallery, song
- [ ] Vercel import, project name `bride-weds-groom`
- [ ] Live test: sirf selected card, baaki koi route accessible nahi
- [ ] RSVP WhatsApp number + Google Sheet webhook verify
- [ ] Client ko final link WhatsApp par bhejo
