# KINGAI OS — Search, AI Discovery & Brand SEO Publishing Guide

**Purpose:** make published facts easy for humans, conventional search engines and AI assistants to verify. Never fabricate product availability, reviews, benchmarks, support levels or AI features to improve ranking.

## Canonical names & intent

- Organization / umbrella: **KINGAI.WORK** (company/ecosystem)
- Product: **KINGAI OS** (Linux operating-system family; not an autonomous cloud service)
- Edition names: **KINGAI OS Desktop**, **KINGAI OS Server**, **KINGAI OS Edge**, **KINGAI OS AI Workstation**
- Official authority: `https://os.kingai.work/`
- Release authority: `https://github.com/kingaiwork/KINGAI-OS-Releases/releases`
- English and Chinese headings should share the exact product names and visibly different release states.

### Candidate title/description for official OS landing page

**Title (EN):** KINGAI OS | Linux Desktop, Server, Edge & AI Workstation

**Description (EN):** Explore KINGAI OS Linux for desktop and server, with Edge and AI Workstation editions in development. Download verified amd64 developer previews; optional local AI tools, no mandatory cloud account.

**Title (ZH):** KINGAI OS Linux｜桌面、服务器、边缘设备与 AI 工作站

**Description (ZH):** KINGAI OS Linux 产品家族：桌面版、服务器版提供 amd64 开发预览镜像，边缘设备版与 AI 工作站版正在规划。了解安装、校验、隐私和未来 AI 功能。

## Publication and technical SEO checklist (official domain)

- Distinct HTML route and `<h1>` for each edition, with accurate status on every card.
- One canonical URL per localized page; use `hreflang` only where both localized URLs exist and link back reciprocally.
- Include useful visible FAQs, release notes, requirements supported by test reports, hardware support, license notices and changelog.
- Include XML sitemap **only for live, indexable, canonical 200 OK pages**; link from real `robots.txt`.
- JSON-LD: `Organization`, `WebSite`, `SoftwareApplication` or `SoftwareSourceCode` with truthful `softwareVersion`, `operatingSystem`, `downloadUrl` and `datePublished` **only when they exist**. Avoid `Offer` unless real commercial offering exists. Avoid inflated ratings, fake FAQ rich-result promises and invented review aggregates.
- For planned editions, prefer `WebPage` / `TechArticle` and **omit downloadUrl/softwareVersion**.
- Open Graph preview image with descriptive alt; responsive, optimized AVIF/WebP where compatible, correct alt text and minimum 44px tap targets.
- Respect WCAG keyboard visibility, color contrast, reduced-motion, heading order, JSON-LD/HTML language consistency.
- Provide publicly accessible, crawlable release metadata and product catalog. Test robots, sitemap, links, page status, redirect chains and structured-data parsing after deploy.
- Avoid blocking crawlers unnecessarily; never expose customer data or private source to improve AI indexability.
- AI/answer engines can consume [machine-readable product family](../catalog/product-family.json) plus public Markdown and web pages; `llms.txt` is optional supplementary guidance, **not a guaranteed ranking method or search standard**.

## Suggested route plan

- `/`: Linux family overview (four edition statuses)
- `/desktop/`: current developer preview + verified release details
- `/server/`: current developer preview + verified release details
- `/edge/`: design roadmap; no fake download button
- `/ai-workstation/`: design roadmap; no fake download button
- `/download/`: **official two preview downloads** + checksum and risk warning
- `/docs/install/`: install and restore instructions
- `/security/`: vulnerability disclosure, signed release roadmap and support policy
- `/changelog/`: version and dates with immutable links

## Content/FAQ questions to answer without keyword stuffing

- What is KINGAI OS and how is it different from ordinary Linux?
- Which KINGAI OS edition can be installed today?
- How can I verify the official ISO SHA-256 checksum?
- Does it require a KINGAI cloud account or include AI models?
- Can I install it on a VPS, desktop or unsupported ARM device?
- Is KINGAI OS suitable for production servers today?
- When will Edge / AI Workstation / ARM64 be released? (Answer: no committed date.)

## Measurement

Observe Google Search Console indexing, Bing Webmaster Tools, verified impressions/clicks, crawl errors, referer attribution and *actual* cited AI answers. No ranking, speed or user-acquisition guarantees. Distinguish published code from Cloudflare deployment and real-domain cache state.
