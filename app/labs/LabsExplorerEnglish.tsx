"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowUpLeft, ArrowUpRight, Binary, Bug, CheckCircle2, ChevronDown, ChevronRight, Cloud,
  Code2, Cpu, Database, FileSearch, FlaskConical, Fingerprint, Globe,
  HardDrive, Layers, LockKeyhole, Network, Search, Server, Shield, ShieldCheck,
  Siren, Terminal, Wifi, Workflow, Factory, BrainCircuit, ScanSearch, X, Wrench
} from 'lucide-react';

type Lab = {
  id: string; name: string; en: string; category: string; status: string;
  summary: string; goal: string; environment: string; tools: string[];
  objectives: string[]; workflow: string[]; safety: string; outputs: string[];
  Icon: typeof Shield;
};

const labs: Lab[] = [
  {
    id: 'network-defense', name: 'أمن الشبكات والدفاع السيبراني', en: 'NETWORK SECURITY & DEFENSE', category: 'الدفاع والشبكات',
    status: 'مسار تعلم وتطبيق', summary: 'تصميم الشبكات وتقسيمها ومراقبتها وتقوية حدودها، من إعداد الجدار الناري إلى تحليل الحزم.',
    goal: 'بناء شبكة اختبار آمنة، وتطبيق ضوابط الحماية، ومراقبة الاتصالات واكتشاف السلوك الشبكي غير المعتاد.',
    environment: 'شبكات افتراضية متعددة المناطق · Linux وWindows · موجهات ومحولات افتراضية · أجهزة جدار ناري تجريبية.',
    tools: ['pfSense / OPNsense', 'iptables / nftables', 'Wireshark', 'Suricata', 'Zeek', 'Cisco Packet Tracer'],
    objectives: ['تصميم VLANs وتقسيم الشبكة ومناطق الثقة', 'إنشاء قواعد Firewall والتحقق من أقل صلاحية', 'فهم IDS/IPS وضبط قواعد الكشف', 'تحليل PCAP وDNS وTCP والتدفقات', 'إعداد خرائط الأصول ومراقبة الخدمات'],
    workflow: ['رسم الطوبولوجيا وتحديد الأصول', 'تطبيق التقسيم والسياسات', 'توليد حركة مرور اختبارية', 'تحليل التنبيهات والتحقق من الضوابط'],
    safety: 'تُجرى الاختبارات داخل شبكة افتراضية مملوكة أو مصرح بها. لا يُفحص أي عنوان عام أو شبكة خارج نطاق المختبر.',
    outputs: ['مخطط الشبكة ومناطق الثقة', 'قواعد الجدار الناري ومبرراتها', 'ملخص PCAP ومؤشرات الاتصال', 'نتائج تحقق IDS/IPS'],
    Icon: Network
  },
  {
    id: 'pentest', name: 'اختبار الاختراق والفريق الأحمر', en: 'PENETRATION TESTING & RED TEAMING', category: 'التقييم الهجومي',
    status: 'مسار تعلم وتطبيق', summary: 'تقييم أمني منظم للأنظمة والخدمات والتطبيقات ضمن نطاق اختبار محدد ومصرح به.',
    goal: 'تطبيق منهجية تقييم تبدأ بالاستطلاع المنضبط وتنتهي بإثبات الأثر وكتابة توصيات معالجة قابلة للتنفيذ.',
    environment: 'مختبر افتراضي معزول · أهداف تدريبية مثل Metasploitable وOWASP Broken Web Apps · لقطات استرجاع.',
    tools: ['Kali Linux', 'Nmap', 'Metasploit Framework', 'Burp Suite', 'Nuclei', 'testssl.sh'],
    objectives: ['تحديد النطاق وقواعد الاشتباك ROE', 'حصر الخدمات والإصدارات داخل المختبر', 'التحقق من الثغرات دون إحداث ضرر', 'تقدير الخطورة والأثر ومسارات الوصول', 'صياغة تقرير تنفيذي وتقني مع إعادة اختبار'],
    workflow: ['اعتماد النطاق وقواعد الاختبار', 'جمع المعلومات وحصر السطح', 'التحقق الآمن من نقاط الضعف', 'تقرير الأدلة وخطة المعالجة'],
    safety: 'محاكاة الهجمات تقتصر على أهداف تدريبية أو أنظمة يملكها المستخدم أو لديه تصريح مكتوب لاختبارها. لا يتضمن المسار استهداف أطراف حقيقية.',
    outputs: ['وثيقة النطاق وقواعد الاشتباك', 'سجل النتائج المصنفة حسب الخطورة', 'أدلة تحقق منزوعة البيانات الحساسة', 'تقرير المعالجة وإعادة الاختبار'],
    Icon: ScanSearch
  },
  {
    id: 'forensics', name: 'التحقيق الجنائي الرقمي والاستجابة للأدلة', en: 'DIGITAL FORENSICS & EVIDENCE', category: 'التحقيق والاستجابة',
    status: 'مسار تعلم', summary: 'اقتناء الأدلة الرقمية وحفظ سلامتها وتحليل أنظمة الملفات والذاكرة والسجلات.',
    goal: 'اتباع إجراءات جنائية قابلة للتكرار تحافظ على سلامة الدليل وتربط الأحداث بخط زمني واضح.',
    environment: 'صور أقراص تدريبية · ملفات ذاكرة RAM · أجهزة افتراضية · نسخ أدلة للقراءة فقط.',
    tools: ['Autopsy / Sleuth Kit', 'FTK Imager', 'Volatility 3', 'KAPE', 'Plaso / log2timeline', 'ExifTool'],
    objectives: ['توثيق سلسلة الحيازة Chain of Custody', 'حساب Hash والتحقق من سلامة النسخ', 'تحليل الملفات المحذوفة والبيانات الوصفية', 'فحص الذاكرة والعمليات والاتصالات', 'بناء Timeline من سجلات متعددة'],
    workflow: ['تأمين المصدر وتوثيق الاستلام', 'إنشاء نسخة جنائية والتحقق منها', 'تحليل الآثار والبيانات', 'ربط النتائج وكتابة تقرير محايد'],
    safety: 'تُستخدم صور أقراص وذاكرة تدريبية أو أدلة يملكها صاحبها مع تفويض واضح. لا تُستخرج بيانات شخصية من أجهزة الغير.',
    outputs: ['سجل سلسلة الحيازة', 'قيم Hash للأدلة', 'خط زمني للأحداث', 'تقرير النتائج والقيود الفنية'],
    Icon: FileSearch
  },
  {
    id: 'malware', name: 'تحليل البرمجيات الخبيثة والهندسة العكسية', en: 'MALWARE ANALYSIS & REVERSE ENGINEERING', category: 'التحقيق والاستجابة',
    status: 'بيئة معزولة مخططة', summary: 'تحليل الملفات المشبوهة ساكنًا وديناميكيًا وفهم سلوكها ومؤشرات الاختراق.',
    goal: 'فهم بنية العينة وسلوكها ومؤشرات الاستمرارية والاتصال دون تعريض النظام المضيف أو الشبكة للخطر.',
    environment: 'Sandbox معزول · لقطات نظيفة · شبكة محاكاة بلا خروج افتراضي · عينات تعليمية غير ضارة عند التدريب.',
    tools: ['Ghidra', 'Cutter / radare2', 'Detect It Easy', 'YARA', 'PE-bear', 'REMnux'],
    objectives: ['فحص البصمات والبيانات الوصفية والسلاسل', 'قراءة بنية PE وELF ومكتباتها', 'فهم تدفق التنفيذ والاستدعاءات', 'مراقبة الملفات والعمليات والاتصالات', 'كتابة قواعد YARA ومؤشرات IOC'],
    workflow: ['التحقق من العزل واللقطة النظيفة', 'تحليل ساكن دون تشغيل', 'تحليل ديناميكي في Sandbox مضبوط', 'استخراج المؤشرات وكتابة التقرير'],
    safety: 'لا تُشغّل عينات مجهولة على النظام الأساسي أو شبكة متصلة. تُعطّل مشاركة الحافظة والمجلدات، ويُمنع الاتصال الخارجي افتراضيًا.',
    outputs: ['بطاقة تعريف العينة وHash', 'مخطط السلوك ومؤشرات IOC', 'قواعد كشف YARA تجريبية', 'تقرير تحليل وحدود الاستنتاج'],
    Icon: Bug
  },
  {
    id: 'web-appsec', name: 'أمن تطبيقات الويب وواجهات API', en: 'WEB & API APPLICATION SECURITY', category: 'أمن التطبيقات',
    status: 'مسار تعلم وتطبيق', summary: 'اختبار ضوابط الويب وواجهات API وفق OWASP Top 10 وAPI Security Top 10.',
    goal: 'تقييم المصادقة والجلسات والتحكم بالوصول والتحقق من المدخلات وحماية البيانات في تطبيقات تدريبية.',
    environment: 'OWASP Juice Shop وDVWA · تطبيقات API محلية · متصفح وأدوات Proxy داخل شبكة اختبار.',
    tools: ['Burp Suite', 'OWASP ZAP', 'Postman', 'OWASP ZAP API Scan', 'Semgrep', 'JWT tooling'],
    objectives: ['اختبار Broken Access Control وIDOR', 'مراجعة المصادقة وإدارة الجلسات', 'التحقق من مخاطر Injection وXSS', 'فحص إعدادات CORS وCSRF وSecurity Headers', 'اختبار صلاحيات API وحدود المعدل'],
    workflow: ['تحديد التطبيق والأدوار والبيانات', 'رسم نقاط الدخول ومسارات API', 'اختبار الضوابط بحسابات تجريبية', 'تقرير الثغرات وخطوات الإصلاح'],
    safety: 'تُختبر تطبيقات محلية أو تدريبية أو مصرح بها فقط، مع حسابات وبيانات اصطناعية. لا تُرسل حمولات اختبار إلى مواقع عامة.',
    outputs: ['خريطة سطح الهجوم', 'نتائج OWASP مصنفة', 'طلبات واستجابات منقحة', 'توصيات إصلاح واختبارات تحقق'],
    Icon: Globe
  },
  {
    id: 'soc', name: 'مركز العمليات الأمنية والاستجابة للحوادث', en: 'SOC & INCIDENT RESPONSE', category: 'الدفاع والشبكات',
    status: 'مسار تعلم وتطبيق', summary: 'مراقبة التنبيهات وربط الأحداث وإدارة الحوادث عبر SIEM وعمليات الاستجابة.',
    goal: 'محاكاة دورة عمل SOC من استقبال التنبيه وفرزه إلى التحقيق والاحتواء والتعلم بعد الحادث.',
    environment: 'شبكة مختبرية مع Windows/Linux endpoints · خادم سجلات مركزي · سيناريوهات محاكاة آمنة.',
    tools: ['Wazuh', 'Elastic Security', 'Splunk (أساسيات)', 'Sysmon', 'TheHive', 'Shuffle SOAR'],
    objectives: ['جمع السجلات وتوحيدها وربط الأحداث', 'بناء قواعد كشف وتنبيهات قابلة للقياس', 'فرز التنبيهات وتقليل الإيجابيات الكاذبة', 'إنشاء Playbooks للاستجابة', 'قياس MTTD وMTTR وتوثيق الدروس'],
    workflow: ['توليد أحداث اختبارية', 'استقبال وربط السجلات', 'فرز التنبيه والتحقيق', 'احتواء تجريبي وتقرير ما بعد الحادث'],
    safety: 'تُستخدم أحداث اصطناعية أو محاكاة داخل المختبر. لا تُنفّذ إجراءات احتواء على أجهزة إنتاجية أو حسابات حقيقية.',
    outputs: ['لوحة تنبيهات SIEM', 'قواعد كشف موثقة', 'سجل Incident Case', 'Playbook واستعراض ما بعد الحادث'],
    Icon: Siren
  },
  {
    id: 'crypto', name: 'التشفير وأمن البيانات', en: 'CRYPTOGRAPHY & DATA SECURITY', category: 'أمن البيانات والهوية',
    status: 'مسار تعلم', summary: 'تطبيق التشفير وإدارة المفاتيح والتوقيعات الرقمية والتحقق من سلامة البيانات.',
    goal: 'فهم الاستخدام الصحيح للخوارزميات والبروتوكولات ومخاطر إدارة المفاتيح بدل ابتكار تشفير غير موثوق.',
    environment: 'بيئة برمجية محلية · ملفات اختبار · شهادات ومفاتيح تجريبية غير مرتبطة ببيانات حقيقية.',
    tools: ['OpenSSL', 'Python cryptography', 'GnuPG', 'Hashcat (عينات تعليمية)', 'Key management concepts'],
    objectives: ['التمييز بين التشفير المتماثل وغير المتماثل', 'استخدام Hash وHMAC للتحقق من السلامة', 'إنشاء وتحقق التوقيعات الرقمية', 'فهم PKI والشهادات وTLS', 'دراسة التخزين والتدوير والإبطال الآمن للمفاتيح'],
    workflow: ['تحديد نموذج التهديد', 'اختيار بدائيات قياسية معتمدة', 'تنفيذ حالات اختبار', 'تحليل النتائج ومخاطر دورة حياة المفتاح'],
    safety: 'تُستخدم مفاتيح وبيانات اصطناعية. لا تُرفع مفاتيح خاصة أو أسرار إنتاجية إلى المستودعات أو التقارير.',
    outputs: ['تجارب تشفير موثقة', 'نتائج تحقق التوقيع والسلامة', 'مخطط دورة حياة المفتاح', 'ملاحظات مراجعة تصميم تشفيري'],
    Icon: Fingerprint
  },
  {
    id: 'iot', name: 'أمن إنترنت الأشياء والأنظمة المضمنة', en: 'IOT & EMBEDDED DEVICE SECURITY', category: 'الأجهزة والأنظمة المتخصصة',
    status: 'مسار بحث وتطبيق', summary: 'تقييم أمن الأجهزة الذكية وبروتوكولات الاتصال والبرمجيات الثابتة وواجهات التصحيح.',
    goal: 'فهم سطح الهجوم المادي والمنطقي للأجهزة، وتحديد ضوابط التحديث والإقلاع والاتصال الآمن.',
    environment: 'لوحات تطوير مملوكة · أجهزة IoT تدريبية · Firmware تجريبي · شبكة لاسلكية منفصلة.',
    tools: ['ESP32', 'Raspberry Pi', 'Binwalk', 'EMBA', 'MQTT Explorer', 'Logic Analyzer'],
    objectives: ['مراجعة بروتوكولات MQTT وBLE وWi-Fi', 'فحص Firmware واستخراج مكوناته', 'مراجعة الأسرار ومفاتيح الاتصال المخزنة', 'فهم Secure Boot والتحديث الموقّع', 'تقييم واجهات UART/JTAG المصرح بها'],
    workflow: ['تحديد الجهاز ومصدر Firmware', 'استخراج البنية وتحليل الإعدادات', 'مراجعة الاتصالات والواجهات', 'اقتراح تقوية وتحديث آمن'],
    safety: 'يقتصر الفحص المادي على أجهزة مملوكة أو مصرح بها. لا تُعطّل أجهزة أو مستشعرات مستخدمة في خدمات حقيقية.',
    outputs: ['قائمة مكونات Firmware', 'خريطة واجهات وبروتوكولات', 'نتائج مراجعة الأسرار والإعدادات', 'توصيات Secure Boot والتحديث'],
    Icon: Cpu
  },
  {
    id: 'ics', name: 'أمن الأنظمة الصناعية والبنية التحتية', en: 'ICS / SCADA & OT SECURITY', category: 'الأجهزة والأنظمة المتخصصة',
    status: 'مسار تخصصي مخطط', summary: 'فهم مخاطر OT وSCADA وتقسيم الشبكات الصناعية ومراقبة البروتوكولات التشغيلية.',
    goal: 'دراسة حماية أنظمة التحكم الصناعي مع إعطاء الأولوية للسلامة والتوافر واستمرارية التشغيل.',
    environment: 'محاكيات PLC وHMI · شبكة OT افتراضية منفصلة · بيانات تشغيلية اصطناعية.',
    tools: ['OpenPLC', 'Factory I/O', 'Wireshark', 'Conpot', 'MITRE ATT&CK for ICS', 'OPC UA'],
    objectives: ['التمييز بين IT وOT ومتطلبات السلامة', 'رسم مناطق وقنوات Purdue Model', 'فهم Modbus وOPC UA على مستوى البروتوكول', 'مراجعة الوصول البعيد وإدارة التغيير', 'ربط التهديدات بضوابط دفاعية'],
    workflow: ['إنشاء نموذج عملية افتراضية', 'رسم الأصول ومناطق الشبكة', 'مراقبة حركة OT الاصطناعية', 'تحليل المخاطر وخطة التقوية'],
    safety: 'المحاكاة افتراضية فقط. يمنع اختبار أو إرسال أوامر إلى PLC أو SCADA أو منشأة صناعية حقيقية.',
    outputs: ['رسم معماري لمناطق OT', 'قائمة أصول ومخاطر', 'ملخص تحليل بروتوكول', 'خطة تقوية واستجابة'],
    Icon: Factory
  },
  {
    id: 'range', name: 'الميادين السيبرانية والمحاكاة', en: 'CYBER RANGE & PURPLE TEAM', category: 'المحاكاة والتدريب',
    status: 'تصميم مسار متقدم', summary: 'بيئة تدريب متعددة الفرق لتمارين Red Team وBlue Team وPurple Team وسيناريوهات متدرجة.',
    goal: 'تطوير مهارات العمل الجماعي والقياس والتحقق من فعالية الضوابط ضمن سيناريوهات قابلة لإعادة التشغيل.',
    environment: 'شبكات افتراضية قابلة لإعادة البناء · أهداف تدريبية · مراقبة مركزية · سيناريوهات محددة.',
    tools: ['MITRE CALDERA', 'Atomic Red Team', 'DetectionLab', 'Proxmox / VMware', 'Wazuh', 'Terraform'],
    objectives: ['تصميم سيناريوهات وفق ATT&CK', 'توزيع أدوار الفرق وقواعد اللعب', 'قياس تغطية الكشف والاستجابة', 'تنفيذ جلسات Purple Team للتحسين', 'توثيق الدروس ومؤشرات الأداء'],
    workflow: ['اختيار سيناريو وأهداف تعلم', 'تهيئة الشبكة والأدوار', 'تنفيذ محاكاة مضبوطة', 'مراجعة الكشف والاستجابة والتحسين'],
    safety: 'تُستخدم محاكاة وأهداف تدريبية فقط، مع حدود موارد وشبكات واضحة. لا توجد اتصالات هجومية خارج بيئة التدريب.',
    outputs: ['وثيقة سيناريو وتمرين', 'مصفوفة ATT&CK', 'قياسات الكشف والاستجابة', 'تقرير مراجعة Purple Team'],
    Icon: Workflow
  },
  {
    id: 'cloud', name: 'أمن الحوسبة السحابية', en: 'CLOUD SECURITY & CONTAINER DEFENSE', category: 'الدفاع والشبكات',
    status: 'مسار تعلم', summary: 'تقييم إعدادات السحابة والهوية والتخزين والشبكات والحاويات وفق مبدأ أقل صلاحية.',
    goal: 'تحديد أخطاء التهيئة الشائعة وبناء ضوابط للرصد وإدارة الأسرار وحماية أحمال العمل السحابية.',
    environment: 'حسابات Sandbox أو محاكيات محلية · Docker · Kubernetes محلي · بيانات وموارد تجريبية.',
    tools: ['Prowler', 'ScoutSuite', 'Trivy', 'Checkov', 'Docker', 'Kubernetes'],
    objectives: ['مراجعة IAM والأدوار والصلاحيات', 'فحص التخزين المكشوف وسياسات الشبكة', 'تحليل صور الحاويات والاعتماديات', 'مراجعة Secrets وIaC', 'فهم التسجيل والمراقبة والاستجابة'],
    workflow: ['إنشاء بيئة تجريبية محدودة', 'فحص الإعدادات والبنية', 'تصنيف المخاطر حسب الأثر', 'تطبيق الإصلاح وإعادة الفحص'],
    safety: 'تُستخدم حسابات تجريبية بحدود إنفاق وصلاحيات دنيا. لا تُختبر حسابات سحابية أو موارد لا يملك المستخدم تصريحًا بها.',
    outputs: ['تقرير Cloud Posture', 'نتائج فحص IaC والحاويات', 'مصفوفة IAM', 'قائمة معالجة مرتبة'],
    Icon: Cloud
  },
  {
    id: 'devsecops', name: 'أمن البرمجيات وسلاسل التوريد', en: 'SECURE SDLC & DEVSECOPS', category: 'أمن التطبيقات',
    status: 'مسار تعلم وتطبيق', summary: 'دمج الفحوص الأمنية في دورة التطوير ومراجعة الشفرة والاعتماديات وخطوط CI/CD.',
    goal: 'تحويل الأمن إلى ضوابط مستمرة من التصميم والكتابة إلى البناء والنشر ومراقبة المكونات.',
    environment: 'مستودعات تدريبية · CI pipelines · تطبيقات تجريبية · بيئة بناء منفصلة.',
    tools: ['Semgrep', 'CodeQL', 'Gitleaks', 'Dependabot', 'Trivy', 'OWASP ASVS'],
    objectives: ['تطبيق Threat Modeling مبسط', 'تشغيل SAST وDAST وSCA', 'كشف الأسرار والاعتماديات الضعيفة', 'مراجعة صلاحيات CI/CD وحماية artifacts', 'صياغة معايير Secure Coding'],
    workflow: ['مراجعة التصميم والمتطلبات', 'فحص الشفرة والاعتماديات', 'دمج بوابات أمنية في CI', 'معالجة النتائج وتوثيق الاستثناءات'],
    safety: 'يُفحص كود مملوك أو مفتوح المصدر وفق شروط ترخيصه. لا تُنشر نتائج غير متحقق منها أو أسرار مكشوفة.',
    outputs: ['Threat Model', 'تقرير SAST/SCA/DAST', 'قائمة اعتماديات ومخاطر', 'قواعد CI Security'],
    Icon: Code2
  },
  {
    id: 'database', name: 'أمن قواعد البيانات والخصوصية', en: 'DATABASE SECURITY & PRIVACY', category: 'أمن البيانات والهوية',
    status: 'مسار تعلم', summary: 'تقوية قواعد البيانات والتحكم في الوصول ومراجعة التدقيق والتشفير وحماية البيانات.',
    goal: 'تطبيق مبدأ أقل صلاحية وحماية البيانات أثناء التخزين والنقل مع مراقبة أنشطة قواعد البيانات.',
    environment: 'Oracle Database وPostgreSQL وSQLite محلية · بيانات اصطناعية · نسخ احتياطية تجريبية.',
    tools: ['Oracle Audit', 'PostgreSQL roles', 'SQLCipher', 'pgAudit', 'OWASP Database Security'],
    objectives: ['مراجعة الأدوار والمنح والصلاحيات', 'منع حقن SQL عبر الاستعلامات المعلّمة', 'تفعيل التدقيق ومراجعة السجلات', 'حماية النسخ الاحتياطية والبيانات الحساسة', 'تطبيق إخفاء البيانات وتقليلها'],
    workflow: ['إنشاء قاعدة وبيانات اصطناعية', 'مراجعة الصلاحيات والإعدادات', 'اختبار التدقيق والنسخ الاحتياطي', 'توثيق المخاطر والمعالجة'],
    safety: 'تُستخدم بيانات اصطناعية فقط. لا تُجرى اختبارات على قواعد إنتاجية أو بيانات شخصية دون تفويض.',
    outputs: ['مصفوفة صلاحيات DB', 'نتائج مراجعة التدقيق', 'قائمة تحقق للنسخ الاحتياطي', 'توصيات خصوصية وتقليل البيانات'],
    Icon: Database
  },
  {
    id: 'identity', name: 'أمن الهوية وإدارة الوصول', en: 'IDENTITY, IAM & ZERO TRUST', category: 'أمن البيانات والهوية',
    status: 'مسار تخصصي', summary: 'إدارة دورة حياة الحسابات والمصادقة متعددة العوامل والامتيازات والوصول المشروط.',
    goal: 'تصميم نموذج هوية يقلل الامتيازات الدائمة ويجعل الوصول قائمًا على السياق والحاجة.',
    environment: 'Active Directory تجريبي · Keycloak · حسابات اختبار · تطبيقات محلية.',
    tools: ['Keycloak', 'LDAP', 'OAuth 2.0', 'OpenID Connect', 'FIDO2 concepts', 'BloodHound CE (تحليل مختبر)'],
    objectives: ['فهم SSO وFederation وMFA', 'مراجعة دورة إنشاء الحساب وإلغائه', 'تحليل الحسابات ذات الامتيازات', 'تطبيق RBAC ومبادئ Zero Trust', 'مراجعة سجلات المصادقة والجلسات'],
    workflow: ['رسم تدفق الهوية والتطبيقات', 'تعريف الأدوار والسياسات', 'اختبار سيناريوهات دخول تجريبية', 'مراجعة الامتيازات والسجلات'],
    safety: 'تُستخدم هويات اختبارية فقط. لا تُجمع كلمات مرور أو رموز جلسات لمستخدمين حقيقيين.',
    outputs: ['مخطط تدفق المصادقة', 'مصفوفة أدوار وصلاحيات', 'قائمة مراجعة MFA', 'توصيات تقليل الامتيازات'],
    Icon: Fingerprint
  },
  {
    id: 'ai-security', name: 'أمن الذكاء الاصطناعي ونماذج اللغة', en: 'AI SECURITY & LLM RED TEAMING', category: 'المحاكاة والتدريب',
    status: 'مسار بحث وتعلم', summary: 'دراسة تهديدات أنظمة الذكاء الاصطناعي والبيانات والنماذج وسلاسل الأدوات.',
    goal: 'تقييم مخاطر تطبيقات AI بصورة آمنة، تشمل سلامة المدخلات والمخرجات والبيانات والتكاملات.',
    environment: 'نماذج محلية أو تطبيقات تجريبية · بيانات اصطناعية · أدوات تقييم غير متصلة بأنظمة إنتاج.',
    tools: ['OWASP Top 10 for LLMs', 'MITRE ATLAS', 'Promptfoo', 'Garak', 'MLflow', 'Model cards'],
    objectives: ['فهم Prompt Injection وتسريب البيانات', 'اختبار حدود الثقة في RAG ومصادر المعرفة', 'مراجعة صلاحيات الأدوات والوكلاء', 'تقييم سلامة المخرجات والتحيز والخصوصية', 'توثيق التهديدات وضوابط التخفيف'],
    workflow: ['رسم تدفق البيانات والأدوات', 'بناء حالات اختبار آمنة', 'قياس السلوك والنتائج', 'تطبيق الضوابط وإعادة التقييم'],
    safety: 'تُستخدم نماذج وبيانات تجريبية فقط. لا تُرسل بيانات سرية إلى خدمات عامة ولا تُختبر أنظمة AI خارج نطاق التفويض.',
    outputs: ['AI Threat Model', 'مصفوفة حالات اختبار', 'نتائج تقييم RAG والأدوات', 'توصيات حوكمة وتخفيف'],
    Icon: BrainCircuit
  },
  {
    id: 'wireless', name: 'أمن الشبكات اللاسلكية', en: 'WIRELESS & RADIO SECURITY', category: 'الأجهزة والأنظمة المتخصصة',
    status: 'مسار تعلم', summary: 'تقييم إعدادات Wi-Fi والمصادقة والتشفير ومخاطر الأجهزة اللاسلكية.',
    goal: 'تقوية الشبكات اللاسلكية وفهم حدود الثقة بين نقاط الوصول والأجهزة المتصلة.',
    environment: 'نقطة وصول مملوكة · عميل اختبار · محول متوافق · شبكة RF منفصلة.',
    tools: ['WPA2 / WPA3', 'Kismet', 'Wireshark', 'hostapd', 'Router security settings'],
    objectives: ['مراجعة أنماط المصادقة والتشفير', 'تقييم إعدادات نقطة الوصول وWPS', 'فهم مخاطر الشبكات المفتوحة والضيف', 'مراجعة عزل العملاء وتحديث Firmware', 'إعداد خط أساس أمني لاسلكي'],
    workflow: ['إنشاء شبكة اختبار خاصة', 'توثيق إعدادات نقطة الوصول', 'مراجعة الاتصالات والسياسات', 'تطبيق التقوية والتحقق منها'],
    safety: 'لا يجري التقاط أو اختبار شبكات الجيران أو الشبكات العامة. يقتصر العمل على نقطة وصول مملوكة أو بإذن صريح.',
    outputs: ['قائمة تحقق Wi-Fi', 'مخطط فصل الشبكات', 'مراجعة إعدادات AP', 'توصيات WPA3 وإدارة الوصول'],
    Icon: Wifi
  },
  {
    id: 'memory', name: 'تحليل الذاكرة والأنظمة', en: 'MEMORY & ENDPOINT FORENSICS', category: 'التحقيق والاستجابة',
    status: 'مسار تعلم', summary: 'تحليل آثار الأنظمة والعمليات والذاكرة وسجلات نقاط النهاية أثناء التحقيق.',
    goal: 'ربط آثار العمليات والملفات والاتصالات والأحداث لفهم ما جرى على نقطة النهاية.',
    environment: 'Windows وLinux VMs · صور ذاكرة تدريبية · Sysmon وjournald وسجلات اصطناعية.',
    tools: ['Volatility 3', 'Sysmon', 'Windows Event Viewer', 'Velociraptor', 'osquery'],
    objectives: ['تحليل العمليات والوحدات المحملة', 'مراجعة الاتصالات ومقابض الملفات', 'فهم آثار Persistence على مستوى دفاعي', 'ربط سجلات النظام بخط زمني', 'تمييز حدود الذاكرة الحية والقرص'],
    workflow: ['تحديد مصدر الدليل وتوقيته', 'جمع الصورة والسجلات', 'تحليل الآثار وربطها', 'كتابة استنتاجات مدعومة بالأدلة'],
    safety: 'تُستخدم صور ذاكرة وأجهزة افتراضية تدريبية. يُحافظ على سلامة الأدلة ولا تُجمع بيانات أجهزة الغير.',
    outputs: ['ملخص تحليل RAM', 'قائمة العمليات والاتصالات', 'خط زمني لنقطة النهاية', 'تقرير فني قابل للمراجعة'],
    Icon: HardDrive
  }
];

