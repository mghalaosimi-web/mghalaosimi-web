import json
from html import escape
from pathlib import Path

catalog = json.loads(Path("assets/projects/catalog.json").read_text())
translations = {
    "ar": {
        "title": "معرض المشاريع والمختبر التقني",
        "eyebrow": "M.GH.AL · PROJECT GALLERY",
        "description": "استكشف المشاريع والأنظمة المسجلة في ملف M.GH.AL، مع عرض حالتها الحالية وروابط صفحات التفاصيل. الأغلفة تصاميم تعريفية وليست لقطات تشغيل فعلية.",
        "all": "كل المشاريع", "details": "تفاصيل المشروع", "lab": "المختبر التقني",
        "home": "الرئيسية", "identity": "الهوية", "projects": "المشاريع",
        "credentials": "الشهادات", "knowledge": "المعرفة", "contact": "التواصل",
        "resume": "السيرة الذاتية", "language": "English",
        "lab_items": [
            ("هندسة البرمجيات", "تصميم بنية التطبيقات وحدود الأنظمة وتدفق البيانات."),
            ("هندسة قواعد البيانات", "نمذجة البيانات والعلاقات والفهارس والاستعلامات."),
            ("تجارب الواجهات", "تطوير واجهات RTL/LTR وأنماط التفاعل وإمكانية الوصول.")
        ]
    },
    "en": {
        "title": "Projects Showcase & Engineering Lab",
        "eyebrow": "M.GH.AL · PROJECT GALLERY",
        "description": "Explore the projects and systems recorded in the M.GH.AL portfolio, with their current status and dedicated detail pages. Covers are illustrative artwork, not live product screenshots.",
        "all": "All projects", "details": "Project details", "lab": "Engineering Lab",
        "home": "Home", "identity": "Identity", "projects": "Projects",
        "credentials": "Credentials", "knowledge": "Knowledge", "contact": "Contact",
        "resume": "Résumé", "language": "العربية",
        "lab_items": [
            ("Software Engineering", "Application architecture, system boundaries, and data flow."),
            ("Database Engineering", "Data modeling, relationships, indexes, and query design."),
            ("Interface Experiments", "RTL/LTR interface patterns, interaction, and accessibility.")
        ]
    }
}

for locale in ("ar", "en"):
    ar = locale == "ar"
    t = translations[locale]
    prefix = "" if ar else "/en"
    cards = []
    for project in catalog["projects"]:
        title = project["title"].get(locale, project["title"]["en"])
        summary = project["summary"].get(locale, project["summary"]["en"])
        category = project["category"].get(locale, project["category"]["en"])
        status = project["status"].get(locale, project["status"]["en"])
        alt = project.get("coverAlt", {}).get(locale, project.get("coverAlt", {}).get("en", title))
        href = f"{prefix}/projects/{project['slug']}/"
        cards.append(
            f'<article class="showcase-card"><a class="showcase-cover" href="{href}" aria-label="{escape(t["details"])}: {escape(title)}">'
            f'<img src="{escape(project["cover"])}" alt="{escape(alt)}" loading="lazy" decoding="async"></a>'
            f'<div class="showcase-card-body"><div class="showcase-meta"><span>{escape(category)}</span>'
            f'<span class="showcase-status">{escape(status)}</span></div><h2><a href="{href}">{escape(title)}</a></h2>'
            f'<p>{escape(summary)}</p><a class="showcase-detail-link" href="{href}">{escape(t["details"])} <span aria-hidden="true">↗</span></a></div></article>'
        )
    lab = "".join(
        f'<article class="showcase-lab-card"><span>{i:02d}</span><h3>{escape(title)}</h3><p>{escape(description)}</p></article>'
        for i, (title, description) in enumerate(t["lab_items"], 1)
    )
    nav = (
        f'<header class="top"><div class="wrap nav"><a class="brand" href="{prefix or "/"}">M.GH.AL</a>'
        f'<nav class="navlinks" aria-label="{"التنقل الرئيسي" if ar else "Primary navigation"}">'
        f'<a href="{prefix or "/"}">{escape(t["home"])}</a><a href="{prefix}/profile.html">{escape(t["identity"])}</a>'
        f'<a href="{prefix}/projects.html">{escape(t["projects"])}</a><a href="{prefix}/certificates.html">{escape(t["credentials"])}</a>'
        f'<a href="{prefix}/knowledge.html">{escape(t["knowledge"])}</a><a href="{prefix}/contact.html">{escape(t["contact"])}</a></nav>'
        f'<a class="btn secondary nav-resume" href="{prefix}/resume.html">{escape(t["resume"])} ↗</a></div></header>'
    )
    body = (
        f'<body class="showcase-page"><a class="skip-link" href="#main-content">{"تجاوز إلى المحتوى الرئيسي" if ar else "Skip to main content"}</a>{nav}'
        f'<main id="main-content" class="wrap showcase-main"><header class="showcase-hero"><p class="eyebrow">{escape(t["eyebrow"])}</p>'
        f'<h1>{escape(t["title"])}</h1><p class="lead">{escape(t["description"])}</p>'
        f'<a class="showcase-all-link" href="{prefix}/projects.html">{escape(t["all"])} ↗</a></header>'
        f'<section class="showcase-grid" aria-label="{escape(t["all"])}">{"".join(cards)}</section>'
        f'<section class="showcase-lab" aria-labelledby="showcase-lab-title"><div><p class="eyebrow">ENGINEERING PRACTICE</p>'
        f'<h2 id="showcase-lab-title">{escape(t["lab"])}</h2></div><div class="showcase-lab-grid">{lab}</div></section></main>'
        f'<footer class="home-footer"><div class="wrap home-footer-inner"><a class="brand" href="{prefix or "/"}">M.GH.AL</a>'
        f'<p>Mohammed Ghaleb Alaosimi · محمد غالب العصيمي</p><div><a href="{prefix}/resume.html">{escape(t["resume"])}</a>'
        f'<a href="{prefix}/profile.html">{escape(t["identity"])}</a><a href="{prefix}/contact.html">{escape(t["contact"])}</a>'
        f'<a href="{"/" if ar else "/"}{"en/" if ar else ""}">{escape(t["language"])}</a></div>'
        f'<small>© <span id="year"></span> M.GH.AL</small></div></footer><script src="/assets/site.js" defer></script></body></html>'
    )
    path = Path("showcase.html" if ar else "en/showcase.html")
    old = path.read_text()
    start = old.find("<head>")
    end = old.find("</head>")
    head = old[start + 6:end] if start >= 0 and end >= 0 else ""
    import re
    head = re.sub(r"<style\b[^>]*>[\s\S]*?</style>", "", head)
    head = re.sub(r'<link rel="stylesheet" href="/assets/mghal-experience\.css">', "", head)
    head = re.sub(r'<meta name="theme-color" content="[^"]*">', '<meta name="theme-color" content="#172B4D">', head)
    head += '\n<link rel="stylesheet" href="/assets/mghal-experience.css">\n'
    path.write_text(f'<!doctype html>\n<html lang="{locale}" dir="{"rtl" if ar else "ltr"}">\n<head>{head}</head>\n{body}\n')

print(f"Generated bilingual project showcases from {len(catalog['projects'])} registry records.")
