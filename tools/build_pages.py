import sys, os
root = sys.argv[1]
import time
VER = time.strftime('%Y%m%d%H%M')  # stamped on the css and js links so phones never keep an old copy

HEAD = '''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#040817">
  <link rel="icon" href="assets/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500..800&family=Figtree:wght@400..800&family=Cormorant+Garamond:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/store.css?v={ver}">
  <script type="speculationrules">{{"prefetch": [{{"where": {{"href_matches": "/*"}}, "eagerness": "moderate"}}]}}</script>
</head>
<body data-page="{page}">
  <script>if(/[?&]debug=1/.test(location.search)){{window.addEventListener("error",function(e){{var d=document.getElementById("dbg")||document.body.appendChild(Object.assign(document.createElement("pre"),{{id:"dbg"}}));d.style.cssText="position:fixed;left:0;right:0;bottom:0;z-index:99999;max-height:45%;overflow:auto;margin:0;padding:10px;background:#fff;color:#b00020;font:12px/1.4 monospace;white-space:pre-wrap";d.textContent+=(e.message||"resource failed: "+((e.target&&(e.target.src||e.target.href))||"?"))+" @ "+(e.filename||"").split("/").pop()+":"+(e.lineno||"")+" | "}},true)}}</script>
  <script>(function(){{try{{var d=document,h=d.documentElement;if(d.body.dataset.page!=="home"||matchMedia("(prefers-reduced-motion: reduce)").matches||(!/[?&]intro=1/.test(location.search)&&sessionStorage.getItem("asif_intro")))return;h.classList.add("intro-on");setTimeout(function(){{h.classList.remove("intro-on")}},5000)}}catch(e){{}}}})()</script>
  <div id="site-header"></div>
  <main>
{body}
  </main>
  <div id="site-footer"></div>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
  <script src="js/data.js?v={ver}"></script>
  <script src="js/store.js?v={ver}"></script>
</body>
</html>
'''

def ic(d, sw="2"):
    return f'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'
X = ic('<path d="M6 6l12 12M18 6 6 18"/>')
FIL = ic('<path d="M4 5h16l-6 8v6l-4-2v-4z"/>')
ARROW = ic('<path d="M5 12h14M13 6l6 6-6 6"/>', "2.2")
CHECK = ic('<path d="m5 12.5 4.5 4.5L19 7.5"/>', "2.4")
LIST = ic('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>')
BOOK = ic('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7"/>')
SHIRT = ic('<path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3a4 4 0 0 1-8 0z"/>')
TRUCK = ic('<path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>')
SWAP = ic('<path d="M7 7h12l-3-3M17 17H5l3 3"/>')
CASH = ic('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>')
STORE_I = ic('<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3M10 20v-5h4v5"/>')
PIN = ic('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>')
CLOCK = ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')
PHONE = ic('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>')
WA = ic('<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/>')
MAIL = ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>')
SEARCH = ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')
USER = ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>')
BOX = ic('<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9"/>')
CHILD = ic('<circle cx="12" cy="6" r="3"/><path d="M8 21v-6l-2-4h12l-2 4v6M10 21v-4h4v4"/>')
CART = ic('<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/>')
HEART = ic('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>')

IDS = {"hero": "1764337482439-ae67981bff34", "shelves": "1599901723404-e38e7192b930", "darkShelves": "1625053376622-e462848c453f", "curved": "1582087152266-3fbaf83bc952",
  "corridor": "1724825918953-f1632b74d2a2", "library": "1709282960420-93fdc7b516cd", "shirts": "1598032895397-b9472444bf93", "student": "1642140027867-e5983a32119c",
  "pencils": "1629652487043-fb2825838f8c", "flatlay": "1654931800100-2ecf6eee7c64", "notebooks": "1566869112473-77c4fb94359c", "backpack": "1726726192148-af52008ff663",
  "walnut": "1736506159776-22ca388780fa", "bookStack": "1781629784120-3c0cc98b233f"}
def url(key, w):
    return f"https://images.unsplash.com/photo-{IDS[key]}?auto=format&amp;fit=crop&amp;q=70&amp;w={w}"