const filters = ['All', 'Defense & Networking', 'Offensive Assessment', 'Investigation & Response', 'Application Security', 'Data & Identity Security', 'Specialized Systems & Devices', 'Simulation & Training'];

const englishLabels: Record<string, {title:string;category:string;summary:string}> = {"network-defense":{"title":"Network Security & Defense","category":"Defense & Networking","summary":"Design, segment, monitor, and harden networks through firewall policy and packet analysis."},"pentest":{"title":"Penetration Testing & Red Team","category":"Offensive Assessment","summary":"Assess systems and applications within a clearly defined, authorized testing scope."},"forensics":{"title":"Digital Forensics & Evidence","category":"Investigation & Response","summary":"Acquire, preserve, and analyze digital evidence across file systems, memory, and logs."},"malware":{"title":"Malware Analysis & Reverse Engineering","category":"Investigation & Response","summary":"Examine suspicious files safely to understand behavior and identify indicators of compromise."},"web-appsec":{"title":"Web & API Application Security","category":"Application Security","summary":"Assess web and API controls using established OWASP guidance and controlled test applications."},"soc":{"title":"SOC & Incident Response","category":"Defense & Networking","summary":"Monitor alerts, correlate events, and manage incidents through SIEM and response workflows."},"crypto":{"title":"Cryptography & Data Security","category":"Data & Identity Security","summary":"Apply established encryption, key management, digital signatures, and integrity verification."},"iot":{"title":"IoT & Embedded Device Security","category":"Specialized Systems & Devices","summary":"Assess smart-device security, communication protocols, firmware, and debugging interfaces."},"ics":{"title":"ICS / SCADA & OT Security","category":"Specialized Systems & Devices","summary":"Study industrial control security with priority given to safety and service continuity."},"range":{"title":"Cyber Range & Purple Team","category":"Simulation & Training","summary":"Build repeatable training scenarios for Red, Blue, and Purple Team exercises."},"cloud":{"title":"Cloud Security & Container Defense","category":"Defense & Networking","summary":"Review cloud identity, storage, network, and container configurations using least privilege."},"devsecops":{"title":"Secure SDLC & DevSecOps","category":"Application Security","summary":"Integrate security checks into development, dependencies, and CI/CD workflows."},"database":{"title":"Database Security & Privacy","category":"Data & Identity Security","summary":"Harden database permissions, auditing, encryption, backups, and privacy controls."},"identity":{"title":"Identity, IAM & Zero Trust","category":"Data & Identity Security","summary":"Manage identity lifecycles, multifactor authentication, privileged access, and conditional access."},"ai-security":{"title":"AI Security & LLM Red Teaming","category":"Simulation & Training","summary":"Study threats to AI applications, models, data, and tool-use pipelines."},"wireless":{"title":"Wireless & Radio Security","category":"Specialized Systems & Devices","summary":"Review wireless configuration and radio exposure in isolated, authorized environments."},"memory":{"title":"Memory & Endpoint Forensics","category":"Investigation & Response","summary":"Analyze volatile memory and endpoint artifacts to reconstruct activity during investigations."}};

