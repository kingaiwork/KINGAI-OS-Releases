# KINGAI OS 产品家族 | Product Family

> 2026-10-29 状态：**Desktop / Server = Developer Preview；Edge / AI Workstation = Planned**。四个产品线已经定义，不等于四个镜像已经生产、安装、测试或公开上线。
>
> Status is authoritative in [catalog/product-family.json](../catalog/product-family.json). This page is a capability **roadmap** unless explicitly marked *available in preview*.

## 一个品牌，四个版本

| Edition | Ideal users | Current availability | Design direction |
| --- | --- | --- | --- |
| [Desktop](#desktop) | 个人、开发者、普通桌面办公 | v0.1.0-dev amd64 可下载 | KDE 桌面、日常软件、容器与可选本地 AI 工具 |
| [Server](#server) | 服务器、私有基础设施、开发环境 | v0.1.0-dev amd64 可下载 | headless、OpenSSH、Podman、cloud-init、基础加固 |
| [Edge](#edge) | 工控网关、边缘设备、小型 AI 终端 | **规划中，无 ISO** | 低功耗、离线优先、安全更新、设备编组与远程管理 |
| [AI Workstation](#ai-workstation) | 本地模型研发、GPU 计算和 Agent 开发 | **规划中，无 ISO** | GPU 适配、环境管理、模型与工作流隔离 |

### Desktop

**Preview (v0.1.0-dev)**: KDE Plasma desktop and general-purpose Linux applications are described in the [release notes](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/tag/v0.1.0-dev). No KINGAI account or cloud product is mandatory; no KINGAI agent/model is bundled.

**Roadmap**: guided setup, encrypted storage options, accessibility, language/input-method profiles, software center, optional developer toolchains, battery/graphics compatibility, verified upgrades and rollback. These are targets, not assertions about today's ISO.

### Server

**Preview (v0.1.0-dev)**: minimal headless installer with OpenSSH, Podman, cloud-init, Fail2ban and Chrony per published release notes.

**Roadmap**: Cockpit (explicitly opt-in and authenticated), Quadlet-managed rootless services, managed backups, patch windows, audit trails, policy-driven firewall templates, vulnerability summaries, zero-trust fleet enrollment and secure remote recovery. No claim of default production hardening.

### Edge

**Planned only**: small image footprint, arm64 plus amd64 builds when validated, TPM/secure-element options, secure boot/verified chain (hardware-dependent), immutable/dual-partition update where suitable, offline queue, signed device commands, canary cohorts and fail-safe recovery.

**Release gate**: independent ARM64 hardware matrix, remote offline/reconnect test, OTA interruption/rollback test, supply-chain signature and package-license review.

### AI Workstation

**Planned only**: optional GPU runtimes (NVIDIA/AMD/Intel only when tested), driver compatibility matrix, local models and API providers installed by the *user*, rootless isolated agent execution, hardware/VRAM dashboard, model provenance, quota controls, offline-friendly workspaces and privacy controls.

**Release gate**: compatibility by actual GPU and kernel, model-license/legal tests, consent boundary, thermal/VRAM stability and sandbox escape negative tests. AI is optional, not system authority.

## Shared architecture

- **Linux upstream**: choose and lock a reproducible upstream and exact package versions before new images are marketed. A Debian 13 candidate is recommended, but existing v0.1.0-dev upstream has **not been verified** from published files.
- **Base**: Linux kernel + signed/upstream repositories + package policies + user accounts + networking + disks.
- **Edition profiles**: packages, defaults, desktop/services, hardware/driver support; avoid four independent forks.
- **System trust**: provenance, SBOM, verified release metadata, security updates, backups and recovery.
- **Optional integrations**: container/model/agent APIs run with least privilege, explicit user consent, no mandatory account or telemetry.
- **Product boundary**: KINGAI OS is an independent operating system. KINGAI.WORK services remain optional separately authorized integrations.

## Resource targets (not measured requirements)

| Edition | Suggested validation target | Practical measurement |
| --- | --- | --- |
| Desktop | 4 GB RAM / 40 GB disk baseline candidate | cold boot, idle RAM, browser + office, install duration |
| Server | 2 GB RAM baseline candidate | SSH, rootless Podman, 24h soak, patch & restart |
| Edge | 1–2 GB RAM hardware candidate | idle watts, offline hours, OTA failover, storage endurance |
| AI Workstation | 16+ GB RAM, GPU optional | model load time, VRAM usage, sustained inference, power/thermal |

Do not turn targets into advertised minimum system requirements until validation reports exist.

## Commercial boundaries

1. Distinguish software rights, trademarks, third-party packages and paid support; review GPL/copyleft obligations in the entire distribution, not only this repository's MIT-licensed code.
2. Publish supported hardware and known limitations before stable launch. Current builds are developer previews.
3. Commercial services may include image customization, enterprise deployment, update/fleet management, security response and SLA-backed support **when delivery capability exists and contracts are established**.
4. No security/privacy certification, guaranteed device support or unlimited uptime is represented by this roadmap.

**Primary links**: [Official site](https://os.kingai.work/) · [Verified downloadable previews](https://github.com/kingaiwork/KINGAI-OS-Releases/releases) · [Installation & verification](INSTALLATION.md) · [Engineering and commercial gates](RELEASE_ENGINEERING.md)
