/* Catalog data for the storefront.
   Replace with the shop's real schools, prices and stock before launch.
   School names below are placeholders, not real partner schools. */

const STORE = {
  name: "Asif Books & Uniform",
  motto: "Biggest. Better. Evolved.",
  area: "Gulshan-e-Iqbal, Karachi",
  address: "Shop no. 00, Main University Road, Block 13, Gulshan-e-Iqbal, Karachi",
  phone: "+92 300 0000000",
  whatsapp: "923000000000",
  email: "orders@asifbooks.pk",
  hours: "Mon to Sat, 10:00 am to 10:00 pm. Sunday 2:00 pm to 9:00 pm",
  freeDeliveryOver: 5000,
  deliveryFee: 250,
  pickupNote: "Ready for pickup in 4 to 6 hours",
  /* Where new orders are sent. Paste a form endpoint here (Formspree, Getform, a Google Apps Script
     web app, or your own API). When set, every order is POSTed to it as JSON the moment it is placed.
     Left empty, the customer is asked to send the order to the shop on WhatsApp. */
  orderEndpoint: "",
  /* Shown on the receipt when the customer picks one of these. Leave a value empty and the receipt
     says the account details will be sent on WhatsApp instead. */
  payments: {
    jazz: "",  // e.g. "JazzCash 0300 0000000, Asif Books"
    easy: "",  // e.g. "Easypaisa 0300 0000000, Asif Books"
    bank: "",  // e.g. "Meezan Bank, Asif Books & Uniform, IBAN PK00 MEZN 0000 0000 0000 0000"
  },
};

const SCHOOLS = [
  { id: "ggs", name: "Gulshan Grammar School", short: "GGS", campus: "Block 13-D", color: "#1f4fa3", accent: "#c8102e", shirt: "#ffffff", bottom: "#3b4a63", sweater: "#1f4fa3" },
  { id: "cms", name: "Crescent Model School", short: "CMS", campus: "Block 6", color: "#0d6b4f", accent: "#f2b705", shirt: "#ffffff", bottom: "#1d2b3a", sweater: "#0d6b4f" },
  { id: "nhs", name: "New Horizon School", short: "NHS", campus: "Block 10-A", color: "#7b1e3a", accent: "#f0c419", shirt: "#e9f1ff", bottom: "#2c2c34", sweater: "#7b1e3a" },
  { id: "ana", name: "Al-Noor Academy", short: "ANA", campus: "Block 2", color: "#185f8c", accent: "#9bd3f2", shirt: "#ffffff", bottom: "#1a3550", sweater: "#185f8c" },
  { id: "bfs", name: "Bright Future School", short: "BFS", campus: "Block 4", color: "#b0510f", accent: "#1f2a44", shirt: "#fff7e8", bottom: "#2a3346", sweater: "#1f2a44" },
  { id: "kps", name: "Karachi Public Grammar", short: "KPG", campus: "Block 7", color: "#2d2a6e", accent: "#e6b800", shirt: "#f4f7fb", bottom: "#4a4f5a", sweater: "#2d2a6e" },
];

const CLASSES = [
  { id: "pg", name: "Playgroup", n: "PG", stage: "early" },
  { id: "nur", name: "Nursery", n: "N", stage: "early" },
  { id: "kg", name: "KG", n: "KG", stage: "early" },
  { id: "1", name: "Class 1", n: "1", stage: "primary" },
  { id: "2", name: "Class 2", n: "2", stage: "primary" },
  { id: "3", name: "Class 3", n: "3", stage: "primary" },
  { id: "4", name: "Class 4", n: "4", stage: "primary" },
  { id: "5", name: "Class 5", n: "5", stage: "primary" },
  { id: "6", name: "Class 6", n: "6", stage: "middle" },
  { id: "7", name: "Class 7", n: "7", stage: "middle" },
  { id: "8", name: "Class 8", n: "8", stage: "middle" },
  { id: "9", name: "Class 9", n: "9", stage: "matric" },
  { id: "10", name: "Class 10", n: "10", stage: "matric" },
];