def photo(key, w=1800, alt="", eager=False, sizes="100vw"):
    ws = sorted({max(480, w // 2), w, min(2400, w * 3 // 2)})
    srcset = ", ".join(f"{url(key, x)} {x}w" for x in ws)
    load = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy"'
    return f'<img class="img-fade" src="{url(key, w)}" srcset="{srcset}" sizes="{sizes}" alt="{alt}" {load} decoding="async">'

def head(crumbs, h1, p=None, h1id=None, img="shelves"):
    c = ''.join(f'<a href="{h}">{l}</a>' for h, l in crumbs[:-1]) + f'<span>{crumbs[-1][1]}</span>'
    idattr = f' id="{h1id}"' if h1id else ''
    para = f'\n      <p>{p}</p>' if p else ''
    return f'''    <section class="page-head"><div class="page-head__img">{photo(img, 1600)}</div><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">{c}</nav>
      <h1{idattr} class="wsplit">{h1}</h1>{para}
    </div></section>'''

HOME = ('index.html', 'Home')
P = {}

P['index.html'] = dict(page='home', title='Asif Books & Uniform | School books, uniforms & stationery in Gulshan-e-Iqbal',
  desc="Order your child's complete school book list, uniform and stationery from Asif Books & Uniform, Gulshan-e-Iqbal, Karachi. Delivery across Karachi or same-day store pickup.",
  body=f'''    <section class="cine" id="hero" aria-roledescription="carousel" aria-label="Books, uniforms, stationery and novels">
      <h1 class="sr-only">Asif Books &amp; Uniform: school books, uniforms, stationery and novels in Gulshan-e-Iqbal, Karachi</h1>
      <div class="cine__slides" id="cine-slides"></div>
      <div class="cine__ui wrap">
        <button class="cine__arrow" type="button" data-cine="-1" aria-label="Previous scene">{ARROW}</button>
        <div class="cine__dots" id="cine-dots" role="tablist" aria-label="Choose a scene"></div>
        <button class="cine__arrow" type="button" data-cine="1" aria-label="Next scene">{ARROW}</button>
        <button class="cine__pause" type="button" data-cine-pause aria-label="Pause the scenes" aria-pressed="false"><span></span></button>
      </div>
      <ul class="cine__trust wrap"><li>{CHECK}Playgroup to Matric</li><li>{CHECK}Books covered in store</li><li>{CHECK}Cash on delivery</li><li>{CHECK}Free delivery over Rs 5,000</li></ul>
    </section>

    <section class="section kit-section" id="kit-sec">
      <div class="wrap">
        <div class="kit-intro reveal" id="kit-start">
          <div><p class="kicker">School kit finder</p>
          <h2 class="wsplit">Your child's whole list, priced in two taps.</h2></div>
          <div><p>Choose the school and class. We load every prescribed textbook, register and stationery item, and you can add the uniform and bag in the same order.</p>
          <ul class="kit-points">
            <li>{CHECK}<span>Current editions</span></li>
            <li>{CHECK}<span>Untick what you have</span></li>
            <li>{CHECK}<span>Sizes confirmed by phone</span></li>
          </ul></div>
        </div>
        <div class="kit reveal" id="kit" role="region" aria-label="School kit finder" style="--i:1">
          <div class="kit__pick">
            <p class="kit__step"><span>1</span>Your school</p>
            <div class="kit__schools" id="kit-schools"></div>
            <p class="kit__step"><span>2</span>Their class</p>
            <div class="kit__classes" id="kit-classes"></div>
            <label class="kit__kid"><span>Child's name <em>(optional, keeps each child's kit separate in the cart)</em></span><input id="kit-kid" placeholder="e.g. Ayesha" autocomplete="off" maxlength="30"></label>
            <p class="kit__foot">School not listed? <a href="https://wa.me/923000000000" target="_blank" rel="noopener">WhatsApp us a photo of the list</a>.</p>
          </div>
          <div class="kit__body" id="kit-body" aria-live="polite"></div>
        </div>
      </div>
    </section>

    <section class="names" id="names" aria-label="School lists we stock">
      <p class="names__label wrap">Lists ready for the 2026–27 session</p>
      <div class="names__row" aria-hidden="true"></div>
      <div class="names__row" aria-hidden="true"></div>
    </section>

    <section class="section explore" id="counters" data-tone="books" aria-label="Our four counters">
      <div class="wrap">
        <div class="section-head reveal">
          <div><p class="kicker">Our four counters</p><h2 class="wsplit">Four counters, one checkout</h2><p>Everything a school year needs, from the same shop and the same cart.</p></div>
          <a class="text-link" href="shop.html">Shop everything{ARROW}</a>
        </div>
        <div class="tabs tabs--glass tabs--wide" role="tablist" id="x-tabs" aria-label="Counters">
          <button class="tab" role="tab" id="xt-0" aria-controls="xp-0" aria-selected="true" data-x="0">Textbooks<small data-dept-count="books"></small></button>
          <button class="tab" role="tab" id="xt-1" aria-controls="xp-1" aria-selected="false" data-x="1">Uniforms<small data-dept-count="uniforms"></small></button>
          <button class="tab" role="tab" id="xt-2" aria-controls="xp-2" aria-selected="false" data-x="2">Stationery<small data-dept-count="stationery"></small></button>
          <button class="tab" role="tab" id="xt-3" aria-controls="xp-3" aria-selected="false" data-x="3">Bags &amp; bottles<small data-dept-count="bags"></small></button>
        </div>
        <div class="explore__body reveal">
          <div class="xdeck" aria-hidden="true">
            <figure class="xfig is-on">{photo("shelves", 1000, "", sizes="(max-width: 860px) 100vw, 45vw")}</figure>
            <figure class="xfig">{photo("student", 1000, "", sizes="(max-width: 860px) 100vw, 45vw")}<span class="xfig__chip"><span class="crest crest--xs" style="background:#1f4fa3">GGS</span>Embroidered crests, matched to each school's sample</span></figure>
            <figure class="xfig">{photo("pencils", 1000, "", sizes="(max-width: 860px) 100vw, 45vw")}</figure>
            <figure class="xfig">{photo("backpack", 1000, "", sizes="(max-width: 860px) 100vw, 45vw")}</figure>
          </div>
          <div class="xpanels">
          <article class="xpanel" role="tabpanel" id="xp-0" aria-labelledby="xt-0" data-tone="books">
            <p class="kicker">Counter 01, Textbooks</p>
            <h3>Every title on the list, in the right edition.</h3>
            <p class="xpanel__lead">Playgroup to Class 10, checked against each school's 2026–27 list before it's packed. Covered in store if you ask.</p>
            <ul class="xpanel__facts"><li>{CHECK}Current session editions only</li><li>{CHECK}Wrong edition replaced free</li><li>{CHECK}Plastic covering, Rs 40 a book</li></ul>
            <div class="xpanel__ctas"><a class="btn btn--primary" href="shop.html?cat=books">Shop textbooks</a><a class="btn btn--glass" href="school-lists.html">Load a school list</a></div>
          </article>
          <article class="xpanel" role="tabpanel" id="xp-1" aria-labelledby="xt-1" data-tone="uniforms" hidden>
            <p class="kicker">Counter 02, Uniforms</p>
            <h3>Stitched to each school's colour and crest.</h3>
            <p class="xpanel__lead">Shirts, trousers, skirts, sweaters, ties and PE kits in the school's approved fabric. Not sure of the size? Slide to your child's age.</p>
            <ul class="xpanel__facts"><li>{CHECK}Sizes 22 to 38</li><li>{CHECK}Free hem alterations in 7 days</li><li>{CHECK}Easy size exchanges</li></ul>
            <div id="home-size"></div>
            <div class="xpanel__ctas"><a class="btn btn--primary" href="uniforms.html">Find your school's uniform</a></div>
          </article>
          <article class="xpanel" role="tabpanel" id="xp-2" aria-labelledby="xt-2" data-tone="stationery" hidden>
            <p class="kicker">Counter 03, Stationery</p>
            <h3>Registers, geometry and colour, ready for day one.</h3>
            <p class="xpanel__lead">The registers and copies each class asks for, plus geometry boxes, calculators and art supplies we keep in stock all year.</p>
            <ul class="xpanel__facts"><li>{CHECK}Ruled to the school's pattern</li><li>{CHECK}Name labels printed for you</li><li>{CHECK}Faulty items replaced free</li></ul>
            <div class="xpanel__ctas"><a class="btn btn--primary" href="shop.html?cat=stationery">Shop stationery</a></div>
          </article>
          <article class="xpanel" role="tabpanel" id="xp-3" aria-labelledby="xt-3" data-tone="bags" hidden>
            <p class="kicker">Counter 04, Bags and bottles</p>
            <h3>Built to survive a full school year.</h3>
            <p class="xpanel__lead">Padded backpacks, trolleys, steel bottles and lunch boxes chosen for strength, with a six-month warranty on zips and straps.</p>
            <ul class="xpanel__facts"><li>{CHECK}Junior and senior sizes</li><li>{CHECK}Six-month zip warranty</li><li>{CHECK}Food-grade bottles</li></ul>
            <div class="xpanel__ctas"><a class="btn btn--primary" href="shop.html?cat=bags">Shop bags and bottles</a></div>
          </article>
          </div>
        </div>
        <ul class="perks">
          <li><span class="perks__ic">{TRUCK}</span><span><b>Free delivery over Rs 5,000</b><small>Across Karachi, Rs 250 below that</small></span></li>
          <li><span class="perks__ic">{CASH}</span><span><b>Cash on delivery</b><small>Or JazzCash, Easypaisa, bank transfer</small></span></li>
          <li><span class="perks__ic">{SWAP}</span><span><b>7-day size exchange</b><small>Uniforms swapped at the counter</small></span></li>
          <li><span class="perks__ic">{BOOK}</span><span><b>Covering, Rs 40 a book</b><small>Covered and labelled before packing</small></span></li>
        </ul>
      </div>
    </section>

    <section class="section section--canvas" id="bundle">
      <div class="wrap">
        <div class="section-head reveal"><div><p class="kicker">Back-to-school bundle <span class="kicker__tag">Save up to 10%</span></p><h2 class="wsplit">Build a bundle, save as you add</h2><p>Choose one item from each counter. Two counters save 5%, three save 8%, all four save 10%.</p></div></div>
        <p class="builder-for" id="builder-for"></p>
        <div class="builder" id="builder">
          <div class="builder__steps" id="builder-steps"></div>
          <aside class="bsum">
            <div class="bsum__head"><strong>Your bundle</strong><span id="builder-count">0 of 4 counters</span></div>
            <div class="bsum__orb"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffdb4d"/><stop offset="1" stop-color="#ff9f1a"/></linearGradient></defs><circle cx="60" cy="60" r="52" class="bsum__ringbg"/><circle cx="60" cy="60" r="52" class="bsum__ring" id="builder-ring"/></svg><div><b id="builder-big">0%</b><small>saved</small></div></div>
            <div class="bsum__ladder"><span class="bsum__track"><i id="builder-fill"></i></span><ol id="builder-tiers"></ol></div>
            <ul class="bsum__list" id="builder-list"></ul>
            <div class="summary__row"><span>Items</span><span id="builder-sub">Rs 0</span></div>
            <div class="summary__row summary__row--disc"><span>Bundle saving (<span id="builder-pct">0%</span>)</span><span id="builder-save">Rs 0</span></div>
            <div class="summary__total"><span>Bundle total</span><span class="price" id="builder-total">Rs 0</span></div>
            <p class="bsum__hint" id="builder-hint"></p>
            <button class="btn btn--primary btn--block" id="builder-add" disabled>{CART}Add bundle to cart</button>
          </aside>
        </div>
      </div>
    </section>

    <section class="section browse" id="browse">
      <div class="wrap">
        <div class="section-head reveal">
          <div><p class="kicker">Shop the shelves</p><h2 class="wsplit">Best sellers, or every book by class</h2></div>
          <div class="seg seg--glass" role="tablist" aria-label="Browse" id="browse-seg">
            <button type="button" role="tab" aria-selected="true" aria-controls="bp-best" data-browse="best">{CART}Best sellers</button>
            <button type="button" role="tab" aria-selected="false" aria-controls="bp-shelves" data-browse="shelves">{BOOK}Shelves by class</button>
          </div>
        </div>
        <div class="bpanel" id="bp-best" role="tabpanel">
          <div class="tabs tabs--glass" role="tablist" id="best-tabs" aria-label="Best seller departments">
            <button class="tab" role="tab" aria-selected="true" data-set="all">All</button>
            <button class="tab" role="tab" aria-selected="false" data-set="books">Books</button>
            <button class="tab" role="tab" aria-selected="false" data-set="uniforms">Uniforms</button>
            <button class="tab" role="tab" aria-selected="false" data-set="stationery">Stationery</button>
          </div>
          <div class="grid" id="best"></div>
          <div class="offers">
        <a class="offer offer--gold" href="shop.html?sale=1">
          <span class="offer__body"><small class="offer__tag">On offer now</small><strong>Bag and backpack deals</strong><span data-offer-sale>Reduced bags and backpacks</span><span class="offer__go">Shop offers{ARROW}</span></span>
          <span class="offer__art" data-offer-art="bg-senior" aria-hidden="true"></span>
        </a>
          </div>
        </div>
        <div class="bpanel room" id="bp-shelves" role="tabpanel" hidden>
          <div class="room__bg">{photo("darkShelves", 1400, "")}</div>
          <div class="room__head">
            <p>Every textbook we stock, shelved the way it is in the shop.</p>
            <div class="tabs tabs--glass" role="tablist" id="room-tabs" aria-label="School stage">
              <button class="tab" role="tab" aria-selected="false" data-stage="early">Early years</button>
              <button class="tab" role="tab" aria-selected="true" data-stage="primary">Primary</button>
              <button class="tab" role="tab" aria-selected="false" data-stage="middle">Middle</button>
              <button class="tab" role="tab" aria-selected="false" data-stage="matric">Matric</button>
            </div>
          </div>
          <div class="bookcase"><div class="bookcase__inner" id="room-case"></div></div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap">
        <div class="visit reveal">
          <div class="visit__img"><span class="visit__chip">{CLOCK}Open 7 days a week</span><img class="img-fade" src="assets/shop-interior.jpg" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1599901723404-e38e7192b930?auto=format&amp;fit=crop&amp;q=70&amp;w=1200'" alt="The Asif Books counter with stacked textbooks, registers, pencils and folded uniforms" loading="lazy"></div>
          <div class="visit__body">
            <p class="kicker" style="color:var(--gold-400)">Visit</p>
            <h2>Come to the store</h2>
            <p>Bring your list, try uniforms on, and have books covered while you wait.</p>
            <dl><dt>Address</dt><dd data-store="address"></dd><dt>Hours</dt><dd data-store="hours"></dd><dt>Phone</dt><dd data-store="phone"></dd></dl>
            <div class="visit__actions"><a class="btn btn--primary" href="contact.html">Get directions</a><a class="btn btn--glass" href="https://wa.me/923000000000" target="_blank" rel="noopener">Chat on WhatsApp</a></div>
          </div>
        </div>
        <div class="signup reveal" style="margin-top:28px">
          <div class="signup__art" data-su-books aria-hidden="true"></div>
          <div><h2>Get told when your school's list arrives</h2><p>One email per session when new book lists and uniform stock land. No spam.</p></div>
          <form id="signup" novalidate><label class="sr-only" for="su-email">Email address</label><input class="input" id="su-email" type="email" placeholder="you@example.com" autocomplete="email"><button class="btn btn--primary" type="submit">Notify me</button></form>
        </div>
      </div>
    </section>''')

P['shop.html'] = dict(page='shop', title='Shop | Asif Books &amp; Uniform', desc='Shop textbooks, school uniforms, stationery and bags from Asif Books &amp; Uniform, Gulshan-e-Iqbal, Karachi.',
  body=head([HOME, ('', 'Shop')], 'Shop everything', 'Textbooks, uniforms, stationery and bags, all from our Gulshan-e-Iqbal store.', 'shop-title', 'library') + f'''
    <div class="wrap shop">
      <aside class="filters" id="filters" aria-label="Filters">
        <div class="filter-head"><h3>Filters</h3><button class="icon-btn" id="filter-close" aria-label="Close filters">{X}</button></div>
        <div><h4>Department</h4><div class="opt-list" id="f-cat"></div></div>
        <div id="fl-class-wrap"><h4>Class <small>(textbooks)</small></h4><div class="chips" id="fl-class"></div></div>
        <div id="fl-school-wrap"><h4>School <small>(uniforms)</small></h4><div class="chips" id="fl-school"></div></div>
        <div class="range"><h4>Price</h4><input type="range" id="f-max" min="200" step="100" aria-label="Maximum price"><div class="range__vals"><span>Rs 200</span><span id="f-max-val"></span></div></div>
        <div><label class="opt"><span><input type="checkbox" id="f-sale">On offer only</span></label></div>
      </aside>
      <section aria-live="polite">
        <div class="shop__bar">
          <button class="btn btn--ghost btn--sm filter-toggle" id="filter-toggle">{FIL}Filters</button>
          <span class="count" id="shop-count"></span>
          <label><span class="sr-only">Sort by</span><select class="select" id="sort">
            <option value="popular">Most popular</option><option value="low">Price, low to high</option>
            <option value="high">Price, high to low</option><option value="name">Name, A to Z</option></select></label>
        </div>
        <div class="active-filters" id="active"></div>
        <div id="results"></div>
      </section>
    </div>''')

P['product.html'] = dict(page='product', title='Product | Asif Books &amp; Uniform', desc='Product details from Asif Books &amp; Uniform.', body='''
    <div class="wrap">
      <nav class="crumbs crumbs--light" id="crumbs" aria-label="Breadcrumb" style="margin:26px 0 0"></nav>
      <div class="pdp" id="pdp"></div>
    </div>
    <section class="section section--canvas"><div class="wrap">
      <div class="section-head"><h2 id="related-title">You may also need</h2></div>
      <div class="grid" id="related"></div>
      <div id="recent-wrap" hidden style="margin-top:64px"><div class="section-head"><h2>Recently viewed</h2></div><div class="grid" id="recent"></div></div>
    </div></section>
    <div class="sticky-buy" id="sticky-buy"></div>''')

P['school-lists.html'] = dict(page='lists', title='School book lists | Asif Books &amp; Uniform', desc='Choose your school and class to order the complete 2026-27 book list, registers and stationery in one go.',
  body=head([HOME, ('', 'School book lists')], 'School book lists', "Every prescribed textbook, register and stationery item for your child's class. Untick what you already have, change quantities, then add the rest to your cart.", img='curved') + '''
    <div class="wrap lister">
      <div>
        <form class="lister__pick" id="list-form">
          <label class="field"><span>School</span><select class="select" id="l-school"></select></label>
          <label class="field"><span>Class</span><select class="select" id="l-class"></select></label>
          <button class="btn btn--dark" type="submit">Load list</button>
        </form>
        <div id="list-out" aria-live="polite"></div>
      </div>
      <aside class="summary" id="summary"></aside>
    </div>''')

P['uniforms.html'] = dict(page='uniforms', title='School uniforms | Asif Books &amp; Uniform', desc="School uniforms stitched to each school's approved pattern. Shirts, trousers, sweaters, ties and PE kits.",
  body=head([HOME, ('', 'Uniforms')], 'School uniforms', 'Choose your school to see its full uniform. Not sure of the size? Use the size guide; hems are altered free within 7 days.', img='shirts') + '''
    <section class="section" style="padding-top:40px">
      <div class="wrap">
        <div class="schools" id="schools"></div>
        <div class="u-band" id="u-band">
          <div><h2 id="u-title">Uniform</h2><p>Stitched to the school's approved colour and fabric, with an embroidered crest. Free hem and sleeve alterations within 7 days.</p>
            <button class="btn btn--glass btn--sm" id="u-size">Open the size guide</button></div>
          <div class="u-band__art" id="u-band-art" aria-hidden="true"></div>
        </div>
        <div class="ubuild" id="u-build"></div>
        <h3 class="u-grid-title">Every piece</h3>
        <div class="grid" id="u-grid"></div>
      </div>
    </section>''')

P['cart.html'] = dict(page='cart', title='Your cart | Asif Books &amp; Uniform', desc='Review your cart.',
  body=head([HOME, ('', 'Cart')], 'Your cart', img='bookStack') + '''
    <div class="wrap cart-page" id="cart-page"></div>''')

P['checkout.html'] = dict(page='checkout', title='Checkout | Asif Books &amp; Uniform', desc='Checkout.',
  body=head([HOME, ('cart.html', 'Cart'), ('', 'Checkout')], 'Checkout', 'No online payment needed. We confirm every order by phone or WhatsApp before dispatch.', img='bookStack') + '''
    <div class="wrap checkout">
      <div>
        <ol class="stepper"><li class="is-on"><span>Contact</span></li><li><span>Delivery</span></li><li><span>Payment</span></li></ol>
        <form id="co-form" novalidate>
          <section class="panel">
            <h3>Contact details</h3>
            <div class="form-grid">
              <label class="field"><span>Full name</span><input class="input" name="name" autocomplete="name"><em class="field__err"></em></label>
              <label class="field"><span>Mobile number</span><input class="input" name="phone" type="tel" inputmode="tel" placeholder="0300 1234567" autocomplete="tel"><em class="field__err"></em></label>
              <label class="field full"><span>Email (optional, for your receipt)</span><input class="input" name="email" type="email" autocomplete="email"></label>
            </div>
          </section>
          <section class="panel">
            <h3>Delivery or pickup</h3>
            <div class="radio-cards radio-cards--2">
              <label class="rcard"><input type="radio" name="method" value="delivery" checked><span><strong>Home delivery</strong><small>Anywhere in Karachi</small></span><span class="rcard__price" id="ship-price">Rs 250</span></label>
              <label class="rcard"><input type="radio" name="method" value="pickup"><span><strong>Store pickup</strong><small>Gulshan-e-Iqbal, ready in 4 to 6 hours</small></span><span class="rcard__price">Free</span></label>
            </div>
            <div class="collapse" id="addr-fields"><div>
              <div class="form-grid" style="margin-top:18px">
                <label class="field full"><span>Address</span><input class="input" name="address" placeholder="House no., street, block" autocomplete="street-address"><em class="field__err"></em></label>
                <label class="field"><span>Area</span><select class="select" name="area" id="area-sel"></select><em class="field__err"></em></label>
                <label class="field"><span>Nearest landmark (optional)</span><input class="input" name="landmark"></label>
              </div>
              <p class="note" id="co-eta" style="margin-top:10px"></p>
              <p style="font-weight:700;margin:18px 0 10px">Delivery time</p>
              <div class="radio-cards radio-cards--4" id="slots"></div>
            </div></div>
          </section>
          <section class="panel">
            <h3>Payment</h3>
            <div class="radio-cards">
              <label class="rcard"><input type="radio" name="pay" value="cod" checked><span><strong>Cash on delivery or at pickup</strong><small>Pay when you receive the order</small></span></label>
              <label class="rcard"><input type="radio" name="pay" value="jazz"><span><strong>JazzCash</strong><small>Mobile account transfer</small></span></label>
              <label class="rcard"><input type="radio" name="pay" value="easy"><span><strong>Easypaisa</strong><small>Mobile account transfer</small></span></label>
              <label class="rcard"><input type="radio" name="pay" value="bank"><span><strong>Bank transfer</strong><small>IBFT to our business account</small></span></label>
            </div>
            <div class="collapse is-closed"><div><p class="pay-detail" data-for="jazz">After you place the order we'll WhatsApp you the JazzCash account number. Send a screenshot of the payment to confirm.</p></div></div>
            <div class="collapse is-closed"><div><p class="pay-detail" data-for="easy">After you place the order we'll WhatsApp you the Easypaisa account number. Send a screenshot of the payment to confirm.</p></div></div>
            <div class="collapse is-closed"><div><p class="pay-detail" data-for="bank">Our bank details are sent with the order confirmation. Orders are packed once the transfer shows in our account.</p></div></div>
            <label class="field" style="margin-top:18px"><span>Order notes (optional)</span><textarea class="textarea" name="notes" placeholder="Child's name for labels, section, anything we should know"></textarea></label>
            <label class="check" style="margin-top:16px"><input type="checkbox" id="save-details" checked>Save my details on this device for next time</label>
          </section>
        </form>
      </div>
      <aside class="summary" id="co-summary"></aside>
    </div>''')

P['order.html'] = dict(page='order', title='Order confirmed | Asif Books &amp; Uniform', desc='Your order confirmation.', body='''
    <div class="wrap confirm" id="order"></div>''')

P['track.html'] = dict(page='track', title='Track an order | Asif Books &amp; Uniform', desc='Track your Asif Books &amp; Uniform order.',
  body=head([HOME, ('', 'Track an order')], 'Track an order', 'Enter the order number from your confirmation to see where it is.', img='bookStack') + f'''
    <div class="wrap" style="max-width:760px;padding-top:40px;padding-bottom:100px">
      <form class="lister__pick" id="track-form" style="grid-template-columns:1fr auto">
        <label class="field"><span>Order number</span><input class="input" id="track-no" placeholder="AB-123456" autocomplete="off"></label>
        <button class="btn btn--dark" type="submit">{SEARCH}Track</button>
      </form>
      <p class="note" id="track-recent"></p>
      <div id="track-out"></div>
    </div>''')

P['account.html'] = dict(page='account', title='Your account | Asif Books &amp; Uniform', desc='Your orders, children and saved details.',
  body=f'''    <section class="page-head"><div class="page-head__img">{photo("library", 1800)}</div><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>Account</span></nav>
      <h1 id="acc-hello">Your account</h1><p>Orders, children's school lists and delivery details, all in one place.</p>
    </div></section>
    <div class="wrap account">
      <nav class="acc-nav" id="acc-nav" role="tablist" aria-label="Account sections">
        <button role="tab" data-acc="orders">{BOX}Orders</button>
        <button role="tab" data-acc="children">{CHILD}Children and lists</button>
        <button role="tab" data-acc="details">{USER}Your details</button>
        <button role="tab" data-acc="saved">{HEART}Saved items</button>
      </nav>
      <div id="acc-out"></div>
    </div>''')

P['wishlist.html'] = dict(page='wishlist', title='Saved items | Asif Books &amp; Uniform', desc='Items you saved for later.',
  body=head([HOME, ('', 'Saved items')], 'Saved items', 'Everything you tapped the heart on, ready when you are.', img='notebooks') + '''
    <section class="section" style="padding-top:40px"><div class="wrap" id="wish"></div></section>''')

P['about.html'] = dict(page='about', title='About us | Asif Books &amp; Uniform', desc='About Asif Books &amp; Uniform, Gulshan-e-Iqbal, Karachi.',
  body=head([HOME, ('', 'About us')], 'A neighbourhood shop for school season', 'Books, uniforms and stationery for the families of Gulshan-e-Iqbal.', img='corridor') + f'''
    <section class="section"><div class="wrap">
      <div class="split">
        <div class="prose reveal">
          <p class="kicker">Our story</p>
          <h2>Biggest. Better. Evolved.</h2>
          <p>Asif Books &amp; Uniform serves families across Gulshan-e-Iqbal with everything a school year needs: prescribed textbooks, registers, stationery and uniforms stitched to each school's pattern.</p>
          <p>The online store brings the counter to your phone. Choose your school and class, and the full list is ready to review, packed by the same team, with the same care.</p>
        </div>
        <div class="split__img reveal" style="--i:1"><img class="img-fade" src="assets/shop-interior.jpg" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1599901723404-e38e7192b930?auto=format&amp;fit=crop&amp;q=70&amp;w=1200'" alt="The Asif Books counter" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
      </div>
      <div class="about-grid">
        <figure class="reveal">{photo("shelves", 700, "Books on a shelf")}</figure>
        <figure class="reveal" style="--i:1">{photo("pencils", 700, "Pencils and crayons in tin buckets")}</figure>
        <figure class="reveal" style="--i:2">{photo("shirts", 700, "Folded school shirts with ties")}</figure>
      </div>
    </div></section>
    <section class="section section--canvas"><div class="wrap">
      <div class="section-head"><div><h2>What you can count on</h2></div></div>
      <div class="steps">
        <div class="step reveal"><div class="step__num">{BOOK}</div><h3>The right edition</h3><p>Every title is checked against the school's current list. Wrong edition? We replace it free.</p></div>
        <div class="step reveal" style="--i:1"><div class="step__num">{SHIRT}</div><h3>A proper fit</h3><p>Sizes 22 to 38, try-ons in store, and free hem alterations within 7 days.</p></div>
        <div class="step reveal" style="--i:2"><div class="step__num">{STORE_I}</div><h3>A real shop behind it</h3><p>Visit, call or WhatsApp. The same people who pack your order answer your questions.</p></div>
      </div>
    </div></section>''')

P['policies.html'] = dict(page='policies', title='Policies | Asif Books &amp; Uniform', desc='Delivery, returns, privacy and terms of sale.',
  body=head([HOME, ('', 'Policies')], 'Delivery, returns and policies', 'The plain-language version of how we deliver, exchange and look after your information.', img='library') + '''
    <div class="wrap policy">
      <nav class="policy__nav" aria-label="Policy sections"><a href="#delivery" class="is-on">Delivery and pickup</a><a href="#returns">Returns and exchanges</a><a href="#privacy">Privacy</a><a href="#terms">Terms of sale</a></nav>
      <div class="prose">
        <section id="delivery"><h2>Delivery and pickup</h2>
          <p>We deliver across Karachi. Orders confirmed before 2 pm are delivered in Gulshan-e-Iqbal the same day; other areas take 1 to 2 working days. Delivery costs Rs 250 and is free on orders over Rs 5,000.</p>
          <p>Store pickup is free. We'll message you when your order is packed, usually within 4 to 6 hours. Bring your order number.</p></section>
        <section id="returns"><h2>Returns and exchanges</h2>
          <ul><li>Uniforms: exchange any size within 7 days, unwashed with tags on. Hem and sleeve alterations are free in the same period.</li>
          <li>Books: if a title doesn't match your school's prescribed edition, we replace it free. Covered or written-in books can't be returned for other reasons.</li>
          <li>Stationery and bags: faulty items are replaced free within 7 days.</li></ul></section>
        <section id="privacy"><h2>Privacy</h2>
          <p>We use your name, phone number and address only to confirm and deliver your order. We never sell your details. Saved details on this website stay on your device until our account system is connected.</p></section>
        <section id="terms"><h2>Terms of sale</h2>
          <p>Prices are in Pakistani rupees and include all taxes. Orders are confirmed by phone or WhatsApp before dispatch; we'll tell you then if anything is out of stock. Promo codes can't be combined and expire at the end of the session.</p>
          <p class="note">Have these policies reviewed by the shop owner before launch.</p></section>
      </div>
    </div>''')

P['contact.html'] = dict(page='contact', title='Visit the store | Asif Books &amp; Uniform', desc='Find Asif Books &amp; Uniform in Gulshan-e-Iqbal, Karachi. Store hours, directions, phone and FAQs.',
  body=head([HOME, ('', 'Visit the store')], 'Visit the store', 'Bring your list or your child for a uniform fitting. Books can be covered while you wait.', img='hero') + f'''
    <div class="wrap contact">
      <div>
        <h2>Find us</h2>
        <div class="info-list">
          <div class="info">{PIN}<div><strong>Address</strong><span data-store="address"></span></div></div>
          <div class="info">{CLOCK}<div><strong>Store hours</strong><span data-store="hours"></span></div></div>
          <div class="info">{PHONE}<div><strong>Phone</strong><a href="tel:+923000000000" data-store="phone"></a></div></div>
          <div class="info">{WA}<div><strong>WhatsApp orders</strong><a href="https://wa.me/923000000000" target="_blank" rel="noopener">Send your school list as a photo</a></div></div>
          <div class="info">{MAIL}<div><strong>Email</strong><a href="mailto:orders@asifbooks.pk" data-store="email"></a></div></div>
        </div>
      </div>
      <div class="map"><iframe title="Map showing Gulshan-e-Iqbal, Karachi" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Gulshan-e-Iqbal+Block+13+Karachi&amp;output=embed"></iframe></div>
    </div>
    <section class="section" id="faq" style="scroll-margin-top:140px"><div class="wrap">
      <div class="section-head"><h2>Questions parents ask</h2></div>
      <div class="faq">
        <details open><summary>How long does delivery take?</summary><p>Orders confirmed before 2 pm are delivered in Gulshan-e-Iqbal the same day. Other Karachi areas take 1 to 2 working days. Delivery costs Rs 250 and is free on orders over Rs 5,000.</p></details>
        <details><summary>Can I collect my order from the store?</summary><p>Yes. Choose store pickup at checkout and we'll message you when it's packed, usually within 4 to 6 hours. Pickup is free.</p></details>
        <details><summary>My school isn't listed. Can you still help?</summary><p>Send a clear photo of the school's book list on WhatsApp. We'll reply with the price and availability of every item, usually within an hour during store hours.</p></details>
        <details><summary>What if a book is the wrong edition?</summary><p>If we supply an edition that doesn't match your school's list, we replace it free. Bring it to the store or we'll collect it with your next delivery.</p></details>
        <details><summary>How do uniform exchanges work?</summary><p>Any uniform item can be exchanged for another size within 7 days, as long as tags are on and it hasn't been washed. Hem and sleeve alterations are free within the same period.</p></details>
        <details><summary>Which payment methods do you accept?</summary><p>Cash on delivery or at pickup, JazzCash, Easypaisa and bank transfer. We confirm every order by phone or WhatsApp before dispatch.</p></details>
      </div>
    </div></section>''')

P['404.html'] = dict(page='notfound', title='Page not found | Asif Books &amp; Uniform', desc='Page not found.', body='''
    <div class="wrap notfound">
      <div id="nf-case"></div>
      <h1>This page isn't on our shelves</h1>
      <p>The link may be old, or the page has moved. Try the shop, or start from your school's book list.</p>
      <div class="confirm__actions"><a class="btn btn--primary" href="school-lists.html">Find my school list</a><a class="btn btn--ghost" href="shop.html">Browse the shop</a></div>
    </div>''')

for f, d in P.items():
    open(os.path.join(root, f), 'w', encoding='utf8').write(HEAD.format(ver=VER, **d))
print('wrote', len(P), 'pages')