export default function LabsExplorer() {
  const [selected, setSelected] = useState('network-defense');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [panel, setPanel] = useState<'overview'|'method'|'outputs'>('overview');
  const modalRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const categories = ['All', ...Array.from(new Set(labs.map(l => englishLabels[l.id]?.category ?? l.category)))];
  const visible = useMemo(() => labs.filter(l => {
    const label=englishLabels[l.id];
    return (category === 'All' || label?.category === category) &&
    ((label?.title ?? l.name) + ' ' + l.en + ' ' + (label?.summary ?? l.summary) + ' ' + l.tools.join(' ')).toLowerCase().includes(query.trim().toLowerCase());
  }).map(l=>({...l,name:englishLabels[l.id]?.title ?? l.name,category:englishLabels[l.id]?.category ?? l.category,summary:englishLabels[l.id]?.summary ?? l.summary,goal:'Define a controlled scope, establish clear objectives, and validate the relevant security controls using repeatable procedures.',environment:'A dedicated virtual or isolated test environment using the listed tools and synthetic test data.',objectives:['Define scope, assets, and security requirements','Apply the relevant assessment and validation techniques','Record observations and verify security controls','Document limitations and actionable recommendations'],workflow:['Prepare the authorized test environment','Perform controlled assessment and collect evidence','Review findings and validate results','Document recommendations and next steps'],safety:'Use owned systems, synthetic data, and isolated environments only. Testing requires explicit authorization; never target third-party systems.',outputs:['Scope and environment record','Technical observations and supporting evidence','Risk and control assessment','Documented remediation recommendations'],tools:l.tools.map(tool=>tool.replace(' (تحليل مختبر)',' (lab analysis)').replace(' (أساسيات)',' (fundamentals)').replace(' (عينات تعليمية)',' (training samples)')),status:({ 'مسار تعلم وتطبيق':'Learning & practice track','مسار تعلم':'Learning track','بيئة معزولة مخططة':'Planned isolated environment','مسار بحث وتطبيق':'Research & practice track','مسار تخصصي مخطط':'Planned specialist track','تصميم مسار متقدم':'Advanced track design','مسار تخصصي':'Specialist learning track','مسار بحث وتعلم':'Research & learning track' } as Record<string,string>)[l.status] ?? 'Learning track'})), [category, query]);
  const current = visible.find(l => l.id === selected) ?? visible[0];
  const CurrentIcon = current?.Icon ?? FlaskConical;
  const index = current ? labs.findIndex(l => l.id === current.id) + 1 : 0;

  const branches = current ? [
    { id: 'scope', title: 'Scope & objectives', en: 'SCOPE & OBJECTIVES', Icon: ScanSearch, description: current.goal, items: current.objectives, tab: 'overview' as const },
    { id: 'environment', title: 'Environment & tools', en: 'ENVIRONMENT & TOOLING', Icon: Server, description: current.environment, items: current.tools, tab: 'overview' as const },
    { id: 'operations', title: 'Workflow & deliverables', en: 'WORKFLOW & DELIVERABLES', Icon: Workflow, description: 'A structured process with documented, reviewable deliverables.', items: [...current.workflow, ...current.outputs], tab: 'method' as const }
  ] : [];

  const openBranch = (id: string) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setActiveBranch(id);
    setPanel('overview');
  };
  const closeBranch = () => { setActiveBranch(null); setSelected(''); };
  const selectedBranch = branches.find(b => b.id === activeBranch);

  useEffect(() => {
    if (!activeBranch) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const modal = modalRef.current;
    const focusable = () => Array.from(modal?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) ?? []);
    modal?.querySelector<HTMLElement>('[data-modal-close]')?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveBranch(null);
        setSelected('');
        return;
      }
      if (event.key === 'Tab') {
        const items = focusable();
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
    };
  }, [activeBranch]);

  return <main className="content-page labx-page" dir="ltr">
    <style jsx global>{`
      .labx-page{width:100%;max-width:1440px;margin:0 auto;padding:clamp(16px,2.4vw,34px) clamp(12px,2vw,28px) 64px;color:#e7e8e2;overflow:hidden}
      .labx-page *{box-sizing:border-box}
      .lx-mast{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:8px 0 15px;border-bottom:1px solid var(--line-cool);color:#92a3a5;font:9px ui-monospace,monospace;letter-spacing:.12em}
      .lx-mast b{color:#cbb17d}.lx-live{display:inline-flex;align-items:center;gap:7px}.lx-live i{width:7px;height:7px;border-radius:50%;background:#76b99b;box-shadow:0 0 10px #76b99b}
      .lx-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:clamp(18px,3vw,42px);align-items:center;padding:clamp(24px,4vw,48px) 0 28px}
      .lx-eyebrow{display:flex;align-items:center;gap:9px;color:#cbb17d;font:9px ui-monospace,monospace;letter-spacing:.12em}.lx-eyebrow svg{width:17px;height:17px}
      .lx-hero h1{margin:14px 0 10px;font-size:clamp(30px,4.5vw,54px);line-height:1.3;letter-spacing:-.04em}.lx-hero h1 em{font-style:normal;color:#cbb17d}
      .lx-hero p{max-width:720px;margin:0;color:#aab7b5;font-size:clamp(12px,1.1vw,14px);line-height:2}
      .lx-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.lx-tags span{padding:7px 10px;border:1px solid var(--line-cool);border-radius:5px;color:#b7c1bd;font:8px ui-monospace,monospace}
      .lx-architecture{position:relative;min-height:210px;padding:18px;border:1px solid rgba(183,155,104,.23);border-radius:12px;background:radial-gradient(ellipse at 50% 50%,rgba(76,139,145,.17),transparent 65%),linear-gradient(145deg,#10212a,#0a141b);overflow:hidden}
      .lx-architecture>small{color:#8d9fa0;font:8px ui-monospace,monospace;letter-spacing:.12em}
      .lx-arch-core{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);display:grid;justify-items:center;gap:5px;width:100px;height:100px;place-content:center;border:1px solid rgba(203,177,125,.5);border-radius:50%;background:#14252c;box-shadow:0 0 45px rgba(83,147,151,.18)}
      .lx-arch-core svg{width:27px;height:27px;color:#d2b982}.lx-arch-core b{font:700 15px ui-monospace,monospace;letter-spacing:.1em}.lx-arch-core span{color:#91a3a2;font:7px ui-monospace,monospace}
      .lx-node{position:absolute;display:grid;gap:4px;padding:9px 11px;border:1px solid rgba(116,157,160,.25);border-radius:7px;background:#122129;color:#b8c7c2;font:8px ui-monospace,monospace}
      .lx-node b{color:#d3bc8e;font-size:8px}.lx-node.n1{top:43px;left:18px}.lx-node.n2{top:43px;right:18px}.lx-node.n3{bottom:20px;left:18px}.lx-node.n4{bottom:20px;right:18px}
      .lx-arch-line{position:absolute;left:50%;top:52%;width:75%;height:1px;background:linear-gradient(90deg,transparent,rgba(126,177,178,.55),transparent);transform:translate(-50%,-50%)}
      .lx-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:0 0 30px}
      .lx-metric{display:flex;align-items:center;gap:12px;min-width:0;padding:14px 16px;border:1px solid var(--line-cool);border-radius:9px;background:linear-gradient(135deg,rgba(31,51,58,.62),rgba(11,20,26,.8))}
      .lx-metric svg{width:21px;height:21px;flex:0 0 auto;color:#cbb17d}.lx-metric b{display:block;color:#d4bc8b;font:700 21px ui-monospace,monospace}.lx-metric span{display:block;color:#98a9a6;font-size:9px;line-height:1.6}
      .lx-directory{border:1px solid var(--line-cool);border-radius:12px;background:linear-gradient(145deg,rgba(15,27,34,.96),rgba(8,16,22,.98));overflow:hidden}
      .lx-directory-head{display:flex;justify-content:space-between;align-items:end;gap:18px;padding:20px 22px;border-bottom:1px solid var(--line-cool)}
      .lx-directory-head small{color:#bda477;font:8px ui-monospace,monospace;letter-spacing:.13em}.lx-directory-head h2{margin:6px 0 0;font-size:clamp(18px,2vw,24px)}.lx-directory-head p{margin:5px 0 0;color:#8fa09f;font-size:10px}
      .lx-toolsbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px 20px;border-bottom:1px solid var(--line-cool)}
      .lx-search{display:flex;align-items:center;gap:9px;flex:1 1 220px;max-width:360px;padding:10px 12px;border:1px solid var(--line-cool);border-radius:7px;background:#091218}.lx-search svg{width:15px;color:#bda477}.lx-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#e5e7df;font-size:11px}.lx-search input::placeholder{color:#74858a}
      .lx-category{display:flex;gap:6px;flex:1 1 440px;flex-wrap:wrap}.lx-category button{padding:7px 10px;border:1px solid transparent;border-radius:6px;background:rgba(255,255,255,.025);color:#91a3a2;font-size:9px;cursor:pointer}.lx-category button.active{border-color:rgba(203,177,125,.38);background:rgba(203,177,125,.1);color:#e4d2a9}
      .lx-lab-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:18px}
      .lx-lab-card{position:relative;display:flex;flex-direction:column;min-width:0;min-height:220px;padding:17px;border:1px solid rgba(116,157,160,.19);border-radius:9px;background:linear-gradient(145deg,rgba(21,39,47,.82),rgba(10,19,25,.92));text-align:left;color:#e7e8e2;cursor:pointer;transition:border-color .2s,transform .2s,background .2s}
      .lx-lab-card:hover{transform:translateY(-2px);border-color:rgba(203,177,125,.5);background:linear-gradient(145deg,rgba(29,51,59,.92),rgba(10,19,25,.98))}
      .lx-lab-card.active{border-color:rgba(203,177,125,.65);box-shadow:inset 0 0 0 1px rgba(203,177,125,.12)}
      .lx-card-top{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:15px}
      .lx-card-icon{display:grid;place-items:center;width:46px;height:46px;border:1px solid rgba(203,177,125,.3);border-radius:10px;background:radial-gradient(circle,rgba(203,177,125,.13),rgba(76,139,145,.08));color:#d7bd86}
      .lx-card-icon svg{width:23px;height:23px}.lx-card-number{color:#789094;font:9px ui-monospace,monospace;letter-spacing:.1em}
      .lx-lab-card h3{margin:0 0 5px;font-size:13px;line-height:1.8}.lx-lab-card .en{color:#bda477;font:8px ui-monospace,monospace;line-height:1.7;letter-spacing:.04em}
      .lx-lab-card p{margin:11px 0 15px;color:#9eafaa;font-size:10px;line-height:1.9}
      .lx-card-bottom{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;padding-top:11px;border-top:1px solid rgba(116,157,160,.14)}
      .lx-card-bottom span{color:#9aaba6;font-size:8px}.lx-card-bottom b{display:inline-flex;align-items:center;gap:6px;color:#d4bc8b;font-size:9px;font-weight:600}.lx-card-bottom svg{width:13px;height:13px}
      .lx-branch-panel{margin:0 18px 18px;padding:17px;border:1px solid rgba(203,177,125,.25);border-radius:9px;background:linear-gradient(120deg,rgba(42,60,61,.32),rgba(9,18,24,.8))}
      .lx-branch-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.lx-branch-head small{color:#bda477;font:8px ui-monospace,monospace;letter-spacing:.12em}.lx-branch-head h3{margin:5px 0 0;font-size:14px}.lx-branch-head p{margin:4px 0 0;color:#91a3a2;font-size:9px}
      .lx-branch-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .lx-branch-card{display:flex;align-items:center;gap:11px;min-width:0;padding:13px;border:1px solid rgba(116,157,160,.2);border-radius:8px;background:#0c1920;color:#d9e0da;text-align:left;cursor:pointer;transition:border-color .2s,background .2s}
      .lx-branch-card:hover{border-color:rgba(203,177,125,.48);background:#14252c}
      .lx-branch-card>i{display:grid;place-items:center;width:38px;height:38px;flex:0 0 38px;border:1px solid rgba(203,177,125,.25);border-radius:8px;color:#d4bc8b;font-style:normal}.lx-branch-card>i svg{width:19px;height:19px}
      .lx-branch-card span{display:grid;gap:4px;min-width:0}.lx-branch-card b{font-size:10px;line-height:1.6}.lx-branch-card small{color:#8da19f;font:7px ui-monospace,monospace;line-height:1.5}
      .lx-empty{grid-column:1/-1;padding:35px;text-align:center;color:#9eafaa;font-size:11px}
      .lx-modal-backdrop{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:22px;background:rgba(2,7,11,.78);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
      .lx-modal{width:min(900px,100%);max-height:min(86vh,900px);overflow:auto;border:1px solid rgba(203,177,125,.34);border-radius:14px;background:linear-gradient(145deg,#14252d,#09141b 70%);box-shadow:0 28px 100px rgba(0,0,0,.55);direction:ltr}
      .lx-modal-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:15px;padding:17px 20px;border-bottom:1px solid var(--line-cool);background:rgba(13,26,33,.96);backdrop-filter:blur(12px)}
      .lx-modal-title{display:flex;align-items:center;gap:12px;min-width:0}.lx-modal-title>i{display:grid;place-items:center;width:43px;height:43px;flex:0 0 43px;border:1px solid rgba(203,177,125,.34);border-radius:10px;color:#d4bc8b}.lx-modal-title>i svg{width:22px;height:22px}.lx-modal-title small{color:#bda477;font:8px ui-monospace,monospace;letter-spacing:.08em}.lx-modal-title h2{margin:4px 0 0;font-size:clamp(14px,2vw,19px)}
      .lx-modal-close{display:grid;place-items:center;width:38px;height:38px;flex:0 0 38px;border:1px solid var(--line-cool);border-radius:8px;background:#0a171e;color:#c9d2cc;cursor:pointer}.lx-modal-close:hover{border-color:#cbb17d;color:#e8d7ae}.lx-modal-close svg{width:18px;height:18px}
      .lx-modal-body{padding:20px}.lx-modal-intro{margin:0 0 17px;color:#aab7b5;font-size:12px;line-height:2}
      .lx-modal-tabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--line-cool)}.lx-modal-tabs button{padding:8px 12px;border:1px solid transparent;border-radius:6px;background:transparent;color:#93a5a2;font-size:10px;cursor:pointer}.lx-modal-tabs button.active{border-color:rgba(203,177,125,.38);background:rgba(203,177,125,.1);color:#e4d2a9}
      .lx-modal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
      .lx-modal-panel{min-width:0;padding:15px;border:1px solid rgba(116,157,160,.2);border-radius:8px;background:rgba(4,11,16,.35)}
      .lx-modal-panel h3{display:flex;align-items:center;gap:8px;margin:0 0 10px;color:#d9c69e;font-size:11px}.lx-modal-panel h3 svg{width:16px;height:16px;color:#c8ac77}
      .lx-modal-panel p{margin:0;color:#a8b6b0;font-size:10px;line-height:2}
      .lx-modal-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}.lx-modal-list li{display:flex;align-items:flex-start;gap:8px;color:#aab7b1;font-size:10px;line-height:1.8}.lx-modal-list svg{width:14px;height:14px;flex:0 0 14px;margin-top:3px;color:#cbb17d}
      .lx-modal-chips{display:flex;flex-wrap:wrap;gap:7px}.lx-modal-chips span{padding:7px 9px;border:1px solid rgba(115,157,161,.2);border-radius:6px;background:rgba(89,141,145,.06);color:#b9c7c0;font:9px ui-monospace,monospace}
      .lx-modal-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:16px;padding-top:13px;border-top:1px solid var(--line-cool);color:#81918f;font:8px ui-monospace,monospace}.lx-modal-foot b{color:#cbb17d}
      @media(max-width:1000px){.lx-lab-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lx-hero{grid-template-columns:1fr  .8fr}.lx-workspace{grid-template-columns:1fr}}
      @media(max-width:700px){.labx-page{padding:14px 10px 44px}.lx-mast{font-size:7px;letter-spacing:.04em}.lx-live{font-size:6px}.lx-hero{grid-template-columns:1fr;padding:24px 0 18px}.lx-architecture{min-height:175px}.lx-node{padding:7px}.lx-node.n1,.lx-node.n3{left:9px}.lx-node.n2,.lx-node.n4{right:9px}.lx-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-bottom:18px}.lx-metric{padding:10px}.lx-metric b{font-size:18px}.lx-metric span{font-size:8px}.lx-directory-head{padding:15px;display:block}.lx-toolsbar{padding:12px;display:grid}.lx-search{max-width:none}.lx-category{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}.lx-category button{white-space:nowrap}.lx-lab-grid{grid-template-columns:1fr;padding:11px;gap:8px}.lx-lab-card{min-height:0;padding:13px}.lx-card-top{margin-bottom:9px}.lx-card-icon{width:39px;height:39px}.lx-lab-card p{margin:7px 0 10px}.lx-branch-panel{margin:0 11px 11px;padding:12px}.lx-branch-grid{grid-template-columns:1fr}.lx-branch-card{padding:11px}.lx-modal-backdrop{padding:9px;align-items:end}.lx-modal{width:100%;max-height:92vh;border-radius:13px 13px 9px 9px}.lx-modal-head{padding:12px}.lx-modal-body{padding:13px}.lx-modal-grid{grid-template-columns:1fr}.lx-modal-title h2{font-size:14px}.lx-modal-intro{font-size:10px}}
      @media(prefers-reduced-motion:reduce){.lx-lab-card,.lx-branch-card{transition:none}}
      /* Clear, accessible selectors for lab information and detail panels */
      .lx-category button{border:1px solid rgba(125,158,160,.24);background:linear-gradient(145deg,rgba(25,43,50,.78),rgba(12,23,29,.92));color:#b5c4c0;padding:8px 12px;transition:background .2s,border-color .2s,color .2s,transform .2s}
      .lx-category button:hover{border-color:rgba(203,177,125,.58);background:#172a31;color:#f0dfb8;transform:translateY(-1px)}
      .lx-category button.active{border-color:rgba(203,177,125,.78);background:linear-gradient(145deg,rgba(203,177,125,.2),rgba(45,65,67,.7));color:#f0dfb8;box-shadow:inset 0 0 0 1px rgba(203,177,125,.12)}
      .lx-modal-tabs{gap:8px;margin:0 0 19px;padding:0 0 14px}
      .lx-modal-tabs button{position:relative;min-height:42px;padding:10px 16px;border:1px solid rgba(125,158,160,.28);border-radius:7px;background:linear-gradient(145deg,rgba(24,42,49,.9),rgba(10,20,26,.96));color:#b7c5c0;font-size:10px;font-weight:600;transition:background .2s,border-color .2s,color .2s,transform .2s,box-shadow .2s}
      .lx-modal-tabs button:hover{transform:translateY(-1px);border-color:rgba(203,177,125,.58);background:#1a3038;color:#f1dfb9}
      .lx-modal-tabs button.active{border-color:rgba(203,177,125,.78);background:linear-gradient(145deg,rgba(203,177,125,.2),rgba(37,58,63,.88));color:#f4dfb2;box-shadow:inset 0 0 0 1px rgba(203,177,125,.14),0 5px 16px rgba(0,0,0,.18)}
      .lx-modal-tabs button.active:after{content:"";position:absolute;right:12px;bottom:5px;width:22px;height:2px;border-radius:2px;background:#d7bd86}
      .lx-modal-tabs button:focus-visible,.lx-category button:focus-visible,.lx-branch-card:focus-visible{outline:2px solid #d7bd86;outline-offset:3px}
      .lx-branch-card{border-color:rgba(125,158,160,.28);background:linear-gradient(145deg,#10222a,#0b171e)}
      .lx-branch-card:hover{transform:translateY(-2px);border-color:rgba(203,177,125,.62);box-shadow:0 8px 20px rgba(0,0,0,.18)}
      @media(max-width:700px){.lx-modal-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.lx-modal-tabs button{min-width:0;padding:9px 5px;font-size:9px}.lx-category button{padding:8px 11px}}
      @media(prefers-reduced-motion:reduce){.lx-modal-tabs button,.lx-category button,.lx-branch-card{transition:none}.lx-modal-tabs button:hover,.lx-category button:hover,.lx-branch-card:hover{transform:none}}
    `}
