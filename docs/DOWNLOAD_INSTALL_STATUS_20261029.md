# KINGAI OS · 官方下载与安装验收状态 / Download & Install Status

**截至 / As of 2026-10-29. 该页面不是认证文件，不授权生产安装或自动升级。**

## 哪些镜像现在真的可以下载？ / What is really available?

| 版本 / Edition | Official release asset | Published size | Status |
| --- | --- | ---: | --- |
| Desktop AMD64 | [Download 0.1.0-dev ISO](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/KINGAI-OS-Desktop-0.1.0-dev-amd64.iso) | 2,139,549,696 bytes | Developer preview only |
| Server AMD64 | [Download 0.1.0-dev ISO](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/KINGAI-OS-Server-0.1.0-dev-amd64.iso) | 1,249,024,000 bytes | Developer preview only |
| Edge AMD64 | **No published ISO** | — | Experimental internal build only |
| AI Workstation AMD64 | **No published ISO** | — | Experimental internal build only |
| All ARM64 | **No published ISO** | — | Not validated |

The sidecars beside the two published ISO assets are the only release-scoped official checksum companions. Verify these checksums and image provenance **before** attempting use. Do not use a digest from a newer **transient CI test** against these older public images.

- [Desktop SHA-256 sidecar](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/KINGAI-OS-Desktop-0.1.0-dev-amd64.iso.sha256)
- [Server SHA-256 sidecar](https://github.com/kingaiwork/KINGAI-OS-Releases/releases/download/v0.1.0-dev/KINGAI-OS-Server-0.1.0-dev-amd64.iso.sha256)

## 内部实验结果并不等于公开发行 / Internal test evidence ≠ public release

A later set of **four actual Debian 13 AMD64 experimental ISOs** was successfully compiled and hashed on disposable, hosted CI runners. These images were ephemeral. They are **not** the October 6 `v0.1.0-dev` public assets, nor were the new images archived as publicly retrievable downloads.

All four experimental AMD64 editions — Desktop, Server, Edge, and AI Workstation — separately passed **QEMU BIOS and UEFI live-system** startup into systemd in isolated, test-only CI, including the latest independent three-edition test matrix. These measurements prove test-only instrumented ISO boots, **not** full GUI login, installed-disk reboot, GPU support, real-hardware compatibility, or validation of the older public v0.1.0-dev images.

An unattended Server installation into a disposable QCOW2 progressed through partition creation, base-system installation and GRUB, but exceeded its initial installer timeout before a **verified installed-disk reboot**. A corrected, extended-timing test is being run separately. Until there is an actual clean installation followed by a disk-only reboot, **installation certification remains BLOCKED**. The old downloadable v0.1.0-dev assets have not been proven equivalent to the new test ISOs.

The repository's public catalog is the authoritative **download availability** source, not the CI test success display.

## 如何安全试用 / Safe trial path

1. Download an ISO and its matching `.sha256` companion from the official release above. Never use an unofficial claimed Edge or AI Workstation download.
2. Validate SHA-256 locally. Hash comparison detects differences, but is not an independent code signature or malware certification.
3. Create a **new, empty AMD64 virtual machine** for each trial. Suggested lab configuration: four virtual CPUs, eight GiB RAM, and a 64 GiB virtual disk. This is not a tested minimum hardware specification.
4. Connect the preview ISO to the VM, try the installation path and confirm the selected target is **only** the new virtual disk. Installer operations can erase the target.
5. If installation does not complete, hangs, asks unexpected questions, or the installed system cannot reboot from its own disk, **stop** and retain logs. Do not replace your current desktop, real hardware disk or production server.
6. If successful, check Linux boot, login, network, storage, clean shutdown/reboot and the applicable KDE/SSH/Podman functions, recording each separately. Report your exact steps and sanitized logs to [Issues](https://github.com/kingaiwork/KINGAI-OS-Releases/issues).

See [installation details](INSTALLATION.md), [product roadmap](PRODUCT_FAMILY.md), and [commercial release gates](RELEASE_ENGINEERING.md). There is **no authorized stable/GA ISO**, automatic A/B upgrade, verified rollback, Secure Boot certification, GPU hardware guarantee or paid production support commitment at this stage.

© 2026 KINGAI OS. Linux and bundled Debian components retain their own upstream licenses.