/* Subject cover colours: [base, circle, level numeral] */
const SUBJECTS = {
  eng:  { name: "English",        title: "English Reader",       c: ["#1f5fd1", "#3f7ff0", "#f7d100"] },
  gram: { name: "English",        title: "Grammar & Writing",    c: ["#0e2a54", "#1b3f78", "#7cc4ff"] },
  urdu: { name: "Urdu",           title: "Urdu Qaida",           c: ["#11795a", "#1b9a74", "#ffe066"] },
  math: { name: "Mathematics",    title: "Mathematics",          c: ["#d2452f", "#e4634e", "#ffe7a3"] },
  sci:  { name: "Science",        title: "General Science",      c: ["#0f8a8c", "#21a7a9", "#fff3b0"] },
  sst:  { name: "Social Studies", title: "Social Studies",       c: ["#a1621b", "#bf7b2c", "#fff1c9"] },
  isl:  { name: "Islamiat",       title: "Islamiat",             c: ["#2f6b2f", "#3f8a3f", "#f7d100"] },
  comp: { name: "Computer",       title: "Computer Studies",     c: ["#5b3cc4", "#7656e0", "#9ff0ff"] },
  sindhi:{ name: "Sindhi",        title: "Sindhi Reader",        c: ["#b0306a", "#cc4a85", "#ffe3f0"] },
  art:  { name: "Art",            title: "Colour & Draw",        c: ["#f7d100", "#ffe14d", "#0e2a54"], dark: true },
  phy:  { name: "Physics",        title: "Physics",              c: ["#20407f", "#2f58a8", "#ffd84d"] },
  chem: { name: "Chemistry",      title: "Chemistry",            c: ["#7a2d8c", "#9643aa", "#ffe08a"] },
  bio:  { name: "Biology",        title: "Biology",              c: ["#1d7a3e", "#2a9a52", "#d8ffb0"] },
  pak:  { name: "Pakistan Studies", title: "Pakistan Studies",   c: ["#0b6b3a", "#138a4c", "#ffffff"] },
};

const STAGE_SUBJECTS = {
  early:   ["eng", "urdu", "math", "art"],
  primary: ["eng", "gram", "urdu", "math", "sci", "sst", "isl", "comp", "sindhi"],
  middle:  ["eng", "gram", "urdu", "math", "sci", "sst", "isl", "comp", "sindhi"],
  matric:  ["eng", "urdu", "math", "phy", "chem", "bio", "pak", "isl", "comp"],
};

const STAGE_BASE_PRICE = { early: 380, primary: 520, middle: 690, matric: 840 };

function priceFor(stage, subj, classIdx) {
  const base = STAGE_BASE_PRICE[stage] + classIdx * 18;
  const bump = { gram: -60, art: -120, comp: 40, sindhi: -90, isl: -40, phy: 60, chem: 60, bio: 60 }[subj] || 0;
  return Math.round((base + bump) / 10) * 10;
}

const PRODUCTS = [];

/* Books: one per subject per class */
CLASSES.forEach((cl, i) => {
  STAGE_SUBJECTS[cl.stage].forEach((s) => {
    const sub = SUBJECTS[s];
    const title = cl.stage === "early" && s === "urdu" ? "Urdu Qaida" : (s === "urdu" ? "Urdu Kitab" : sub.title);
    PRODUCTS.push({
      id: `bk-${s}-${cl.id}`,
      type: "book",
      cat: "books",
      name: `${title} ${cl.n === "PG" || cl.n === "N" || cl.n === "KG" ? cl.name : cl.n}`,
      subject: sub.name,
      subj: s,
      title,
      classId: cl.id,
      price: priceFor(cl.stage, s, i),
      desc: `${sub.name} textbook for ${cl.name}, current session edition as prescribed by partner schools. Each copy is checked for printing defects before packing.`,
      specs: { Subject: sub.name, Class: cl.name, Edition: "2026–27 session", Binding: "Paperback, sewn", Language: s === "urdu" ? "Urdu" : s === "sindhi" ? "Sindhi" : "English" },
    });
  });
});

