# KINGAI OS — 安装、校验、测试与恢复指南

**截至 2026-10-29：仅 Desktop / Server v0.1.0-dev amd64 预览版可下载。切勿把预览 ISO 当作已认证的生产服务器系统。**

## 1. 从可信来源获取

- 官方信息：https://os.kingai.work/
- GitHub 发布：https://github.com/kingaiwork/KINGAI-OS-Releases/releases/tag/v0.1.0-dev
- Desktop: `KINGAI-OS-Desktop-0.1.0-dev-amd64.iso`
- Server: `KINGAI-OS-Server-0.1.0-dev-amd64.iso`

下载对应 `.sha256` 文件，在**同一目录**执行：

```sh
sha256sum -c KINGAI-OS-Desktop-0.1.0-dev-amd64.iso.sha256
# or, for Server:
sha256sum -c KINGAI-OS-Server-0.1.0-dev-amd64.iso.sha256
```

macOS 可使用 `shasum -a 256 filename.iso` 并手动核对校验文件。Windows PowerShell 使用 `Get-FileHash .\filename.iso -Algorithm SHA256`。

**已发布 Release 记录中的哈希值**：

| ISO | SHA-256 |
| --- | --- |
| Desktop 0.1.0-dev amd64 | `3a53c03566a1d72595a5340bdeb3eeec815342ee032fac8e2d4a4a1f9cf1643d` |
| Server 0.1.0-dev amd64 | `433bb0dd2b07f8c7579296626d706c662d42938b7b8366983799d50670abb85d` |

**安全边界**：SHA-256 只能检验字节一致性。它不是代码签名，不证明编译环境可信，也不表明 ISO 通过安全审计。下载时请确认真实 GitHub 官方仓库域名，谨防冒牌镜像。

## 2. 先在虚拟机测试

1. 备份重要数据；不要直接覆盖工作电脑或现有生产服务器。
2. QEMU/KVM、VirtualBox、VMware 中新建 amd64 VM：建议测试 4 vCPU/8 GiB RAM/64 GiB 虚拟磁盘（测试配置，并非正式最低配置）。
3. 先启动 ISO，在可用的安装流程中完成 VM 安装。
4. 首次启动验证磁盘挂载、网络、登录、正常关机/重启；桌面版检查 KDE 会话，服务器版检查 SSH 与 Podman。
5. 保存安装日志、内核版本、`/etc/os-release`、`uname -a`、`lsblk`，敏感主机名/IP 必须脱敏。
6. 将问题按复现步骤与目标硬件环境提交至 [Issues](https://github.com/kingaiwork/KINGAI-OS-Releases/issues)。

## 3. 常用只读检查

```sh
cat /etc/os-release
uname -a
lsblk -o NAME,TYPE,SIZE,FSTYPE,MOUNTPOINTS
systemctl --failed
journalctl -p err -b --no-pager
```

这些命令是检查示例；不同预览镜像实际内置的程序需要在 VM 中核验。

## 4. 生产上线验收（当前尚未达成）

- UEFI/BIOS 安装、EFI 分区、网络 DHCP 与 DNS
- 桌面/服务器不同硬件和虚拟化平台的自动化安装
- 用户权限与 rootless 容器、安全默认值、SSH 密钥登录
- 静态扫描、SBOM、漏洞扫描及第三方许可审查
- 正向更新、故障升级、断电恢复、备份还原、完整回滚演练
- 至少一次 24–72 小时压力/稳定性基线与资源监测
- ISO 签名与发布来源证明、不可变版本锁定、独立下载校验

不得因为 GitHub workflow PASS 就在营销页面宣称以上验收通过。

## 5. 部署与恢复的强制原则

- 保留原系统或可启动的恢复介质；重要数据使用异地加密备份。
- 安装前确认磁盘目标，禁止自动覆盖未明确授权的磁盘。
- 服务器远程升级前先验证带外控制台/快照与回退窗口。
- Edge 的 OTA 与 AI Workstation 的 GPU 驱动兼容属于未来版本，当前无官方可下载包。
- 使用 KINGAI OS 不要求登录 KINGAI 云账号；未来可选管理服务必须单独授权。

请到 [产品家族说明](PRODUCT_FAMILY.md) 查看四个版本的状态，或到 [发布工程与商业验收](RELEASE_ENGINEERING.md) 阅读正式版门槛。
