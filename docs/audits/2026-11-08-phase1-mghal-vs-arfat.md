# تقرير المرحلة الأولى: التحقيق التقني ومقارنة M.GH.AL مع مرجع عرفات

**تاريخ الالتقاط:** 2026-11-08 — المنطقة الزمنية Asia/Aden  
**النطاق:** فحص GitHub والملفات وCI وRender وVercel، ومقارنة بنية المصدر والميزات.  
**قاعدة السلامة:** لم يُدمج أي تغيير في `main`، ولم تُعدّل قاعدة بيانات أو أسرار أو DNS أو صلاحيات أو إعدادات إنتاج. جميع إصلاحات هذه الجولة معزولة في فرع تدقيق مستقل.

## 1. الخلاصة التنفيذية

1. **الـ commit `d7bf94a8...` ليس الأحدث.** رأس فرع `feat/node-postgres-backend-2026-11-08` عند الالتقاط هو `0e13a95e4b01538f825ada7db064a9b1d40ce670` (2026-11-08 02:48:41 UTC)، أي 60 commit بعد `d7bf94a8...`.
2. فرع التطوير ليس جاهزاً للدمج المباشر في `main`: المقارنة الحالية أظهرت **306 commits ahead و44 behind**. كما أن PR #25 مبني على `fix/social-admin-mobile-ux-2026-11-07` وليس `main`، وPR #24 مبني على `feature/mghal-arfat-full-integration`. هذه سلسلة PRs متراكبة، وليست سلسلة إصدار مستقيمة.
3. معاينة Render المحددة `mghal-final-web` أصبحت Live على commit `0e13a95`. خدمة Node API التجريبية Live أيضاً على commit نفسه. خدمة Render أخرى باسم `mghal-final-site` فشلت في البناء بسبب `eslint: not found`؛ لا أخلط هذه الخدمة مع رابط المعاينة الذي طلبته.
4. حالات Vercel الحالية ليست دليلاً على فشل الكود: فحوص Vercel المرتبطة بالـ commit عادت بحالة failure مع رابط يوضح **build-rate-limit**. آخر معاينات Vercel الجاهزة التي ظهرت لا تستهدف Production، وبعضها أقدم من رأس الفرع.
5. مقارنة المصدر تؤكد أن M.GH.AL يمتلك بالفعل ميزات أكثر من المرجع في الإدارة والتفاعلات وواجهات API. المرجع أقوى في بعض تفاصيل عرض المشاريع ودليل العمل، لكن M.GH.AL لديه صفحات مشاريع مولّدة ثنائية اللغة مع Architecture وEvidence وJSON-LD؛ لذلك لا يصح وصف هذه الميزة بأنها مفقودة.
6. نفذت إصلاحين منخفضي المخاطر في فرع مستقل:
   - جعل حد الطلبات يقرأ `RATE_LIMIT_PER_MINUTE` بدلاً من القيمة الثابتة 120، مع تمرير المتغير إلى Node worker وإضافة اختبار سلوكي.
   - إصلاح مسارات مولّد واختبار صفحات المشاريع كي يستخدما `public/assets/projects/catalog.json` و`public/sitemap.xml` ومخرجات `public/projects` الفعلية، ثم إضافة الاختبار إلى build وCI.
7. لم أدّعِ فحصاً بصرياً أو هاتفياً. رصيد أداة استخراج صفحات الويب نفد قبل الحصول على DOM أو لقطات حية؛ لذلك اعتمدت على GitHub source ونتائج CI وسجلات Render، وسجلت فحص المتصفح الفعلي كشرط للمرحلة الثانية.

## 2. الحالة الحقيقية للمستودعات والفروع وPRs

### M.GH.AL