/* Notebooks / registers — used in every list */
const NOTEBOOKS = [
  { id: "nb-single-80", name: "Single-line register, 80 pages", price: 120, art: "notebook", tint: "#3798ff" },
  { id: "nb-single-200", name: "Single-line register, 200 pages", price: 240, art: "notebook", tint: "#0e2a54" },
  { id: "nb-four-80", name: "Four-line English copy, 80 pages", price: 110, art: "notebook", tint: "#17845a" },
  { id: "nb-math-120", name: "Maths squared register, 120 pages", price: 170, art: "notebook", tint: "#d2452f" },
  { id: "nb-drawing", name: "Drawing book, A4, 40 sheets", price: 260, art: "sketch", tint: "#f7d100" },
  { id: "nb-practical", name: "Practical journal, 100 pages", price: 220, art: "notebook", tint: "#7a2d8c" },
];
NOTEBOOKS.forEach((n) => PRODUCTS.push({ ...n, type: "stationery", cat: "stationery", sub: "Notebooks", desc: "Smooth 70 gsm paper with a stitched spine that lays flat. Lined to the school-approved pattern.", specs: { Paper: "70 gsm", Binding: "Stitched", Size: n.art === "sketch" ? "A4" : "Register size" } }));

const STATIONERY = [
  { id: "st-pencil-12", name: "HB pencils, pack of 12", price: 280, art: "pencils", tint: "#f7d100", sub: "Writing" },
  { id: "st-gel-10", name: "Blue gel pens, pack of 10", price: 450, art: "pens", tint: "#1f5fd1", sub: "Writing" },
  { id: "st-eraser-sharp", name: "Eraser and sharpener set", price: 120, art: "eraser", tint: "#d2452f", sub: "Writing" },
  { id: "st-geo", name: "Geometry box, 9 pieces", price: 650, art: "geometry", tint: "#0e2a54", sub: "Maths" },
  { id: "st-calc", name: "Scientific calculator", price: 3200, was: 3600, art: "calculator", tint: "#2a3346", sub: "Maths" },
  { id: "st-colors-24", name: "Colour pencils, 24 shades", price: 690, art: "colors", tint: "#17845a", sub: "Art" },
  { id: "st-crayons-16", name: "Wax crayons, 16 colours", price: 320, art: "crayons", tint: "#f08a24", sub: "Art" },
  { id: "st-glue", name: "Glue stick and scissors", price: 260, art: "scissors", tint: "#7a2d8c", sub: "Art" },
  { id: "st-cover-roll", name: "Book cover roll, transparent", price: 380, art: "roll", tint: "#9bd3f2", sub: "Covering" },
  { id: "st-labels-40", name: "Name labels, 40 stickers", price: 200, art: "labels", tint: "#3798ff", sub: "Covering" },
  { id: "st-pouch", name: "Zip pencil pouch", price: 450, art: "pouch", tint: "#3798ff", sub: "Writing" },
  { id: "st-highlight-5", name: "Highlighters, 5 colours", price: 420, art: "pens", tint: "#f7d100", sub: "Writing" },
];
STATIONERY.forEach((s) => PRODUCTS.push({ ...s, type: "stationery", cat: "stationery", desc: "Everyday school stationery from brands we stock year-round. Checked and replaced free if anything arrives faulty.", specs: { Category: s.sub } }));

