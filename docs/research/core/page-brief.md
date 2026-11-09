# core landing — page brief

Source: https://core-landing-tau.vercel.app/ → local route `/` (`src/app/page.tsx`).

## Sections (in order) and files
| Section | Behavior | File |
|---|---|---|
| Header | Overlay nav, socials, pulsing "Demo" CTA; mobile slide-in menu | `navbar.tsx` |
| Hero | Poster → muted looping video after `load`; clip-path inset on scroll; status ticker every 4.5 s; waitlist form | `hero.tsx` |
| Producto intro | Logo blur-in, heading reveal | `product-intro.tsx` |
| Cómo funciona (≥1024px) | Pinned scene (~655vh): 3 stacked cards advance with scroll, side copy fades; last card expands to full screen, chat heading + chat demo enter; exit clip-path | `product-cards.tsx` |
| Cómo funciona (<1024px) | Stacked cards with scroll reveals + chat card | `product-cards.tsx` |
| Card media | Bayer 8x8 dithering via Paper Shaders `ImageDithering`; sky card drifts | `card-media.tsx` |
| Chat demo | Cycles 4 ChatGPT/Claude conversations (8 s each) | `chat-demo.tsx` |
| Agentes | 240vh sticky; 4 agents fly in; heading un-blurs | `agents-section.tsx` |
| Agent characters | WebGL2 ray-marched shapes, eyes follow pointer and blink; SVG fallback | `agent-character.tsx` |
| FAQ | Sticky intro + Base UI accordion | `faq.tsx` |
| Cierre | Rounded photo CTA, email-or-phone form | `cierre.tsx` |
| Footer | Newsletter form, link columns, "core" wordmark with agents that spring away from a fine pointer | `footer.tsx` |

## Tokens
Ink `#211f1e`, orange `#f83e00`, cream `#f8ebd7`, blue `#0093d8`, green `#00f790`, muted `#f4f3f2`, muted-fg `#6b6866`, border `#e6e4e2`.
Fonts: DM Sans (body), Bricolage Grotesque (display, 600, -0.03em), Geist Mono (event times). `h1,h2,h3 { text-wrap: balance }`.

## Assets
All under `public/sites/core/` mirroring the source paths (`/brand`, `/images/producto`, `/images/cierre`, `/video`).