- المستودع: [mghalaosimi-web/mghalaosimi-web](https://github.com/mghalaosimi-web/mghalaosimi-web)
- `main`: `eb67a14c07bb547b4e4636c03a580148d5b9dbda`.
- فرع Node/Neon: [feat/node-postgres-backend-2026-11-08](https://github.com/mghalaosimi-web/mghalaosimi-web/tree/feat/node-postgres-backend-2026-11-08) — `0e13a95e4b01538f825ada7db064a9b1d40ce670`.
- `d7bf94a8bb52d3dd36c11077d67ca630a5268123` أقدم من رأس هذا الفرع بـ60 commit؛ لا يُستخدم كمرجع للحالة الحالية.
- كان المستودع يحتوي 30 فرعاً قبل فرع التدقيق، و25 PR: 16 مفتوحاً و9 مغلقة. فرع التدقيق الحالي يرفع عدد الفروع إلى 31.
- PRs المؤثرة في سلسلة الدمج:
  - [#25 Node.js + Neon](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/25): Draft، head هو فرع Node/Neon، base هو `fix/social-admin-mobile-ux-2026-11-07`، والفارق 160 commit ahead / 0 behind بالنسبة إلى ذلك الـ base.
  - [#24 UX/credentials/SEO hardening](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/24): Draft، base هو `feature/mghal-arfat-full-integration`، والفارق 32 ahead / 0 behind.
  - [#17 integration](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/17): Draft، 114 ahead / 44 behind بالنسبة إلى main.
  - [#22 official brand system](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/22): Draft، 32 ahead / 0 behind بالنسبة إلى main.
  - [#21 remaining reference styling](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/21): Draft، 21 ahead / 0 behind بالنسبة إلى main.
- **قرار:** لا تدمج PR #25 إلى main مباشرة. يجب أولاً تحديد خط الأساس التصميمي، وتسوية سلسلة PRs، ثم إنشاء release branch قصير مبني على main وإدخال commits منتقاة بعد مراجعة التعارضات.

### المستودع المرجعي

- المستودع: [arfat-alkamly-portfolio](https://github.com/arfat-alkamly/arfat-alkamly-portfolio)
- الفرع الافتراضي: `portfolio`، رأسه `a3af5e21d52183da88ae90a14b76aa42aa37e501`.
- 12 فرعاً و10 PRs: 9 مغلقة ومندمجة، وPR #1 مفتوح Draft لتحديث أمني متعلق بـ React Server Components.
- آخر CI ظاهر على الفرع الافتراضي ناجح. لم أجد مشروع Vercel المرجعي ضمن المشاريع المتاحة عبر تكامل Vercel المرتبط، لذلك لم أستطع تدقيق سجلات نشره من حساب Vercel.

## 3. النشر وCI

| الهدف | الحالة التي تحققت | الدليل/الحد |
|---|---|---|
| Render `mghal-final-web` | Live على commit `0e13a95` | بناء Next.js نجح، واختبارات التصميم والتنقل والبحث ضمن build اجتازت. |
| Render Node API preview | Live على commit `0e13a95` | خدمة تجريبية منفصلة؛ لا تعني نقل إنتاج D1 إلى Neon. |
| Render `mghal-final-site` | Build failed | سجل البناء يظهر `eslint: not found` أثناء lint في `mghal-backend`؛ إعداد هذه الخدمة لا يطابق إعداد `mghal-final-web`. لم أغير إعداد الخدمة. |
| Vercel `mghal` و`mghalaosimi-web` و`mghal-next-validation` | آخر deployments المعروضة READY، لكن target ليس Production | حالات Vercel المرتبطة بالـ commit فشلت بسبب build-rate-limit؛ لا يوجد دليل على ترقية commit الحالي إلى Production. |
| GitHub CI على رأس `0e13a95` | Backend CI وNext quality وNode API CI ناجحة | ثلاث workflows؛ فحوص Vercel الخارجية منفصلة عن GitHub Actions. |
| GitHub CI على فرع التدقيق | **الثلاثة ناجحة** على رأس `a6eff7b6`: Next.js quality وBackend CI وNode API CI | Next quality شغّل audit:credentials/certificates/profile/design/API proxy/SEO/sitemap/project pages/navigation/search/lint/typecheck/build؛ Backend CI شغّل `npm run check`؛ Node API CI شغّل `npm run check` و`node --check`. |

روابط تشغيل GitHub Actions:
- [Next.js quality — run 42440967303](https://github.com/mghalaosimi-web/mghalaosimi-web/actions/runs/42440967303)
- [Node API CI — run 42440967338](https://github.com/mghalaosimi-web/mghalaosimi-web/actions/runs/42440967338)

سجلات Render للفترة التي فُحصت لم تعرض سجلات طلبات 4xx/5xx لخدمتي الواجهة وNode API، ولم يظهر خطأ تطبيق Node؛ ظهرت تحذيرات من pg بشأن aliases الخاصة بـ SSL mode. غياب سجلات الأخطاء في نافذة الاستعلام لا يثبت خلو الموقع من 404 أو أخطاء متصفح.


### نتائج CI النهائية لفرع التدقيق

- [Next.js quality — run 42441152089](https://github.com/mghalaosimi-web/mghalaosimi-web/actions/runs/42441152089): success، job `validate` وجميع الخطوات ناجحة، بما فيها `test:project-pages` و`npm run build`.
- [Backend CI — run 42441170639](https://github.com/mghalaosimi-web/mghalaosimi-web/actions/runs/42441170639): success، job `validate` و`npm run check`.
- [Node API CI — run 42441170669](https://github.com/mghalaosimi-web/mghalaosimi-web/actions/runs/42441170669): success، job `validate` و`npm run check` و`node --check ../worker.production.js`.
- كان أول تشغيل لـNext quality يفشل عند cover `mghal-official-website.svg` لأن الاختبار يبحث في root `assets/` بينما الملف الفعلي في `public/assets/`. عُدّل الاختبار إلى public output وأعيد التشغيل بنجاح؛ لم تُغيّر صورة أو بيانات مشروع.

### PR التدقيق

- [PR #26 — audit: phase-one comparison and low-risk fixes](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/26) — Draft، base هو `feat/node-postgres-backend-2026-11-08`، head هو فرع التدقيق، 12 commits و11 ملفاً، 281 إضافة و16 حذفاً. لم يُدمج.

## 4. المقارنة المعمارية

| المجال | المرجع | M.GH.AL | النتيجة |
|---|---|---|---|
| Frontend | Next.js 15.5.28، React 19.1.2، TypeScript، App Router | الإصدارات الأساسية نفسها؛ Next App Router مع ملفات HTML ثابتة قديمة ومخرجات مولّدة داخل `public` | M.GH.AL يحتاج توحيد مسارات ومصادر العرض أكثر من حاجته إلى تبديل الإطار. |
| Homepage | Hero، profile، capabilities، projects، credentials، contact | Hero وهوية M.GH.AL ومشاريع وشهادات ومهارات وأبحاث وتفاعلات | موجود في الطرفين؛ لم يتم اختبار التطابق البصري الحي. |
| Navigation | رأس sticky، روابط رئيسية، تبديل لغة، شريط أفقي للهاتف | رأس مشترك، 8 روابط، مؤشر `aria-current`، تمرير الرابط النشط إلى مجال الرؤية، بحث، لغة، GitHub | M.GH.AL يتضمن وظائف إضافية؛ يحتاج E2E حقيقي. |
| Swipe بين الصفحات | لم يظهر تنفيذ page-swipe في المصدر المفحوص | موجود: إصبع واحد، منطقة main، حد 72px، نسبة dx/dy، مدة 700ms، اتجاه RTL/LTR، استثناء الحواف والأزرار والوسائط والحوار | موجود في المصدر والاختبار الساكن؛ غير مثبت على جهاز هاتف. |
| About / Skills / Labs | تبويبات About ومستكشف Skills وLabs | AboutTabs وSkillsExplorer وLabsExplorer | موجود/متقارب وظيفياً؛ لا تنقل بيانات المرجع. |
| Projects | مستكشف مشاريع وتفاصيل AEGIS-TITAN مع صفحات فرعية للمعمارية والوحدات والتشغيل وخارطة الطريق | 10 سجلات مشاريع في catalog، و20 صفحة تفاصيل عربية/إنجليزية مولّدة؛ كل صفحة تتضمن problem/goal/audience/value/features/stack/architecture/evidence/links وJSON-LD | موجود في M.GH.AL عبر static generated pages؛ مسار Next الديناميكي أبسط، وهناك ازدواج مصدر بيانات يجب حسمه. |
| Footer | مكوّن SiteFooter مستقل | Footer ضمن shell/صفحات M.GH.AL | موجود في الطرفين؛ فصل مكوّن Footer في M.GH.AL تحسين صيانة لا شرط ميزة. |
| Contact | API route، Google verification، Formspree، rate limiting | نموذج يتحقق من المدخلات ثم يفتح mailto؛ لا يرسل في الخلفية | جزئي في M.GH.AL؛ قرار منتج وليس سبباً لنسخ تدفق Google من المرجع. |
| Search palette | لم يظهر command palette مماثل في المصدر المفحوص | SiteSearch مع اختصار لوحة مفاتيح وتطبيع عربي/لاتيني وفهرس ثابت | موجود في M.GH.AL؛ لا حاجة لإعادة بنائه. |
| Admin / CMS | لا توجد لوحة محتوى مماثلة | لوحة إدارة للهوية والمشاريع والشهادات والمقالات والمهارات والتعليم والإنجازات والمتابعين والتعليقات والتحليلات والوسائط والمستخدمين | تفوق وظيفي لدى M.GH.AL. |
| Auth / RBAC | Google auth لخدمة محددة | جلسات Bearer مجزأة، PBKDF2، bootstrap، permissions، أدوار، audit write path | موجود لدى M.GH.AL؛ يلزم اختبار runtime ومراجعة سياسات auth. |
| API / DB | لا توجد طبقة PostgreSQL/Prisma مماثلة في المرجع | Cloudflare Worker/D1 هو خط الإنتاج الحالي؛ Node.js + pg + Neon معاينة منفصلة | موجود جزئياً؛ لا يوجد Prisma في هذا المستودع ولا `schema.prisma`. |
| Engagement | لا يوجد نظام متابعين/تفاعلات مماثل في المصدر المفحوص | متابع مجهول، اسم علني بموافقة، reactions، comments، events | موجود لدى M.GH.AL؛ يلزم تدقيق الخصوصية والاحتفاظ. |
| PWA / Offline | لا manifest/service worker في شجرة المرجع المفحوصة | manifest وservice worker وoffline shell في النظام القديم؛ التسجيل عبر `site.js`، وليس من Next layout | جزئي: لا تفترض أن صفحات Next الحالية قابلة للتثبيت أو تعمل offline. |
| Page / section progress | لم يظهر | شريط/section rail في الصفحات القديمة عبر `site.js`؛ لا يظهر تحميله في Next layout | جزئي في M.GH.AL. |
| Accessibility / motion | Skip link، labels، reduced motion، focus styles | Skip link، ARIA، focus-visible، reduced motion، استثناء عناصر التفاعل من swipe | موجود جزئياً في الطرفين؛ لا يوجد اختبار قارئ شاشة أو هاتف فعلي. |
| SEO / Schema | Person JSON-LD، metadata، structured data للمشاريع والشهادات | canonical/hreflang واختبارات SEO وsitemap؛ صفحات المشاريع الثابتة لديها JSON-LD، لكن Person/credentials helpers في Next ليست موصولة بالكامل | جزئي؛ يلزم توحيد schema وربطه بالصفحات الحية. |

## 5. مصفوفة الفجوات مع المسارات والأدلة

الحالات: **موجود** = مثبت في المصدر والاختبار؛ **جزئي** = يعمل في جزء من الموقع أو توجد فجوة تكامل؛ **مفقود** = لم يظهر في المصدر؛ **غير قابل للتحقق** = يتطلب متصفحاً/هاتفاً أو وصولاً حياً غير متاح.

| الميزة | حالة M.GH.AL | المسار/الدليل | الإجراء |
|---|---|---|---|
| رأس الموقع وروابط الأقسام | موجود | `app/components/SiteHeader.tsx`, `app/mghal-portfolio.css`, `scripts/test-navigation.mjs` | احتفظ به؛ أضف E2E للهاتف. |
| Swipe RTL/LTR | موجود بالمصدر، غير قابل للتحقق على جهاز | `app/components/SiteHeader.tsx`, `scripts/test-navigation.mjs` | اختبره في Playwright على touch emulation ثم جهاز حقيقي؛ افحص carousels الجديدة. |
| شريط التنقل الأفقي | موجود | `app/mghal-portfolio.css`, `public/assets/section-rail.css`, `public/assets/section-rail.js` | اختبره في legacy وNext منفصلين. |
| Footer مشترك | جزئي | `app/layout.tsx`، صفحات HTML المولّدة | توحيد المكوّن لاحقاً بعد كشف التكرار. |
| Search / Ctrl+K | موجود | `app/components/SiteSearch.tsx`, `public/assets/search-index.json`, `scripts/test-search-palette.mjs` | لا تضف palette أخرى؛ وسّع اختبار كل route. |
| About / Skills / Labs | موجود | `app/about/AboutTabs.tsx`, `app/skills/SkillsExplorer.tsx`, `app/labs/LabsExplorer.tsx` | راجع محتوى M.GH.AL فقط، ولا تنسخ محتوى المرجع. |
| صفحات المشاريع الثنائية | موجودة في public، جزئية في Next | `public/assets/projects/catalog.json`, `scripts/generate-project-pages.mjs`, `scripts/test-project-pages.mjs`, `public/projects/*/index.html`, `public/en/projects/*/index.html` | توحيد مصدر البيانات بين catalog و`data/projects.ts` وDB. |
| Route تفاصيل المشروع | جزئي | `app/projects/[slug]/page.tsx` مع rewrites في `next.config.ts` إلى ملفات `index.html` | اختبار route resolution لمنع shadowing أو 404. |
| نموذج التواصل | جزئي | `components/ContactForm.tsx` | إما الإبقاء على mailto بوضوح، أو بناء endpoint مستقل مع rate limit وspam protection. |
| PWA | جزئي | `public/manifest.json`, `public/sw.js`, `public/assets/site.js`, `public/offline.html` | لا توسع cache قبل اختبار Next routes ونسخ المحتوى. |
| Section rail / progress | جزئي | `public/assets/section-rail.js`, `public/assets/site.js` | ربطه بـNext فقط إذا أثبت الاختبار الحاجة. |
| Admin CRUD | موجود بالمصدر | `public/admin/index.html`, `public/assets/admin.js`, `mghal-backend/worker.production.js` | اختبر السيناريوهات من login إلى حفظ وظهور البيانات. |
| RBAC / sessions | موجود بالمصدر | `mghal-backend/worker.production.js`, `mghal-backend/migrations/*` | اختبارات سلبية لكل permission وexpired/revoked sessions. |
| Audit log | جزئي | Worker يكتب `audit_logs` عند create/update/delete؛ لا يوجد view في `public/admin/index.html` | إضافة صفحة سجل تدقيق مع pagination وfiltering. |
| Visitor analytics | جزئي | `public/assets/visitor-tracking.js`, `public/assets/social-engagement.js` | DNT محترم، لكن لا توجد موافقة تحليلية صريحة أو سياسة retention موثقة في المسار المفحوص. |
| API health | جزئي | `mghal-backend/node/server.mjs` يوفر `/live` و`/ready`; Render `healthCheckPath` فارغ | ضبط health probe لاحقاً بعد التأكد من الخدمة المستهدفة. |
| PostgreSQL / Neon | جزئي | `mghal-backend/node/postgres-adapter.mjs`, `mghal-backend/postgres/0001_initial.sql`, `mghal-backend/postgres/README.md` | إضافة migration ledger وschema parity وE2E قبل cutover. |
| Prisma | مفقود | لا `prisma/schema.prisma` ولا Prisma client في tree؛ Node يعتمد `pg` مباشرة | لا تضف Prisma لمجرد التشابه؛ القرار يحتاج مبرراً معمارياً. |
| Structured data للرئيسية والشهادات | جزئي | `lib/structured-data.ts` غير موصول بكل الصفحات؛ credentials helper يخرج `hasCredential: []` | توصيل Person/Credential JSON-LD ببيانات موثقة واختبار JSON-LD. |
| Sitemap / hreflang | موجود مع ازدواج قديم | `public/sitemap.xml` يحوي 50 URL، منها 20 route للمشاريع؛ `sitemap.xml` في الجذر نسخة أقدم | اعتماد public sitemap وحده وتوثيق مولّده. |
| Security headers | جزئي | Worker يضيف nosniff/frame/referrer؛ `next.config.ts` لا يعرّف مجموعة headers شاملة | إضافة CSP/HSTS/Permissions Policy بعد جرد inline scripts والتضمينات. |
| Broken links / 404 / hydration | غير قابل للتحقق حياً | لا يوجد Playwright E2E في CI؛ لا وصول إلى browser console في هذه الجولة | شرط قبول في المرحلة الثانية. |

## 6. التحقيقات الخاصة

### UI وCSS والأصول

- ملف `public/assets/design-tokens.css` يعرّف ألوان العلامة المطلوبة: navy `#172B4D`، blue `#315A85`، gold `#B69A62`، إضافة إلى أسطح dark/light وحالات النجاح والتحذير والخطر.
- هذا لا يعني أن كل CSS ملتزم به: فحص `app/globals.css` وحده وجد 518 قيمة hex مختلفة. بعض هذه القيم مقصود للمخططات والحالات، لكن صفحات قديمة مثل `public/assets/credentials.css` و`brand-home.css` ما زالت تحمل teal وألواناً قديمة. المطلوب token audit مصنف، لا استبدال آلي أعمى.
- شجرة M.GH.AL تضم 339 ملفاً تقريباً بإجمالي tracked size يقارب 73.5 MB؛ ظهر 40 زوجاً متطابقاً بين `assets/` و`public/assets/` بحجم تكرار يقارب 33 MB. بعض التكرار مقصود لأن الأولى مصدر بناء والثانية public output؛ لا تحذفها قبل تحديد كل المستهلكين.
- أكبر ملف متكرر هو PDF بحجم يقارب 12.2 MB. كما أن `next.config.ts` يضبط `images.unoptimized: true`.
- لم أجد ملفات خطوط محلية woff/woff2؛ صفحات المشروع المولّدة تستورد IBM Plex Sans Arabic وInter من Google Fonts. يلزم اختبار fallback عند انقطاع الشبكة.

### SEO وRoutes

- `public/sitemap.xml` يحتوي 50 URL، ويتضمن كل مشروع من المشاريع العشرة بالعربية والإنجليزية.
- نسخة الجذر `sitemap.xml` أقدم وأقصر؛ كانت scripts الخاصة بالمشاريع تقرأ/تكتب النسخة القديمة ومسارات root غير المستخدمة في Next public.
- صفحات المشاريع المولّدة لديها canonical وhreflang وOG/Twitter وSoftwareApplication/WebSite + BreadcrumbList JSON-LD، بينما Next homepage/credentials لا يربطان كل structured-data helpers.
- `public/admin/index.html` يحمل noindex؛ لا أعتمد على robots.txt كوسيلة حماية.
- توجد rewrites لمسارات `/projects/:slug` إلى `/projects/:slug/index.html` بالتوازي مع App Router dynamic route. هذا يستحق اختباراً حياً لتحديد أولوية المسار ومنع اختلاف المحتوى بين المسارين.

### API والأمان والبيانات

- Wrangler entrypoint هو `mghal-backend/worker.production.js`. يوجد Zod في بعض ملفات المصدر، لكنه ليس بديلاً عن فحص التحقق اليدوي في entrypoint الفعلي؛ لا تفترض أن كل schema مستوردة ومطبقة.
- CORS يعتمد allowlist ومطابقة معاينات محددة، والـWorker يطبق bearer sessions وصلاحيات RBAC وتجزئة token وPBKDF2 لكلمات المرور.
- `audit_logs` تُكتب عند عمليات create/update/delete، لكن لوحة الإدارة لا تعرضها.
- visitor tracking يحترم `navigator.doNotTrack === '1'` ويستخدم token عشوائياً في localStorage؛ لا يوجد في المسار المفحوص opt-in مستقل للتحليلات أو retention policy معلنة.
- مفاتيح rate-limit تُخزن في `site_settings` لكل IP hash ولكل دقيقة؛ لم يظهر cleanup/TTL لهذه المفاتيح، ما قد يسبب نمو الجدول بمرور الوقت.
- **إصلاح منفذ في فرع التدقيق:** `wrangler.toml` يضبط `RATE_LIMIT_PER_MINUTE=60` بينما كان Worker يستخدم 120 ثابتة. أصبح Worker يقرأ القيمة مع fallback 120، وأصبح Node server يمرر المتغير، وأضيف اختبار يثبت أن القيمة 2 تمنع الطلب الثالث.
- Node API يستخدم `pg` وطبقة توافق D1/SQLite. لا يوجد Prisma. ترجمة placeholders في adapter تعتمد regex على `?`؛ يجب إضافة اختبارات للقيم النصية والتعليقات التي تحتوي علامة استفهام قبل توسيع SQL.
- Postgres baseline موجود في `mghal-backend/postgres/0001_initial.sql`، لكن لا يظهر runner كامل لترحيل كل تغييرات D1 إلى Neon. README يصف snapshot، لا cutover. لذلك Neon خدمة معاينة وليست قاعدة إنتاج بديلة.
- Render Node API يوفر `/live` و`/ready`، لكن health check path في إعداد الخدمة فارغ.

### أخطاء runtime / console / 404

لم أتمكن من تشغيل browser automation أو الحصول على DOM/screenshot حي في هذه الجولة؛ لذلك:
- لا يوجد ادعاء بعدم وجود hydration mismatch أو console error.
- لا يوجد ادعاء بأن كل رابط خارجي أو داخلي يرد 200.
- لا يوجد ادعاء بأن swipe اختُبر على جهاز فعلي.
- لا يوجد ادعاء بأن الموقع خالٍ من 404.
- البديل المتاح كان اختبارات المصدر وCI وسجلات Render؛ وهي تثبت البناء والاختبارات التي شُغلت فقط.

## 7. Backlog تنفيذي مرتب

| ID | الأولوية | العمل | الأثر | الكلفة | المخاطر | معيار القبول |
|---|---|---|---|---|---|---|
| B0-01 | P0 | تسوية سلسلة الفروع وPRs قبل أي دمج إلى main | يمنع دمج 306 commits مع 44 behind بصورة عمياء | M | عالية إذا دُمج مباشرة | release branch مبني على main، diff مراجع، PR واحد واضح، لا تغييرات إنتاجية غير مقصودة. |
| B0-02 | P0 | Browser E2E للـroutes والـ404 والـhydration والـconsole | يثبت سلوك الموقع الفعلي | M | منخفضة | Playwright desktop/mobile، 0 uncaught errors، كل روابط التنقل الداخلية 200، واختبار back/forward. |
| B1-01 | P1 | مصدر واحد لبيانات المشاريع/الشهادات/المهارات بين catalog وTS وDB | يمنع اختلاف ما تعرضه الإدارة عما يراه الزائر | L | متوسطة | تعديل سجل في بيئة اختبار يظهر في public preview بعد build دون نسخ يدوي أو فقد بيانات. |
| B1-02 | P1 | حسم route precedence بين App Router وpublic generated HTML | يمنع محتوى مختلفاً أو 404 | M | متوسطة | اختبار لكل slug يثبت canonical ومحتوى route واحداً فقط. |
| B1-03 | P1 | توحيد CSS tokens عبر Next والصفحات القديمة | يحقق اللون الرسمي ويقلل الانحراف | L | متوسطة؛ بعض ألوان المخططات semantic | token coverage audit، لا ألوان brand عشوائية، وتباين WCAG AA للنصوص الأساسية. |
| B1-04 | P1 | مشروع case-study schema موحد لمشاريع M.GH.AL | يحسن proof-of-work دون نسخ بيانات عرفات | M | متوسطة بسبب ادعاءات غير موثقة | كل مشروع يعرض المشكلة والهدف والمعمارية والأدلة والحالة والروابط؛ كل ادعاء مرتبط بمصدر. |
| B1-05 | P1 | Neon migration ledger + schema parity + contract tests | يجعل نقل D1 إلى Postgres قابلاً للتراجع | L | عالية إذا تم cutover دون مقارنة | migrations versioned، dry-run، row-count checks، rollback، واختبارات على DB معزولة. |
| B1-06 | P1 | Security headers وauth-specific rate limits وcleanup لمفاتيح rate-limit | يقلل XSS/abuse ونمو الجدول | M | متوسطة؛ CSP قد يكسر scripts | CSP report-only أولاً، اختبارات CORS، حد مستقل لتسجيل الدخول، cleanup TTL موثق. |
| B1-07 | P1 | ربط health probe بـ`/ready` وإضافة request IDs/structured logs | يكتشف تعطل DB ويختصر التشخيص | S–M | منخفضة | Render probe ينجح فقط مع DB ready؛ logs لا تسجل secrets أو PII. |
| B1-08 | P1 | توصيل Person/Credential JSON-LD بالصفحات الحية | يحسن فهم محركات البحث | M | منخفضة إذا البيانات موثقة | JSON-LD صالح وغير فارغ، يطابق الشهادات المعروضة، واختبار schema. |
| B1-09 | P1 | معالجة تكرار الأصول وتحسين الصور | يقلل حجم المستودع والتحميل | M–L | متوسطة؛ لا حذف قبل tracing | inventory لكل أصل، مصدر واحد قابل لإعادة التوليد، صور responsive، قياس LCP/CLS. |
| B2-01 | P2 | PWA install/offline shell لصفحات Next | تجربة أفضل عند ضعف الشبكة | M | متوسطة بسبب cache stale | manifest/installability، cache versioning، عدم تخزين admin/API، offline fallback لكل route مختبر. |
| B2-02 | P2 | عرض Admin audit log مع filters وpagination | traceability للإدارة | M | منخفضة/متوسطة بسبب صلاحيات السجل | owner/admin permission، لا تعرض أسرار أو tokens، وتسجيل القراءة الحساسة. |
| B2-03 | P2 | Analytics privacy controls وretention | ثقة وامتثال أفضل | M | متوسطة/عالية خصوصية | DNT + opt-in واضح عند الحاجة، retention محدد، تجميع أو حذف آلي، سياسة منشورة. |
| B2-04 | P2 | Page/section progress في Next | توجيه بصري داخل الصفحات الطويلة | S | منخفضة | لا يغطي المحتوى أو يعيق قارئ الشاشة، ويختفي مع reduced motion. |
| B2-05 | P2 | اختبار motion/keyboard/accessibility آلياً | يقلل regression | M | منخفضة | axe + keyboard-only + reduced-motion + touch E2E. |
| B3-01 | P3 | تقييم ميزات إضافية فقط بعد القياس | يمنع التضخم الشكلي | S–M | منخفضة | لا ميزة دون مشكلة مستخدم أو مقياس نجاح. |

### تقييم الميزات التي طُلب النظر فيها

- **PWA install/offline:** موجود جزئياً في صفحات HTML القديمة، وليس مثبتاً في Next app؛ يؤجل إلى B2-01.
- **Command/search palette:** موجود بالفعل في M.GH.AL؛ لا تعِد بناءه.
- **Page/section progress:** موجود جزئياً في legacy؛ إضافة Next اختيارية B2-04.
- **Keyboard shortcuts:** Ctrl/Cmd+K موجودة مع البحث؛ لا حاجة إلى مجموعة اختصارات شكلية.
- **Accessible motion/transitions:** reduced-motion وfocus موجودان بالمصدر؛ المطلوب اختبارات فعلية لا مؤثرات جديدة.
- **Project case studies:** موجودة في 20 صفحة مولّدة؛ المطلوب توحيد مصدرها وإثراء الأدلة فقط.
- **Activity/engagement:** follow/reactions/comments/events موجودة؛ المطلوب اختبارات عقود API والخصوصية، لا إضافة تفاعلات أخرى.
- **Privacy-safe analytics:** DNT محترم، لكن consent/retention يحتاجان سياسة وتنفيذاً واضحاً.
- **Admin audit log:** كتابة السجل موجودة، وعرضه في الواجهة مفقود.
- **API health/observability:** endpoints موجودة، لكن Render health probe غير مضبوط وstructured observability غير كافية.

## 8. التغييرات المنفذة في فرع التدقيق

الفرع: [audit/phase1-mghal-arfat-2026-11-08](https://github.com/mghalaosimi-web/mghalaosimi-web/tree/audit/phase1-mghal-arfat-2026-11-08)

- Rate-limit configuration:
  - `005bc490` — Worker يقرأ `RATE_LIMIT_PER_MINUTE`.
  - `3830bcc1` — Node server يمرر المتغير.
  - `8adcf017` — اختبار سلوكي للحد المهيأ.
  - `24b76b3c` — توثيق المتغير.
- Project-page build/test path:
  - `8b3aec3d` — generator يقرأ catalog ويكتب الصفحات وsitemap داخل `public/`.
  - `09d904ab` — test يقرأ public output.
  - `0cb28267` — إضافة الاختبار إلى build.
  - `8b4fb73e`, `eb8cff02`, `63e65a82` — تشغيل workflows على فرع التدقيق وإضافة الاختبار إلى Next quality.
  - `0b92153c` — تصحيح مسار cover asset ليُقرأ من `public/assets`.
- لم تتغير بيانات المشاريع أو الشهادات أو حسابات الإدارة أو قاعدة البيانات.
- لا يوجد merge إلى main ولا نشر من فرع التدقيق إلى Render/Vercel.

## 9. خطة المرحلة الثانية

1. انتظار النتيجة النهائية لـNext quality على رأس فرع التدقيق، وتشغيل Backend CI عبر PR مراجعة إلى فرع Node/Neon.
2. إنشاء Playwright suite على Render preview: Arabic/English، 360px و390px و768px وdesktop، swipe/scroll/back، menu rail، search dialog، form validation، project details، admin unauthorized/expired session.
3. تسجيل screenshots وconsole/network errors لكل route؛ فحص كل internal link وكل asset وكل status 404/5xx.
4. حسم مصدر الحقيقة: catalog أم TypeScript data أم Postgres؛ عدم تفعيل الكتابة إلى قاعدة إنتاج.
5. مراجعة CSS tokens على مستوى الصفحات والمكونات، مع contrast tests.
6. بعد ثبات الواجهة، اختبار Neon على قاعدة معزولة ومقارنة schema/data counts، ثم قرار مستقل بشأن cutover.
7. تسوية PR stack وإعداد release PR صغير مبني على main. لا دمج آلي للـ306 commits.


## ملحق A: جرد الفروع وPRs عند الالتقاط

### فروع M.GH.AL (31 بعد إنشاء فرع التدقيق)

`audit/phase1-mghal-arfat-2026-11-08`, `backup/pre-credential-audit-2026-11-07`, `backup/pre-static-credential-project-audit-2026-11-07`, `chore/unify-public-identity-2026-11-06`, `design/arfat-inspired-ui-2026-11-07`, `design/complete-reference-parity-2026-11-07`, `design/extra-reference-styling-2026-11-07`, `design/reference-details-followup-2026-11-07`, `feat/mghal-ai-platform-free-tier-2026-11-06`, `feat/mghal-complete-platform-2026-11-01`, `feat/mghal-credentials-projects-expansion-2026-11-05`, `feat/mghal-google-identity-linking-2026-11-07`, `feat/mghal-social-engagement-2026-11-07`, `feat/mghal-visual-redesign-2026-11-03`, `feat/mghal-visual-redesign-completion-2026-11-04`, `feat/node-postgres-backend-2026-11-08`, `feat/platform-phases-1-3-2026-11-01`, `feat/profile-media-and-credentials`, `feat/render-project-page-tracking-2026-11-01`, `feat/verified-project-portfolio-2026-10-31`, `feature/digital-identity-hub-v2-completion`, `feature/digital-identity-hub-v2`, `feature/mghal-arfat-full-integration`, `feature/portfolio-expansion`, `fix/credentials-owner-audit-2026-11-07`, `fix/mghal-dual-deploy-hardening-2026-11-05`, `fix/mghal-official-light-brand-system-2026-11-07`, `fix/owner-bootstrap-proxy-2026-11-06`, `fix/site-quality-audit-2026-10-31`, `fix/social-admin-mobile-ux-2026-11-07`, `main`.

### جرد PRs في M.GH.AL

- **مفتوحة (16):** #25 Node.js/Neon؛ #24 UX/credentials/SEO hardening؛ #22 official brand system؛ #17 portfolio integration؛ #21 reference styling؛ #16 Google identity linking؛ #15 anonymous follow/reactions؛ #14 AI provider foundation؛ #13 public identity؛ #12 credentials/projects/research؛ #11 dual-deploy hardening؛ #10 bilingual homepage؛ #9 visual redesign؛ #8 complete platform؛ #5 portfolio/credentials hub؛ #4 profile imagery/credentials.
- **مغلقة (9):** #23 credential-owner audit (merged)؛ #20 reference detail styling (merged)؛ #19 design parity (merged)؛ #18 reference-inspired redesign (merged)؛ #7 Render bilingual pages (closed without merge)؛ #6 backend/visitor tracking foundation (merged)؛ #3 V2.1 identity (merged)؛ #2 V2.0 hub (merged)؛ #1 portfolio expansion (merged).
- **PR #26** أُنشئ بعد الالتقاط الأساسي كـDraft منفصل على فرع التدقيق، ولا يغير إحصاء الـ25 PRs الأصلية في لقطة البداية.

### فروع المرجع (12)

`about-page-tabbed-profile`, `credentials-cisco-badges`, `feature/aegis-proof-of-work`, `feature/bilingual-ar-en`, `fix/skills-build-syntax`, `homepage-visual-refresh`, `portfolio`, `professional-portfolio-upgrade`, `public-certificates-upload`, `seo-internationalization-audit`, `skills-page-expansion`, `vercel/react-server-components-cve-vu-eb33c1`.

### جرد PRs في المرجع

- **مفتوح (1):** #1 Fix React Server Components CVE vulnerabilities — Draft.
- **مغلقة ومندمجة (9):** #10 structured data للمشاريع والشهادات؛ #9 bilingual release؛ #8 AEGIS proof of work؛ #7 skills build fix؛ #6 interactive skills explorer؛ #5 about tabs؛ #4 homepage refresh؛ #3 Cisco badges؛ #2 visual upgrade.

## 10. القيود

- لم أتمكن من الحصول على DOM أو screenshot حي من موقعي المعاينة والمرجع بسبب نفاد رصيد Firecrawl؛ لا توجد أداة browser أخرى متاحة في هذه الجولة.
- لم أقرأ قيم environment secrets، ولم أغيرها.
- لم أنفذ طلب HTTP مباشر من المتصفح إلى كل route؛ سجلات Render ليست بديلاً عن browser network trace.
- لا توجد نتيجة اختبار هاتف فعلي أو قارئ شاشة.
- أي قرار بترقية Vercel أو تغيير إعداد Render أو ترحيل D1/Neon يحتاج مرحلة مستقلة وموافقة تشغيلية.

