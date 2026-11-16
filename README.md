# Asif Books & Uniform — online store

Storefront for Asif Books & Uniform, Gulshan-e-Iqbal, Karachi. Plain HTML, CSS and JavaScript: no build step.

## Run it

```
python serve.py
```

then visit http://localhost:5520. `serve.py` is a plain static server that also shows the site's own `404.html` for missing pages, as Vercel, Netlify and GitHub Pages do once live. Opening `index.html` directly also works.

## Pages

| File | What it does |
| --- | --- |
| `index.html` | Home: swipeable cinematic hero with four scenes (Books & Novels, Uniforms, Stationery, Textbooks), two-panel school-kit finder, scroll-linked school names, the four counters as glass tabs, bundle builder, a Best sellers / Shelves by class switch, store visit, email sign-up |
| `school-lists.html` | Pick school + class, tick/untick items, covering and name-label add-ons, add all to cart, save the list to the account |
| `shop.html` | Catalogue with department, class, school, price and offer filters, search, sort |
| `product.html?id=…` | Gallery (drag-to-turn 3D book, front/spine/back views, crest close-up for uniforms), flip-open "look inside", sizes, delivery estimate by area, tabs, often bought together, recently viewed |
| `uniforms.html` | Uniform by school |
| `cart.html` | Cart, save for later, promo codes |
| `checkout.html` | Progress stepper, delivery or pickup, delivery time slots, COD / JazzCash / Easypaisa / bank transfer |
| `order.html` | Receipt with print, WhatsApp hand-off and tracking link |
| `track.html` | Order tracking timeline |
| `account.html` | Orders and reorder, children's schools and lists, saved details, saved items |
| `wishlist.html` | Saved items |
| `about.html`, `policies.html`, `contact.html`, `404.html` | About, delivery/returns/privacy/terms, store info and FAQs, not-found page |

`js/store.js` renders the header, footer, mega menu, cart drawer, quick view and every interactive piece. `css/store.css` holds the whole design system.

## Look and motion

- Opening sequence: the first time the home page opens in a visit, four photo panels rise, the shop name sets over them and the panels part to reveal the site (about three seconds; click, tap, Esc or "Skip intro" ends it; not shown to reduced-motion visitors). Add `?intro=1` to the address to replay it. The code is `wireIntro()` in `js/store.js`.
- Listings: a card shows the edition, author or size range, the percentage off, and turns its Add button into a quantity stepper once the item is in the cart. The shop page has a row of department pills and a grid or list switch.
- Hero: four video clips in `assets/hero/` (novels, uniforms, stationery, textbooks; 1280x720 MP4 with a first-frame JPG poster each). Only the scene on screen plays, each clip starts from its first frame, the next clip is fetched ahead, and playback stops off screen or when paused. Visitors with reduced motion or data saver get the still photographs instead. Each scene in `HERO_SLIDES` has `video`, `poster`, `vpos` / `mpos` (which part of the frame to keep on desktop / phone) and `dur` (seconds on screen). Swipe, drag, arrows, the named buttons or the arrow keys change scene.
- Menus: the Books and Uniforms panels open when the pointer rests on the word for a moment, not when it crosses the bar.
- Phones get a glass tab bar along the bottom (Home, Lists, Shop, Saved, Cart). A thin bar along the top shows scroll progress, and buttons, tabs and chips ripple when pressed. The scenes are listed in `HERO_SLIDES` in `js/data.js`. To use a filmed or rendered clip for a scene, add `video: "assets/your-clip.mp4"` (and optionally `poster`) to it.

- Palette: midnight (`--navy-950`), electric blue (`--blue-600` to `--cyan` gradient) and the logo's yellow (`--gold-500`), defined at the end of `css/store.css`.
- Type: Unbounded for headings, Figtree for text, Georgia inside the book mockups (Google Fonts).
- Smooth wheel scrolling on desktop uses Lenis 1.1.13 from jsDelivr; touch devices and visitors with reduced motion keep native scrolling. If the CDN is unreachable the site falls back to normal scrolling.
- Header: solid at the top of the page, frosted glass once content scrolls under it; it slides away while scrolling down and returns as soon as the visitor scrolls up (it stays put while the search box, mega menu or mobile menu is in use).
- 3D: floating products in the hero follow the pointer, product images tilt with a light glare, sections rise in with a slight tilt. All motion pauses for reduced-motion users.

## Replace before launch

In `js/data.js`:

