# dsh-produced-file-paths

[English](README.en.md)

独立的 DSH Web 插件：在 DSH 内置的“产物”文件行下面显示本轮生成/修改文件的**绝对路径**，并提供：

- 单个文件路径复制；
- 一键复制全部文件路径（每行一个）；
- 路径文本可直接选中复制。

## 为什么需要这个插件？

DSH 的远程 Web 界面会把本轮生成或修改的文件显示为可点击的文件项，但这些文件项本质上是由前端 JavaScript 处理的按钮，并不是带有 `href` 的普通链接。因此在远程访问时会遇到几个实际问题：

- 无法右键复制链接地址；
- 页面上不容易直接看到文件的完整绝对路径；
- 远程 Web 所在的 Host 通常没有可用的桌面程序，点击文件项不一定能打开文件；
- 用户需要把文件路径复制到 SSH、终端、编辑器或其他工具中继续处理。

这个插件不试图把远程 Host 文件伪装成浏览器 URL，也不新增文件下载服务。它直接复用 DSH 已经识别出的本轮产物文件列表，在界面中显示对应的绝对路径，并提供复制按钮。这样既保留 DSH 原有的文件打开行为，也为远程 Web 场景补上“看得到、复制得到文件路径”的能力。

## 界面效果

下面是插件在 DSH 远程 Web 界面中的实际效果：
![文件路径复制插件界面](assets/filepath.png)

## 功能

- 在 DSH 内置“产物”文件行下方显示本轮生成/修改文件的绝对路径；
- 单个文件路径复制；
- 一键复制全部文件路径（每行一个）；
- 路径文本可直接选中复制；
- 只读取 DSH 已经识别出的 produced-file 列表，不修改文件；
- 不增加文件下载接口；
- 不修改 `dsh-sticky-notes`。

## 兼容性

- 支持 DSH `0.1.0-rc.6`、`0.1.0-rc.8`、`0.1.1-rc.2`、`0.1.2-alpha.2` 及更高版本。
- 零外部运行时依赖，不依赖已被废弃的 `dsh-client-runtime`。
- 使用 DSH 标准插槽 `conversation.chat.turnTail` 注入，与内置产物行共存。

## 安装

直接通过 DSH 插件管理命令从 GitHub 安装：

```bash
dsh plugin --profile web add github:flyhigao/dsh-produced-file-paths
```

安装完成后重启 `dsh web`，然后硬刷新远程 Web 页面（`Ctrl+Shift+R`）。

### 本地开发

如果要使用本地源码开发，可以改用本地目录安装：

```bash
dsh plugin --profile web add file:/path/to/dsh-produced-file-paths
```

修改客户端代码后刷新页面；修改服务端入口或插件组合后重启 `dsh web`。

## 路径语义与安全边界

插件复制的是 DSH 当前 Session 工作区下的**绝对文件系统路径**，不是浏览器 URL，也不是 `file://` 链接。例如：

```text
/home/gao/dsh/reports/summary.md
```

路径来自 DSH 的 produced-file 数据，并由当前 Session 的工作区目录解析相对路径。插件只读取和展示这些路径，不接受用户输入的路径，不扫描工作区，也不读取文件内容。

因此，复制路径本身不会增加新的文件访问权限；能否访问文件仍由 SSH、终端、编辑器或其他实际使用该路径的工具决定。

## 升级后或看不到路径时的排查

如果安装后没有看到复制入口，按下面顺序检查：

1. 确认插件安装在 Web profile，而不是其他 profile：

   ```bash
   dsh plugin --profile web add github:flyhigao/dsh-produced-file-paths
   ```

2. 重启 `dsh web`，因为 `cordis.patch.yml` 和浏览器插件清单在启动时组合。
3. 在浏览器执行硬刷新（`Ctrl+Shift+R`），清除旧的 client bundle 缓存。
4. 先确认 DSH 内置的“产物”文件行正常出现。插件只显示 DSH 已识别的 produced-file；如果该行没有文件，插件也不会凭空猜测路径。
5. 如果只修改了本地源码，删除 profile 中旧的插件副本后重新安装：

   ```bash
   cd ~/.dsh/profiles/web
   rm -rf node_modules/dsh-produced-file-paths
   pnpm install
   ```

远程 Web 页面没有桌面文件打开器并不影响路径复制；该功能只依赖浏览器剪贴板和当前 Session 的路径数据。

## 开发与发布检查

这是一个手工维护的轻量插件，不需要额外构建工具。浏览器 bundle 位于 `client/client.js`，服务端入口位于 `lib/index.js`。

提交前可以执行：

```bash
node --check client/client.js
node --check lib/index.js
npm pack --dry-run
tar -tzf dsh-produced-file-paths-*.tgz
```

发布包必须包含 `lib/`、`lib/types/`、`client/`、`assets/`、`cordis.patch.yml` 和双语 README。插件的 `dsh.bundle` 声明与根目录的 `cordis.patch.yml` 是通过 DSH 插件管理命令安装和提交插件市场所必需的组合入口。
