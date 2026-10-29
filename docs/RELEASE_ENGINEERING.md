# KINGAI OS — Release Engineering / Commercial Readiness v1

**Baseline:** Public distribution repo currently contains official v0.1.0-dev Desktop & Server ISO assets, sidecar SHA-256 files, a release integrity checker and CI. This document defines future implementation obligations; it does not represent deployed infrastructure.

## Architecture boundary

```text
PRIVATE, ACCESS-CONTROLLED BUILD AUTHORITY (not in public releases repo)
  package lock + build recipes + approved upstream mirror
    -> isolated amd64/arm64 build workers (no production credentials)
    -> package license inventory + SBOM + offline static analysis
    -> QEMU boots + installer + network/SSH/rootless container smoke
    -> failed-update/rollback test + reproducibility comparison
    -> human release approval gate + hardware compatibility matrix
    -> signed hash manifest / provenance / immutable release tag
                        |
                        v
PUBLIC RELEASE AUTHORITY (this repository)
  metadata / release assets / checksum sidecars / policy / verified docs
                        |
                        v
DISTRIBUTION
  GitHub Releases + official site download links
  Optional mirrors only after digest/signature matching
                        |
                        v
OPTIONAL CUSTOMER CONTROL PLANE (separate consent and identity)
  fleet enrollment, policy, patch window, backup, alerts, approvals
```

No automatic insertion of KINGAI cloud tokens or accounts in system images. Keep the public releases repository free of infrastructure credentials, signing keys, customer data, private source authority and hidden telemetry.

## A. Packaging profiles

- `base`: upstream distro locked to exact release, kernel lineage, partitioning, package sources, login, networking, security defaults and recovery.
- `desktop`: KDE and general apps; accelerated driver bundles installed only after hardware detection/consent.
- `server`: headless remote access, Podman, cloud-init, Cockpit optional; firewall and patch policy.
- `edge`: appliance profile; small rootfs, system integrity, offline queue and A/B or transactional recovery.
- `ai-workstation`: opt-in local inference tools, GPU matrices, rootless sandbox and model stores.

**Upstream decision:** evaluate Debian 13 vs Ubuntu 26.04 LTS. Debian 13 is a preferred candidate for lightweight continuity, **not a verified statement about 0.1.0-dev**. Record a binding decision after extracting `/etc/os-release` and complete package manifests from actual ISO.

## B. Promotion gates

| Gate | Must pass for GA |
| --- | --- |
| G0 source | Legal right to distribute every component; build recipe source controlled, dependency lock and reproducibility log |
| G1 origin | SBOM (SPDX/CycloneDX), provenance, detached signature verified independently of published hash |
| G2 boot | Virtual hardware boot on BIOS/UEFI where supported; installer works; login/network; uninstaller/recovery |
| G3 update | Security patch works, malicious/invalid update rejected, interruption rollback and disk exhaustion recovery |
| G4 security | Least privilege, signed repo policy, secure defaults, secrets off disk/secret vault policy, container isolation |
| G5 compatibility | amd64 and arm64 independently tested per edition; GPUs and devices only advertised after empirical evidence |
| G6 stability | Resource benchmarks, unattended soak, backup + restore, observability and documented known issues |
| G7 support | vulnerability channel, response ownership, security update cadence, release notes, SLA boundary and EOL policy |
| G8 publication | CI pass, manual release approval, signed immutable artifacts, checksum verified after upload and site cache |
| G9 commercialization | Legal notices, privacy commitments, support terms, export/sanctions/IP review where required |

A failed mandatory gate blocks GA. Do not silently transform GA into a labeled production release.

## C. Update design

Favor upstream-supported security packages initially. Do not improvise an A/B updater without measured hardware and recovery proof. For a later image/transactional track evaluate bootc/OSTree, transactional-update or RAUC; protect metadata using TUF roles and rollback/freeze checks. Canary rings: lab -> 1% voluntary pilot -> 10% -> general; every ring needs stop/error thresholds and restore evidence.

## D. AI and agent safety

- All model downloads and third-party API connections are user-initiated or explicitly governed by enterprise admin.
- Separate agents from OS root authority: rootless containers, AppArmor/SELinux where supported, seccomp, no privileged Docker socket.
- Gate shell/network/file operations by scoped grants, logging and human approval for destructive actions.
- Log minimal metadata by default; allow local retention/deletion; exclude secrets and prompt bodies from telemetry unless opted in.
- Pin model downloads and check third-party license; do not label model weights as first-party OS assets.

## E. Commercial offering (not current entitlements)

Possible future packages: Free Community (OS binaries), Pro Desktop deployment support, Enterprise Server support, Edge fleet licenses, AI Workstation integration support. Paid items require an actually deliverable support/security/update capability and published terms. No pricing, certifications or SLA promise here.

## F. Infrastructure and cost discipline

Cloudflare Pages/CDN can serve **static docs, download metadata and cached marketing pages**; it cannot host a Linux kernel or run customer VMs. GitHub Releases hosts binaries. VPS can handle secure notification mail and bounded background workloads while preserving separation of responsibilities. Full OS compiling, QEMU hardware tests, signing and possible GPU verification need dedicated isolated build compute—not Workers runtime. Minimize billable costs with GitHub Actions native checks, cached public assets and scheduled builds only when source changes.

## G. Unresolved blockers / evidence

1. Build recipe, lockfiles, actual upstream and kernel identity are not in this public repo (source may be private elsewhere).
2. No attested four-edition boot, image or device validation exists in inspected public evidence.
3. No live deployment credentials or Cloudflare account were used for this document.
4. Current two ISO files remain development previews.
5. Need independent product-site SEO and real-domain verification before stating the website was deployed.

## Source references

- Debian release policy: https://www.debian.org/releases/stable/
- Ubuntu 26.04 release notes: https://documentation.ubuntu.com/release-notes/26.04/
- The Update Framework: https://theupdateframework.io/
- SLSA: https://slsa.dev/
- Sigstore/cosign: https://docs.sigstore.dev/
- Podman/Quadlet: https://docs.podman.io/
- GitHub artifact attestations: https://docs.github.com/en/actions/concepts/security/artifact-attestations
