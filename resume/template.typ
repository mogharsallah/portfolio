// Print-quality CV — generated from src/data/resume.yaml
//
// Design system:
//  - Type scale: t-display, t-lg, t-md (body), t-sm, t-xs.
//  - Spacing scale: s-1, s-2, s-3, s-4.
//  - Color: ink / ink-soft / ink-muted for text, accent for emphasis.
//  - Leading: 0.75em globally. No per-block overrides.
//
// ATS conventions:
//  - Single-column layout in body sections (no side-by-side grids).
//  - "•" bullets, ASCII hyphen for separators, comma between fields.
//  - Canonical section names (Skills, Experience, Projects, Open Source).

#let data = json(sys.inputs.data)

// ─── Tokens ──────────────────────────────────────────────────────────────────

// Color
#let ink = rgb("#0E0F11")
#let ink-soft = rgb("#5C6066")
#let ink-muted = rgb("#8A8E94")
#let accent = rgb("#0F62FE")

// Type scale
#let t-display = 26pt
#let t-lg = 10.5pt
#let t-md = 9pt
#let t-sm = 8pt
#let t-xs = 7pt

// Spacing scale
#let s-1 = 4pt
#let s-2 = 8pt
#let s-3 = 14pt
#let s-4 = 22pt

// Fonts
#let sans = ("Inter",)
#let serif-body = ("Fraunces 9pt",)
#let serif-display = ("Fraunces 9pt",)
#let mono = ("JetBrains Mono",)

#let pad2(n) = if n < 10 { "0" + str(n) } else { str(n) }

// ─── Page setup ──────────────────────────────────────────────────────────────
#set page(
  paper: "a4",
  margin: (left: 14mm, right: 14mm, top: 14mm, bottom: 13mm),
  footer: context {
    let here = counter(page).get().first()
    let total = counter(page).final().first()
    set text(font: mono, size: t-xs, fill: ink-muted, tracking: 0.6pt)
    grid(
      columns: (1fr, auto),
      align: (left + horizon, right + horizon),
      upper("Mouhamed Gharsallah · gharsallah.com"),
      upper(pad2(here) + " / " + pad2(total)),
    )
  },
)

#set text(font: sans, size: t-md, fill: ink, lang: "en")
#set par(leading: 0.75em, justify: false)
#show link: it => it

// ─── Helpers ─────────────────────────────────────────────────────────────────

#let section(label) = {
  v(s-4, weak: true)
  block(
    width: 100%,
    stroke: (bottom: 0.6pt + ink),
    inset: (bottom: s-1),
    {
      box(circle(radius: 2.5pt, fill: accent, stroke: none))
      h(s-1)
      text(font: sans, weight: 600, size: t-sm, tracking: 1.7pt)[#upper(label)]
    },
  )
  v(s-3, weak: true)
}

#let bullet-list(items) = {
  for b in items {
    grid(
      columns: (10pt, 1fr),
      column-gutter: s-1,
      align: (top, top),
      text(size: t-md, fill: accent)[•],
      text(size: t-md, fill: ink)[#b],
    )
    v(s-1, weak: true)
  }
}

// Reusable entry: title row + optional meta + body + optional bullets + optional footer.
#let entry(
  title: none,
  period: none,
  meta: none,
  body: none,
  bullets: none,
  footer: none,
  gap-below: s-3,
) = block(below: gap-below, breakable: false)[
  #grid(
    columns: (1fr, auto),
    column-gutter: s-2,
    align: (left + bottom, right + bottom),
    title,
    if period != none {
      text(font: mono, size: t-xs, fill: ink-soft, tracking: 0.32pt)[#period]
    } else { [] },
  )
  #if meta != none [
    #v(s-1, weak: true)
    #text(size: t-sm, fill: ink-soft, style: "italic")[#meta]
  ]
  #if body != none [
    #v(if meta != none { s-2 } else { s-1 }, weak: true)
    #text(size: t-md, fill: ink)[#body]
  ]
  #if bullets != none and bullets.len() > 0 {
    v(s-1, weak: true)
    bullet-list(bullets)
  }
  #if footer != none [
    #v(s-1, weak: true)
    #text(font: mono, size: t-xs, fill: ink-soft, tracking: 0.3pt)[#footer]
  ]
]

// ─── Date formatting ─────────────────────────────────────────────────────────
#let month-names = (
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
)
#let year-of(s) = if s == none { "" } else { s.split("-").first() }
#let month-year(s) = {
  if s == none or s == "" { return "" }
  let parts = s.split("-")
  if parts.len() >= 2 {
    let m = int(parts.at(1))
    if m >= 1 and m <= 12 {
      return month-names.at(m - 1) + " " + parts.first()
    }
  }
  parts.first()
}
#let period-of(start, end) = {
  let s = month-year(start)
  let e = if end == none or end == "" { "Present" } else { month-year(end) }
  s + " - " + e
}

