import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const adapter = readFileSync('assets/database-content.js', 'utf8');
assert.match(adapter, /api\/public\/projects\?locale=/, 'project pages must request locale-aware published API data');
assert.match(adapter, /project\.name \|\| staticRecord\?\.title/, 'published API names must take precedence over the static catalogue');
assert.match(adapter, /project\.short_description \|\| staticRecord\?\.summary/, 'published API summaries must take precedence over the static catalogue');
assert.match(adapter, /project\.repository_url \|\| staticRecord\?\.repository/, 'repository links must prefer published API values');
assert.match(adapter, /project\.cover_media_id/, 'project cards must support published media references');
assert.match(adapter, /publishedSlugs\.has\(slug\)/, 'a successful API response must hide records absent from the published set');
assert.match(adapter, /syncProjects\(\)\.catch\(/, 'API failures must retain static project cards');
assert.doesNotMatch(adapter, /innerHTML|insertAdjacentHTML/, 'API content must not be injected as HTML');

for (const file of ['projects.html', 'en/projects.html']) {
  const html = readFileSync(file, 'utf8');
  assert.match(html, /src="\/assets\/database-content\.js"/, file + ': project API adapter is not loaded');
  assert.equal((html.match(/data-project-slug=/g) || []).length, 10, file + ': all ten original fallback cards must remain');
}
console.log('Project API integration tests passed: bilingual published data precedence, media/repository mapping, publication filtering and static fallback.');