const BAGS = [
  { id: "bg-junior", name: "Junior school backpack", price: 2950, art: "bag", tint: "#3798ff", sizes: ["14 in"] },
  { id: "bg-senior", name: "Senior backpack with laptop sleeve", price: 4800, was: 5400, art: "bag", tint: "#0e2a54", sizes: ["17 in"] },
  { id: "bg-trolley", name: "Trolley school bag", price: 6500, art: "trolley", tint: "#d2452f" },
  { id: "bg-bottle", name: "Steel water bottle, 600 ml", price: 1250, art: "bottle", tint: "#17845a" },
  { id: "bg-lunch", name: "Two-compartment lunch box", price: 950, art: "lunch", tint: "#f7d100" },
  { id: "bg-bottle-kids", name: "Kids sipper bottle, 450 ml", price: 790, art: "bottle", tint: "#f08a24" },
];
BAGS.forEach((b) => PRODUCTS.push({ ...b, type: "bag", cat: "bags", desc: "Padded straps, reinforced base and water-resistant fabric, chosen to survive a full school year.", specs: { Material: b.art === "bottle" ? "Food-grade steel" : "Polyester, 600D", Warranty: "6 months on zips and straps" } }));

/* Uniforms: per school */
/* for: who wears it. step: price added for each size up from the smallest (demo values, confirm with the shop). */
const UNIFORM_ITEMS = [
  { k: "shirt", name: "Shirt, half sleeve", art: "shirt", price: 1150, step: 50, for: "all", sizes: ["22", "24", "26", "28", "30", "32", "34", "36", "38"] },
  { k: "trouser", name: "Trousers", art: "trouser", price: 1450, step: 60, for: "boys", sizes: ["20", "22", "24", "26", "28", "30", "32", "34"] },
  { k: "skirt", name: "Skirt", art: "skirt", price: 1550, step: 60, for: "girls", sizes: ["22", "24", "26", "28", "30", "32", "34", "36"] },
  { k: "kameez", name: "Shalwar kameez", art: "kameez", price: 1850, step: 80, for: "girls", sizes: ["22", "24", "26", "28", "30", "32", "34", "36"] },
  { k: "sweater", name: "V-neck sweater", art: "sweater", price: 2350, step: 80, for: "all", sizes: ["22", "24", "26", "28", "30", "32", "34", "36", "38"] },
  { k: "tie", name: "School tie", art: "tie", price: 450, step: 50, for: "all", sizes: ["Junior", "Senior"] },
  { k: "pe", name: "PE kit, shirt and shorts", art: "pe", price: 1650, step: 70, for: "all", sizes: ["XS", "S", "M", "L", "XL"] },
];
SCHOOLS.forEach((sc) => {
  UNIFORM_ITEMS.forEach((u) => {
    const fill = u.k === "shirt" ? sc.shirt : u.k === "trouser" ? sc.bottom : u.k === "sweater" ? sc.sweater : u.k === "tie" ? sc.color : u.k === "pe" ? sc.color : sc.color;
    PRODUCTS.push({
      id: `un-${sc.id}-${u.k}`,
      type: "uniform",
      cat: "uniforms",
      name: `${sc.short} ${u.name}`,
      school: sc.id,
      art: u.art,
      tint: fill,
      accent: sc.accent,
      crest: sc.short,
      crestColor: sc.color,
      price: u.price + (sc.id === "kps" || sc.id === "ggs" ? 100 : 0),
      step: u.step,
      for: u.for,
      sizes: u.sizes,
      desc: `Official ${sc.name} pattern, stitched to the school's approved colour and fabric spec with the embroidered crest. Free alteration on hems within 7 days.`,
      specs: { School: sc.name, Fabric: u.k === "sweater" ? "Acrylic wool blend" : u.k === "tie" ? "Woven polyester" : "Poly-cotton 65/35", Care: "Machine wash cold, iron medium", Crest: "Embroidered" },
    });
  });
});

