# KINGAI OS — Linux for Desktop, Server, Edge & AI Workstation

**中文 / English** · General-purpose Linux · User-controlled · Optional local AI workloads · No mandatory KINGAI account

[Official website](https://kingai.work/os/) · [Download developer previews](https://github.com/kingaiwork/KINGAI-OS-Releases/releases) · [Four-edition product family](docs/PRODUCT_FAMILY.md) · [Install & verify](docs/INSTALLATION.md) · [Security](SECURITY.md)

> **Release status · 2026-10-29:** Only **KINGAI OS Desktop** and **KINGAI OS Server** currently have official downloadable images: **v0.1.0-dev (amd64, Developer Preview)**. **KINGAI OS Edge** and **KINGAI OS AI Workstation** are product roadmaps and **have no published ISO**. No edition is certified as generally available or production-ready.

## What is KINGAI OS?

KINGAI OS is a general-purpose Linux operating-system project for individuals, developers and infrastructure operators. Its goal is to preserve the familiar Linux ecosystem while providing a clean desktop, lightweight servers, and **optional**, user-selected tools for containers, local models and AI-agent development. KINGAI is the OS brand; it does **not** silently bundle KINGAI cloud accounts, agents, model subscriptions or hidden telemetry.

**KINGAI OS 不等于强制集成 AI 的封闭系统。** 用户可把它当作普通 Linux 桌面或服务器使用，也可以自行选择容器、开发工具、本地模型及 AI 智能体运行环境。KINGAI.WORK 的云业务属于独立、可选的服务体系。

## Four editions · 四大产品线

| Product / 产品 | Use case / 适用场景 | Availability / 当前状态 | Architecture |
| --- | --- | --- | --- |
| **KINGAI OS Desktop / 桌面版** | Everyday computing, KDE desktop, developers and optional AI tools | **Developer Preview**: v0.1.0-dev ISO | amd64 |
| **KINGAI OS Server / 服务器版** | Headless servers, VMs, SSH, containers and user-installed runtimes | **Developer Preview**: v0.1.0-dev ISO | amd64 |
| **KINGAI OS Edge / 边缘设备版** | Gateways, edge nodes, offline-first appliances and fleet operations | **Planned — no ISO** | amd64 + arm64 targets, unverified |
| **KINGAI OS AI Workstation / AI 工作站版** | Local model research, opt-in GPU inference, agent workspaces | **Planned — no ISO** | amd64 target, unverified |

See [PRODUCT_FAMILY.md](docs/PRODUCT_FAMILY.md) for architecture, roadmap and release gates, or [machine-readable edition metadata](catalog/product-family.json) for verified artifact names and statuses.

## Available downloads · 当前可下载版本

**[KINGAI OS v0.1.0-dev release](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/tag/v0.1.0-dev)** — published 2026-10-06, prerelease.

| Edition | ISO download | Matching SHA-256 |
| --- | --- | --- |
| Desktop | [Download Desktop 0.1.0-dev amd64](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/KINGAI-OS-Desktop-0.1.0-dev-amd64.iso) | [Checksum](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/KINGAI-OS-Desktop-0.1.0-dev-amd64.iso.sha256) |
| Server | [Download Server 0.1.0-dev amd64](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/KINGAI-OS-Server-0.1.0-dev-amd64.iso) | [Checksum](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/KINGAI-OS-Server-0.1.0-dev-amd64.iso.sha256) |

On Linux, place the ISO next to its `.sha256` file:

```bash
sha256sum -c KINGAI-OS-Desktop-0.1.0-dev-amd64.iso.sha256
```

Replace Desktop with Server as needed. See [verification and virtualization instructions](docs/INSTALLATION.md). SHA-256 is an integrity comparison, **not** a code signature, build provenance proof or stability certification.

## 下载与安装的真实验收状态 / Actual download & install status

The official downloadable Desktop and Server `v0.1.0-dev` assets are confirmed in the public GitHub Release metadata. Our read-only CI checks the exact release assets, SHA-256 companions and download URL responses, but it does **not** download the full multi-gigabyte ISO, boot the published older assets or prove installation on real hardware.

**Separate internal Debian 13 AMD64 experiments:** all four edition profiles compiled into real experimental ISOs and independently booted into Linux/systemd in both BIOS and UEFI QEMU VMs. These are **not** the same published `v0.1.0-dev` binaries; their hashes do not identify publicly downloadable files. Full installed-disk reboot, signed distribution, verified updates/rollback, and physical-hardware compatibility remain release blockers.

See [the current bilingual download/install acceptance ledger](docs/DOWNLOAD_INSTALL_STATUS_20261029.md), which clearly separates published ISO links from internal CI testing. **Do not install a developer preview over an important disk or a production server.**

## What ships in the preview?

Per the [published release notes](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/tag/v0.1.0-dev):

- Desktop amd64: KDE Plasma environment, common apps and development tools.
- Server amd64: minimal server base, OpenSSH, Podman, cloud-init, Fail2ban and Chrony.
- Both: matching SHA-256 sidecars, with public read-only integrity checks.

*Actual installer behavior, upstream distro identity, hardware compatibility and full build provenance cannot be established from this release-only repository; use a virtual machine and treat features beyond release notes as unverified.*

## Trust, privacy and release policy

- This is a **public distribution and documentation repository**, not the private source-of-truth build environment, signing key store or operational control plane.
- Public CI validates release metadata, asset URL form, sidecar size and checksum consistency. It does **not** download and boot multi-GB ISOs or certify security.
- No claims of mandatory cloud login, hidden telemetry, always-on AI, secure boot certification or production SLA.
- Planned Edge/AI Workstation features stay visibly labeled **planned** until real images and test evidence are published.
- Security reports: read [SECURITY.md](SECURITY.md) and disclose vulnerabilities privately.

## Architecture, commercial use & development roadmap

- [Four editions & feature status](docs/PRODUCT_FAMILY.md)
- [Install, verify and recovery](docs/INSTALLATION.md)
- [Build, supply-chain, updates, QA and commercial release gates](docs/RELEASE_ENGINEERING.md)
- [SEO / AI search discoverability publishing policy](docs/DISCOVERABILITY.md)
- [Product catalog for websites and automated assistants](catalog/product-family.json)

Future work includes reproducible image recipes, signed releases, SPDX/CycloneDX SBOM, hardened system update flows, virtual hardware CI, validated arm64/edge hardware and optional AI sandbox tooling. **Roadmap items are not currently shipped features.** Commercialization requires upstream software-license compliance, security updates, support policies, and tested hardware compatibility.

## Frequently asked questions · 常见问题

**Is KINGAI OS free? / 是否免费下载？**  
The current public **developer preview images** are downloadable without a KINGAI subscription. Third-party package and license obligations still apply. Future enterprise services may be priced separately when available.

**Can it replace my production Linux server? / 现在适合生产服务器吗？**  
Not yet certified. The current release is v0.1.0-dev. Test in a VM and follow your own backup and rollback practices.

**Does it bundle a local LLM, agents or cloud accounts? / 自带大模型或智能体吗？**  
No KINGAI model, mandatory account or agent product is bundled in the published preview description. Optional AI integration is a future enhancement.

**Where are ARM64, Edge and AI Workstation installers? / 新版镜像哪里下载？**  
They have **not** been released. Do not trust third-party pages offering alleged official downloads.

**Can businesses build on it? / 企业可商用吗？**  
Usage and redistribution require checking the licenses for the full distribution and individual bundled components. This repository's MIT LICENSE does not relicense the Linux kernel or other upstream packages. No production support SLA is implied.

## Official links & contact

- **Official OS product website:** https://kingai.work/os/
- **Product family / KINGAI.WORK:** https://kingai.work/
- **Publisher / 发布方：** KINGAI，由在美华人创办、AI 智能驱动的未来科技公司 · [kingai.work](https://kingai.work) · [GitHub 主页](https://github.com/kingaiwork)
- **Releases:** https://github.com/kingaiwork/KINGAI-OS-Releases/releases
- **Support/contact:** https://kingai.work/contact/
- **Security disclosure:** see [SECURITY.md](SECURITY.md)

© KINGAI OS contributors. Repository-side software is MIT-licensed where applicable; distribution components retain their own licenses.