</style>

    <div className="lx-mast"><span>M.GH.AL <b>/</b> ENGINEERING DIVISION</span><span className="lx-live"><i/> LAB SYSTEM <b>·</b> CONTROLLED ENVIRONMENTS</span></div>
    <section className="lx-hero">
      <div>
        <span className="lx-eyebrow"><FlaskConical/> RESEARCH · VALIDATION · SECURITY ENGINEERING</span>
        <h1>Engineering <em>Labs</em></h1>
        <p>Structured environments for building labs, validating controls, analyzing systems, and documenting findings. Select a domain, then open a track to explore its technical profile.</p>
        <div className="lx-tags"><span>LAB OPERATIONS</span><span>RESEARCH & DEVELOPMENT</span><span>AUTHORIZED TESTING</span></div>
      </div>
      <div className="lx-architecture" aria-label="Laboratory ecosystem reference architecture">
        <small>LAB ECOSYSTEM / REFERENCE ARCHITECTURE</small><div className="lx-arch-line"/>
        <div className="lx-arch-core"><ShieldCheck/><b>M.GH.AL</b><span>LAB CORE</span></div>
        <div className="lx-node n1"><b>01 / BUILD</b><span>Design & Configure</span></div><div className="lx-node n2"><b>02 / TEST</b><span>Assess & Validate</span></div><div className="lx-node n3"><b>03 / OBSERVE</b><span>Monitor & Analyze</span></div><div className="lx-node n4"><b>04 / REPORT</b><span>Evidence & Improve</span></div>
      </div>
    </section>

    <section className="lx-metrics" aria-label="Laboratory directory metrics">
      <div className="lx-metric"><FlaskConical/><div><b>{String(labs.length).padStart(2,'0')}</b><span>lab domains</span></div></div>
      <div className="lx-metric"><Layers/><div><b>{String(categories.length-1).padStart(2,'0')}</b><span>specialist categories</span></div></div>
      <div className="lx-metric"><Workflow/><div><b>03</b><span>tracks per lab</span></div></div>
      <div className="lx-metric"><ShieldCheck/><div><b>01</b><span>principle: authorized testing</span></div></div>
    </section>

    <section className="lx-directory">
      <header className="lx-directory-head"><div><small>01 / ENGINEERING LAB DIRECTORY</small><h2>Laboratory & Specialty Directory</h2><p>Select a lab to explore its engineering tracks.</p></div></header>
      <div className="lx-toolsbar">
        <label className="lx-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search labs or tools..." aria-label="Search laboratories"/></label>
        <div className="lx-category" role="group" aria-label="Filter by category">{categories.map(c=><button key={c} type="button" className={category===c?'active':''} aria-pressed={category===c} onClick={()=>{setCategory(c);setSelected('');setActiveBranch(null)}}>{c}</button>)}</div>
      </div>
      <div className="lx-lab-grid">
        {visible.map(lab=>{const Icon=lab.Icon;return <button key={lab.id} type="button" className={'lx-lab-card'+(selected===lab.id?' active':'')} aria-pressed={selected===lab.id} onClick={()=>{setSelected(lab.id);openBranch('scope')}} aria-haspopup="dialog">
          <div className="lx-card-top"><i className="lx-card-icon"><Icon/></i><span className="lx-card-number">LAB / {String(labs.findIndex(x=>x.id===lab.id)+1).padStart(2,'0')}</span></div>
          <h3>{lab.name}</h3><span className="en">{lab.en}</span><p>{lab.summary}</p>
          <div className="lx-card-bottom"><span>{lab.category} · {lab.status}</span><b>Open lab profile <ArrowUpRight/></b></div>
        </button>})}
        {visible.length===0&&<div className="lx-empty">No matching results. Try another search term.</div>}
      </div>
    </section>

    {current&&selectedBranch&&<div className="lx-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)closeBranch()}}>
      <section ref={modalRef} className="lx-modal" role="dialog" tabIndex={-1} aria-modal="true" aria-labelledby="lx-modal-heading">
        <header className="lx-modal-head">
          <div className="lx-modal-title"><i><CurrentIcon/></i><div><small>ENGINEERING LAB / {String(index).padStart(2,'0')}</small><h2 id="lx-modal-heading">{current.name}</h2></div></div>
          <button type="button" className="lx-modal-close" data-modal-close onClick={closeBranch} aria-label="Close dialog"><X/></button>
        </header>
        <div className="lx-modal-body">
          <p className="lx-modal-intro">{current.summary}</p>
          <div className="lx-modal-tabs" role="tablist" aria-label="Track details">
            <button type="button" role="tab" id="lx-tab-overview" aria-controls="lx-panel-overview" aria-selected={panel==='overview'} tabIndex={panel==='overview'?0:-1} className={panel==='overview'?'active':''} onClick={()=>setPanel('overview')}>Technical overview</button>
            <button type="button" role="tab" id="lx-tab-method" aria-controls="lx-panel-method" aria-selected={panel==='method'} tabIndex={panel==='method'?0:-1} className={panel==='method'?'active':''} onClick={()=>setPanel('method')}>Workflow</button>
            <button type="button" role="tab" id="lx-tab-outputs" aria-controls="lx-panel-outputs" aria-selected={panel==='outputs'} tabIndex={panel==='outputs'?0:-1} className={panel==='outputs'?'active':''} onClick={()=>setPanel('outputs')}>Deliverables & evidence</button>
          </div>
          {panel==='overview'&&<div id="lx-panel-overview" role="tabpanel" aria-labelledby="lx-tab-overview" tabIndex={0} className="lx-modal-grid">
            <article className="lx-modal-panel"><h3><TargetIcon/> Purpose & scope</h3><p>{selectedBranch.description}</p></article>
            <article className="lx-modal-panel"><h3><Server/> Track components</h3><ul className="lx-modal-list">{selectedBranch.items.map(item=><li key={item}><CheckCircle2/>{item}</li>)}</ul></article>
            <article className="lx-modal-panel"><h3><ShieldCheck/> Safety controls</h3><p>{current.safety}</p></article>
            <article className="lx-modal-panel"><h3><Wrench/> Tools & environment</h3><div className="lx-modal-chips">{current.tools.map(tool=><span key={tool}>{tool}</span>)}</div></article>
          </div>}
          {panel==='method'&&<div id="lx-panel-method" role="tabpanel" aria-labelledby="lx-tab-method" tabIndex={0} className="lx-modal-grid">
            <article className="lx-modal-panel"><h3><Workflow/> Execution sequence</h3><ul className="lx-modal-list">{current.workflow.map(step=><li key={step}><ChevronRight/>{step}</li>)}</ul></article>
            <article className="lx-modal-panel"><h3><Activity/> Operating principles</h3><ul className="lx-modal-list"><li><ShieldCheck/>Clear scope and authorization before any test.</li><li><Activity/>Repeatable steps and reviewable measurements.</li><li><FileSearch/>Conclusions are based on documented evidence.</li></ul></article>
          </div>}
          {panel==='outputs'&&<div id="lx-panel-outputs" role="tabpanel" aria-labelledby="lx-tab-outputs" tabIndex={0} className="lx-modal-grid">
            <article className="lx-modal-panel"><h3><FileSearch/> Expected technical deliverables</h3><ul className="lx-modal-list">{current.outputs.map(item=><li key={item}><CheckCircle2/>{item}</li>)}</ul></article>
            <article className="lx-modal-panel"><h3><ShieldCheck/> Track status</h3><p>{current.status}. These items describe expected outputs; they are not completed results without supporting evidence.</p></article>
          </div>}
          <footer className="lx-modal-foot"><span>LAB REF <b>{String(index).padStart(2,'0')}-{current.id.toUpperCase()}</b></span><span>AUTHORIZED · DOCUMENTED · REPEATABLE</span></footer>
        </div>
      </section>
    </div>}
  </main>;
}

function TargetIcon() {
  return <ScanSearch aria-hidden="true"/>;
}