// ─── Header ──────────────────────────────────────────────────────────────────
#let basics = data.basics
#let cv = data.at("x_cv", default: none)

#block(above: 0pt, below: s-3)[
  #grid(
    columns: (1fr, auto),
    column-gutter: s-3,
    align: (left + bottom, right + bottom),
    [
      #text(font: serif-display, size: t-display, weight: 400, tracking: -0.5pt)[
        Mouhamed #text(font: serif-body, style: "italic", weight: 300, fill: accent)[Gharsallah]
      ]
      #v(s-1, weak: true)
      #text(size: t-md, weight: 500, fill: ink)[
        #basics.label#text(weight: 400, fill: ink-soft)[, #basics.location.city, #basics.location.countryCode]
      ]
    ],
    {
      let github = basics.profiles.find(p => p.network == "GitHub")
      let linkedin = basics.profiles.find(p => p.network == "LinkedIn")
      set text(font: mono, size: t-xs, fill: ink, tracking: 0.16pt)
      align(right)[
        #basics.email \
        #basics.url.replace("https://", "").replace("http://", "") \
        #if linkedin != none [linkedin.com/in/#linkedin.username \ ]
        #if github != none [github.com/#github.username]
      ]
    },
  )
  #v(s-2, weak: true)
  #line(length: 100%, stroke: 1.6pt + ink)
]

// ─── Summary ─────────────────────────────────────────────────────────────────
#if "summary" in basics and basics.summary != none [
  #section("Summary")
  #text(size: t-md, fill: ink)[#basics.summary]
]

// ─── Skills (single column for ATS) ──────────────────────────────────────────
#if data.skills.len() > 0 [
  #section("Skills")
  #for g in data.skills [
    #text(size: t-md, fill: ink)[
      #text(weight: 600)[#g.name:] #g.keywords.join(", ")
    ]
    #v(s-1, weak: true)
  ]
]

// ─── Experience ──────────────────────────────────────────────────────────────
#section("Experience")
#for w in data.work [
  #entry(
    title: text(size: t-lg, weight: 600, tracking: -0.05pt)[
      #text(fill: accent)[#w.position]#text(fill: ink, weight: 400)[, #w.name]
    ],
    period: period-of(w.startDate, w.at("endDate", default: none)),
    meta: w.at("location", default: none),
    body: w.summary,
    bullets: w.at("highlights", default: ()),
    footer: if "x_site" in w and w.x_site != none and w.x_site.stack.len() > 0 {
      w.x_site.stack.join(", ")
    } else { none },
  )
]

// ─── Education ───────────────────────────────────────────────────────────────
#if data.education.len() > 0 [
  #section("Education")
  #for ed in data.education [
    #entry(
      title: text(size: t-lg, weight: 600, fill: ink)[#ed.institution],
      period: year-of(ed.startDate) + " - " + year-of(ed.at("endDate", default: "")),
      body: [
        #if "studyType" in ed and ed.studyType != none [#ed.studyType, ]
        #ed.area
        #if "location" in ed and ed.location != none [#text(fill: ink-soft)[, #ed.location]]
      ],
      meta: ed.at("score", default: none),
      gap-below: s-2,
    )
  ]
]

// ─── Projects ────────────────────────────────────────────────────────────────
#let side-projects = data.projects.filter(p => "x_site" in p and p.x_site != none)
#if side-projects.len() > 0 [
  #section("Projects")
  #for p in side-projects [
    #block(below: s-2)[
      #text(size: t-md, weight: 600, fill: ink)[#p.name]
      #h(s-1)
      #text(font: mono, size: t-xs, fill: ink-soft, tracking: 0.3pt)[#p.x_site.year]
      #if "description" in p and p.description != none [
        #linebreak()
        #text(size: t-md, fill: ink)[#p.description]
      ]
    ]
  ]
]

// ─── Open Source ─────────────────────────────────────────────────────────────
#if cv != none and cv.oss.len() > 0 [
  #section("Open Source")
  #for o in cv.oss [
    #block(below: s-2)[
      #text(size: t-md, weight: 600, fill: ink)[#o.repo]
      #h(s-1)
      #text(font: mono, size: t-xs, fill: ink-soft, tracking: 0.3pt)[#o.stars]
      #linebreak()
      #text(size: t-md, fill: ink)[#o.note]
    ]
  ]
]

// ─── Languages ───────────────────────────────────────────────────────────────
#if data.languages.len() > 0 [
  #section("Languages")
  #stack(dir: ltr, spacing: s-3,
    ..data.languages.map(l => box[
      #text(size: t-md, weight: 600, fill: ink)[#l.language]
      #text(size: t-md, fill: ink-soft)[, #l.fluency]
    ])
  )
]

// ─── Achievements ────────────────────────────────────────────────────────────
#if cv != none and cv.summary_highlights.len() > 0 [
  #section("Achievements")
  #bullet-list(cv.summary_highlights)
]
