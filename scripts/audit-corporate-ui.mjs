import fs from 'node:fs';

const css = fs.readFileSync('assets/corporate-ui.css', 'utf8');
const site = fs.readFileSync('assets/site.js', 'utf8');
const required = ['#172B4D', '#315A85', '#FFFFFF', '#F3F5F7', '#202B38', '#64748B', '#DCE2E8', '#B69A62', '.cert-grid', '.home-hero', '.home-footer', '.navlinks'];
const absent = required.filter(token => !css.includes(token));
const certPages = ['certificates.html', 'en/certificates.html'];
const missingCertificates = certPages.filter(file => {
  const html = fs.readFileSync(file, 'utf8');
  return !html.includes('/assets/corporate-ui.css') || !html.includes('cert-nav nav') || !html.includes('navlinks');
});
if (!site.includes('/assets/corporate-ui.css') || !site.includes('dataset.mghalCorporate') || !site.includes('dataset.mghalExperience')) {
  console.error('The shared runtime must load the corporate stylesheet after the experience stylesheet.');
  process.exit(1);
}
if (absent.length || missingCertificates.length) {
  console.error('Corporate UI audit failed:', JSON.stringify({ absent, missingCertificates }, null, 2));
  process.exit(1);
}
console.log('Corporate UI audit passed: approved palette, shared runtime injection, bilingual certificate navigation and reference-page styling.');
