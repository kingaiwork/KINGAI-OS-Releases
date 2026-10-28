# KINGAI OS — Public Developer Preview Releases

This repository publishes the **official public installation images and SHA-256 checksums** for KINGAI OS Desktop and Server.

- Official OS site: https://os.kingai.work/
- KING AI product family: https://www.kingai.work/
- Download releases and checksum sidecars: https://github.com/kingaiwork/KINGAI-OS-Releases/releases
- Public product directory and visual/official-link guide: https://github.com/kingaiwork/KINGAIASE-public/blob/main/ECOSYSTEM-UI-AND-LINKS.md

## At a glance

- **Product:** KINGAI OS — Desktop and Server editions
- **Architecture:** amd64
- **Current release:** v0.1.0-dev (prerelease, published 2026-10-06)
- **Assets per edition:** ISO installation image + `.sha256` checksum sidecar
- **Status:** Developer Preview — not a generally available stable release
- **Official site:** https://os.kingai.work/

## Current public preview

**v0.1.0-dev** (prerelease, published 2026-10-06) provides amd64 Desktop and Server ISO assets, each with a `.sha256` checksum sidecar.

These are **Developer Preview** images, not generally available stable releases. Check the release notes and known limitations, verify SHA-256 before use and test in a virtual machine or disposable environment before installing on primary hardware.

## Download and verify

1. Download the ISO for your edition (Desktop or Server) and its `.sha256` sidecar from the [releases page](https://github.com/kingaiwork/KINGAI-OS-Releases/releases).
2. Verify the checksum before installing:
   - Linux: `sha256sum -c <image>.sha256`
   - macOS: `shasum -a 256 <image>` and compare with the sidecar file
3. Read the release notes and known limitations for that version.
4. Test in a virtual machine or disposable environment first.

## 中文摘要

本仓发布 KINGAI OS 桌面版与服务器版的官方公开安装镜像及 SHA-256 校验文件。当前版本 v0.1.0-dev 为开发者预览版（2026-10-06 发布，amd64），不是稳定正式版：安装前请先核对校验值，并先在虚拟机或闲置设备上试用。官网：https://os.kingai.work/

## FAQ

**Is KINGAI OS stable enough for my main computer?**
No. The current public images are a Developer Preview. Install on primary hardware only after testing in a virtual machine or on a spare device.

**What is published in this repository?**
Public binaries and checksums only. Source authority, signing secrets, build infrastructure and operational credentials are not published here.

**Where is the official product site?**
https://os.kingai.work/ — the KINGAI OS product family also appears at https://www.kingai.work/.

**How do I report a problem with an image?**
Open an issue in this repository, or contact KINGAI via https://kingai.work/contact/.

Releases here are public binaries/checksums only. Source authority, signing secrets, build infrastructure and operational credentials are not published here.