- `STORE.orderEndpoint`: **set this before launch.** A form endpoint (Formspree, Getform, a Google Apps Script web app, or your own API). Every order is POSTed to it as JSON when it's placed. While it's empty, the confirmation page asks the customer to send the order to the shop on WhatsApp, with the message written for them.
- `STORE.payments`: the JazzCash, Easypaisa and bank account details shown on the receipt. Empty values tell the customer the details will come on WhatsApp.
- `BOOK_PUBLISHERS` (subject → publisher) and `BOOK_COVERS` (product id → cover photo): fill these in to show publishers and real cover photos instead of the illustrated covers.
- `UNIFORM_ITEMS`: `step` is the extra price per size up (demo values), `for` is boys, girls or all.
- `NOVELS`: eight well-known classics with demo prices; replace with the shop's real novels and story books.
- `STORE`: real address, phone, WhatsApp number (`923000000000` is a placeholder), email, hours, delivery fee, free-delivery threshold.
- `SCHOOLS`: the six schools are **placeholder names**. Replace with the schools the shop supplies, plus their uniform colours.
- `PROMOS`: `WELCOME5` and `LIST10` are demo codes.
- `BUNDLE_TIERS` / `BUNDLE_CATS`: the 5% / 8% / 10% bundle saving and the items offered are demo values; confirm with the owner.
- `DELIVERY_AREAS`, `DELIVERY_SLOTS`: real delivery times.
- Book prices, subjects per class (`STAGE_SUBJECTS`), per-school list differences in `buildList()`, uniform prices and sizes.

Also: the About page text and the policies need the owner's review, and the WhatsApp links in `index.html` and `contact.html` and the map in `contact.html` need the real details.

## Photography

Product pictures are stand-in stock photos, not photos of the shop's own stock: `PRODUCT_PHOTOS`, `UNIFORM_PHOTOS` and `SUBJECT_PHOTOS` in `js/data.js` hold Unsplash photo ids (every textbook of a subject shares that subject's photo, with a class tag on it), and `NOVEL_COVERS` holds Open Library cover ids for the novels. Name labels, the cover roll, skirts and shalwar kameez have no fair stock match and keep their drawn artwork. Replace all of these with photos of the real items before launch.

Other photos are free-licence images from Unsplash, loaded from Unsplash's image CDN (see `IMAGES` in `js/data.js`). For launch, either download them into `assets/` and point `IMAGES` at the local files, or replace them with the shop's own photos. `assets/shop-interior.jpg` is the client's own render.

## Shopping behaviour

- Kits, school lists, the uniform builder and the bundle go into the cart as named groups (with the child's name if given), each with "Remove all". Adding a set that's already in the cart asks before doubling it.
- The school and class picked in the kit finder carry over to the school lists page, the uniform page and the bundle.
- Search understands subjects, classes ("class 5", "kg"), school names and common words ("maths", "bag", "copy").
- Delivery dates use the area's delivery time with Monday to Saturday as working days; today's past time slots are disabled.
- Order tracking shows only the steps the shop has confirmed (`stage` on the order, once an order system is connected).
- Urdu: the button in the top bar switches the menus, main buttons, cart and checkout to Urdu (dictionary `UR` in `js/store.js`; add strings there). Product names stay in English.
- Phones: bundle options, best sellers and the shelves become swipeable rows; swipe the counters photo to change counter.
- Buttons, tabs and chips use a liquid-glass treatment (gradient body, top highlight, a glint that follows the pointer); blur is only used where there is something behind to blur.

## Editing the pages

The HTML pages are generated. Edit the templates in `tools/build_pages.py`, then run `python tools/build_pages.py .` from this folder to rewrite all 15 pages. Editing an `.html` file directly works too, but the next rebuild overwrites it.

## iPhone and iPad notes

- Every build stamps the CSS and JS links with a version (`store.css?v=…`), and `vercel.json` tells browsers to re-check pages, CSS and JS on each visit. After changing `css/` or `js/`, run `python tools/build_pages.py .` before deploying so phones pick up the new files.
- On touch devices the hero keeps one clip loaded at a time and releases the others. If the phone refuses autoplay (Low Power Mode), the scene shows a finished still (`assets/hero/*-still.jpg`) and starts playing on the first touch.
- The clips are H.264 MP4 with the index at the front of the file, which Safari needs to start them quickly. New clips should be exported the same way ("fast start" / "web optimised").

- To see script errors on a phone, add `?debug=1` to any page address: errors are printed in a white box at the bottom of the screen.

## Going live

Orders, accounts and saved items are kept in the visitor's browser and the order is handed to the shop over WhatsApp. For real order management, connect checkout and accounts to a backend (an order API, Shopify or WooCommerce) and add a payment gateway if online card payments are wanted.