/* Novels and story books. Demo stock (well-known classics) and demo prices: replace with the shop's real titles. */
const NOVELS = [
  { id: "nv-pride", title: "Pride and Prejudice", author: "Jane Austen", price: 850, tint: "#7a1f2b" },
  { id: "nv-treasure", title: "Treasure Island", author: "Robert Louis Stevenson", price: 750, tint: "#1f4d3a" },
  { id: "nv-alice", title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", price: 700, tint: "#2c4f8a" },
  { id: "nv-garden", title: "The Secret Garden", author: "Frances Hodgson Burnett", price: 780, tint: "#3d6b2f" },
  { id: "nv-women", title: "Little Women", author: "Louisa May Alcott", price: 890, tint: "#8a4b2c" },
  { id: "nv-oliver", title: "Oliver Twist", author: "Charles Dickens", price: 950, tint: "#3a3a52" },
  { id: "nv-eighty", title: "Around the World in Eighty Days", author: "Jules Verne", price: 820, tint: "#a86a14" },
  { id: "nv-beauty", title: "Black Beauty", author: "Anna Sewell", price: 690, tint: "#23232e" },
];
NOVELS.forEach((n) => PRODUCTS.push({ ...n, name: n.title, type: "novel", cat: "novels", art: "novel", sub: n.author,
  desc: `${n.title} by ${n.author}. A paperback edition for young readers, home shelves and school libraries.`,
  specs: { Author: n.author, Format: "Paperback", Language: "English" } }));

/* Home page hero: four scenes the visitor can swipe through. Each scene is drawn in code.
   To show a filmed or rendered clip instead, add video: "assets/hero-books.mp4" (and optionally
   poster: "assets/hero-books.jpg") to a scene and it plays in place of the drawn one. */
const HERO_SLIDES = [
  { k: "books", bg: "hero", kicker: "Session 2026–27", title: "Textbooks", line: "Every title on your school's list, in the right edition.", cta: ["Shop textbooks", "shop.html?cat=books"], alt: ["Build my school kit", "#kit-start"] },
  { k: "uniforms", bg: "shirts", kicker: "Stitched to school spec", title: "Uniforms", line: "Each school's colour, fabric and embroidered crest.", cta: ["Find your uniform", "uniforms.html"], alt: ["Build the full uniform", "uniforms.html#u-build"] },
  { k: "stationery", bg: "flatlay", kicker: "Ready for day one", title: "Stationery", line: "Registers, geometry boxes, colours and everything in between.", cta: ["Shop stationery", "shop.html?cat=stationery"], alt: ["Bags and bottles", "shop.html?cat=bags"] },
  { k: "novels", bg: "curved", kicker: "For every reader", title: "Books & Novels", line: "Classics and story books to read beyond the syllabus.", cta: ["Shop novels", "shop.html?cat=novels"], alt: ["Browse the shelves", "#browse"] },
];

/* In-store service added from the school list builder; hidden from the shop grid */
PRODUCTS.push({ id: "sv-cover", type: "service", cat: "service", name: "Book covering service", price: 40, art: "roll", tint: "#9bd3f2", desc: "Clear plastic covering applied in-store before packing.", specs: { Service: "Per book" } });

/* Featured flags */
const FEATURED = ["bg-senior", "st-geo", "un-ggs-shirt", "bk-math-5", "st-colors-24", "un-cms-sweater", "bk-sci-7", "st-calc"];
const NEW_IN = ["bg-trolley", "st-pouch", "un-nhs-pe", "bk-comp-6"];

function getProduct(id) { return PRODUCTS.find((p) => p.id === id); }
function getSchool(id) { return SCHOOLS.find((s) => s.id === id); }
function getClass(id) { return CLASSES.find((c) => c.id === id); }
/* price for a chosen size; larger uniform sizes cost a little more */
function priceOf(p, opt) {
  if (!p) return 0;
  const i = p.step && p.sizes && opt ? p.sizes.indexOf(opt) : -1;
  return i > 0 ? p.price + i * p.step : p.price;
}

/* Book details to fill in before launch.
   BOOK_PUBLISHERS: subject id -> publisher, e.g. { math: "Oxford University Press" }.
   BOOK_COVERS: product id -> photo of the real cover, e.g. { "bk-math-5": "assets/covers/math-5.jpg" }.
   Anything left out keeps the illustrated cover and shows no publisher. */
const BOOK_PUBLISHERS = {};
const BOOK_COVERS = {};

/* School book list: books for the class, plus notebooks + stationery suited to the stage */
function buildList(schoolId, classId) {
  const cl = getClass(classId);
  if (!cl) return null;
  const books = PRODUCTS.filter((p) => p.type === "book" && p.classId === classId);
  // schools differ slightly: some drop Sindhi below class 3, some skip computer in early years
  const school = getSchool(schoolId);
  const skip = school && (school.id === "ana" || school.id === "bfs") && ["1", "2"].includes(classId) ? ["sindhi"] : [];
  const nb = cl.stage === "early"
    ? [["nb-four-80", 4], ["nb-drawing", 2]]
    : cl.stage === "matric"
      ? [["nb-single-200", 8], ["nb-practical", 3], ["nb-math-120", 2]]
      : [["nb-single-80", 6], ["nb-four-80", 2], ["nb-math-120", 2], ["nb-drawing", 1]];
  const st = cl.stage === "early"
    ? [["st-crayons-16", 1], ["st-pencil-12", 1], ["st-eraser-sharp", 1], ["st-glue", 1]]
    : cl.stage === "matric"
      ? [["st-gel-10", 1], ["st-geo", 1], ["st-calc", 1], ["st-highlight-5", 1]]
      : [["st-pencil-12", 1], ["st-eraser-sharp", 1], ["st-colors-24", 1], ["st-geo", Number(classId) >= 4 ? 1 : 0]];
  return {
    books: books.filter((b) => !skip.includes(b.subj)).map((b) => ({ id: b.id, qty: 1 })),
    notebooks: nb.map(([id, qty]) => ({ id, qty })),
    stationery: st.filter(([, q]) => q > 0).map(([id, qty]) => ({ id, qty })),
  };
}

/* Sample contents shown in the "look inside" preview. Illustrative only. */
const CHAPTERS = {
  eng: ["Stories from home", "Friends and family", "Our neighbourhood", "Poems to read aloud", "Letters and notes", "Adventures", "Review and practice"],
  gram: ["Nouns and pronouns", "Verbs and tenses", "Adjectives", "Punctuation", "Sentence building", "Paragraph writing", "Comprehension"],
  urdu: ["حروف تہجی", "الفاظ اور جملے", "کہانیاں", "نظمیں", "مضمون نویسی", "خط و کتابت", "مشق"],
  math: ["Numbers and place value", "Addition and subtraction", "Multiplication and division", "Fractions and decimals", "Geometry and shapes", "Measurement", "Data handling"],
  sci: ["Living things", "Plants around us", "Matter and materials", "Forces and motion", "Light and sound", "Earth and space", "Investigations"],
  sst: ["Our country", "Maps and directions", "Communities", "History of the region", "Government", "Resources", "Being a good citizen"],
  isl: ["Quran and Hadith", "Pillars of Islam", "Seerat-un-Nabi", "Akhlaq and adab", "Stories of the Prophets", "Duas", "Revision"],
  comp: ["Parts of a computer", "Using the keyboard", "Word processing", "Internet safety", "Drawing tools", "Intro to coding", "Projects"],
  sindhi: ["الف ب", "لفظ", "ڪهاڻيون", "نظم", "مشق"],
  art: ["Lines and shapes", "Colours", "Patterns", "Drawing animals", "Craft time"],
  phy: ["Physical quantities", "Kinematics", "Dynamics", "Turning effect of forces", "Work and energy", "Thermal physics", "Waves and sound"],
  chem: ["Fundamentals of chemistry", "Structure of atoms", "Periodic table", "Chemical bonding", "States of matter", "Solutions", "Electrochemistry"],
  bio: ["Introduction to biology", "Cells and tissues", "Cell cycle", "Enzymes", "Bioenergetics", "Nutrition", "Transport"],
  pak: ["Ideological basis", "Making of Pakistan", "Land and environment", "History since 1947", "Economy", "Population", "Culture"],
};

/* Photography: free-licence images from Unsplash, served from their CDN.
   For launch, download these into assets/ (or swap in the shop's own photos) and update the paths. */
const PHOTO = (id, w = 1600, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=72&w=${w}${h ? `&h=${h}` : ""}`;
const IMAGES = {
  hero: "1764337482439-ae67981bff34",       // bookstore tables and shelves
  shelves: "1599901723404-e38e7192b930",    // shelf close-up, shallow focus
  darkShelves: "1625053376622-e462848c453f",
  curved: "1582087152266-3fbaf83bc952",     // curved book wall
  corridor: "1724825918953-f1632b74d2a2",
  library: "1709282960420-93fdc7b516cd",
  shirts: "1598032895397-b9472444bf93",     // folded shirts with ties
  student: "1642140027867-e5983a32119c",
  pencils: "1629652487043-fb2825838f8c",    // pencil buckets
  flatlay: "1654931800100-2ecf6eee7c64",
  notebooks: "1566869112473-77c4fb94359c",
  backpack: "1726726192148-af52008ff663",   // orange backpack and pencils
  backpack2: "1535982330050-f1c2fb79ff78",
  walnut: "1736506159776-22ca388780fa",     // walnut wood grain for shelves
  bookStack: "1781629784120-3c0cc98b233f",
};

/* Demo promo codes. Replace with the shop's real offers. */
const PROMOS = {
  WELCOME5: { label: "5% off your first order", type: "pct", value: 5, min: 0 },
  LIST10: { label: "Rs 300 off book lists over Rs 6,000", type: "flat", value: 300, min: 6000 },
};

const DELIVERY_AREAS = [
  { name: "Gulshan-e-Iqbal", days: "Same day if ordered before 2 pm" },
  { name: "Gulistan-e-Jauhar", days: "Next working day" },
  { name: "PECHS", days: "Next working day" },
  { name: "North Nazimabad", days: "1 to 2 working days" },
  { name: "Federal B Area", days: "1 to 2 working days" },
  { name: "DHA", days: "1 to 2 working days" },
  { name: "Clifton", days: "1 to 2 working days" },
  { name: "Scheme 33", days: "Next working day" },
  { name: "Other, Karachi", days: "2 working days" },
];
const DELIVERY_SLOTS = ["10 am to 1 pm", "1 pm to 4 pm", "4 pm to 7 pm", "7 pm to 9 pm"];
const ORDER_STAGES = ["Order placed", "Confirmed by phone", "Packed and covered", "Out for delivery", "Delivered"];

/* Back-to-school bundle: pick one item per counter, save more as you add.
   Demo percentages; confirm with the shop owner before launch. */
const BUNDLE_TIERS = [0, 0, 5, 8, 10]; // index = number of counters picked
const BUNDLE_CATS = [
  { k: "books", title: "Pick a textbook", ids: ["bk-math-5", "bk-eng-5", "bk-sci-7", "bk-phy-9"] },
  { k: "uniforms", title: "Add a uniform piece", ids: ["un-ggs-shirt", "un-cms-sweater", "un-ana-trouser", "un-nhs-pe"] },
  { k: "stationery", title: "Choose stationery", ids: ["st-geo", "st-colors-24", "st-calc", "st-pouch"] },
  { k: "bags", title: "Finish with a bag or bottle", ids: ["bg-junior", "bg-senior", "bg-bottle", "bg-lunch"] },
];
