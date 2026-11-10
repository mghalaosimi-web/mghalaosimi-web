"use strict";
(() => {
  const API = "";
  const en = document.documentElement.lang.toLowerCase().startsWith("en");
  const slugByTitle = new Map([
    ["OpenJS Node.js Application Developer (JSNAD)", "jsnad-node-js-application-developer-01"],
    ["Hardware and Upgrade Support", "hardware-and-upgrade-support-02"],
    ["Cybersecurity Defense Analyst Career Path", "cybersecurity-defense-analyst-career-path-03"],
    ["Operating Systems Support", "operating-systems-support-04"],
    ["English for IT 1", "english-for-it-1-05"],
    ["Junior Cybersecurity Analyst Career Path", "junior-cybersecurity-analyst-career-path-06"],
    ["Networking Basics", "networking-basics-07"],
    ["Security and Connectivity Support", "security-and-connectivity-support-08"],
    ["Python Essentials 1", "python-essentials-1-09"],
    ["Operating Systems Basics", "operating-systems-basics-10"],
    ["IT Customer Support Basics", "it-customer-support-basics-11"],
    ["Introduction to Modern AI", "introduction-to-modern-ai-12"],
    ["UI/UX Design", "ui-ux-design-13"],
    ["Communications Skills", "communications-skills-14"],
    ["Interaction Design Fundamentals", "interaction-design-fundamentals-15"],
    ["UX Research", "ux-research-16"],
    ["UX Design", "ux-design-17"],
    ["User Interface Design Principles", "user-interface-design-principles-18"],
  ]);
  const labels = en
    ? { verify: "Verify credential ↗", pdf: "Open original PDF ↗", qr: "QR / verification ↗" }
    : { verify: "التحقق من الشهادة ↗", pdf: "فتح ملف الشهادة الأصلي PDF ↗", qr: "رمز QR / التحقق ↗" };
  const addLink = (actions, href, className, label) => {
    if (!href || [...actions.querySelectorAll("a")].some(a => a.href === new URL(href, location.href).href)) return;
    const link = document.createElement("a");
    link.className = className;
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    actions.append(link);
  };
  async function sync() {
    const cards = [...document.querySelectorAll(".credential-card")];
    if (!cards.length) return;
    const response = await fetch(API + "/api/public/certificates", { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error("Certificate API returned HTTP " + response.status);
    const payload = await response.json();
    if (!Array.isArray(payload.data)) throw new Error("Certificate API response has no data array");
    const records = new Map(payload.data.filter(x => x && x.slug).map(x => [x.slug, x]));
    let matchedCount = 0;
    for (const card of cards) {
      const heading = card.querySelector("h2, h3");
      if (!heading) continue;
      const slug = card.dataset.certificateSlug || slugByTitle.get(heading.textContent.trim());
      if (!slug) continue;
      const record = records.get(slug);
      if (!record) {
        // The static portfolio record is already verified; an incomplete API must never hide it.
        continue;
      }
      matchedCount += 1;
      card.dataset.certificateSlug = slug;
      if (record.title && !heading.textContent.trim()) heading.textContent = record.title;
      const issuer = card.querySelector(".cert-type");
      if (issuer && !issuer.textContent.trim() && record.issuer) issuer.textContent = record.issuer;
      const description = card.querySelector(".cert-description");
      if (description && !description.textContent.trim() && record.description) description.textContent = record.description;
      const actions = card.querySelector(".cert-actions");
      if (!actions) continue;
      const hasSpecificVerification = [...actions.querySelectorAll("a")].some(a =>
        /credly\.com\/badges\/|programs\.edraak\.org\/learn\/verify-certificate\//i.test(a.href)
      );
      if (!hasSpecificVerification) addLink(actions, record.verification_url, "cert-action", labels.verify);
      if (record.pdf_media_id) addLink(actions, API + "/api/public/media/" + encodeURIComponent(record.pdf_media_id), "cert-action primary", labels.pdf);
      addLink(actions, record.qr_url, "cert-action", labels.qr);
    }
    document.dispatchEvent(new CustomEvent("mghal:certificates-synced", { detail: { count: matchedCount } }));
  }
  sync().catch(error => console.warn("Certificate API sync unavailable; original certificate content retained.", error));
})();