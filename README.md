# dsh-produced-file-paths

独立的 DSH Web 插件：在 DSH 内置的“产物”文件行下面显示本轮生成/修改文件的**绝对路径**，并提供：

- 单个文件路径复制；
- 一键复制全部文件路径（每行一个）；
- 路径文本可直接选中复制。

插件只读取 DSH 已经识别出的 produced-file 列表，不修改文件、不增加文件下载接口，也不修改 `dsh-sticky-notes`。

## 安装

本地 profile 使用：

```json
{
  "dependencies": {
    "dsh-produced-file-paths": "file:/home/gao/dsh/dsh-produced-file-paths"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dshmarket",
        "dsh-sticky-notes",
        "dsh-produced-file-paths"
      ]
    }
  }
}
```

然后在 Web profile 目录执行 `pnpm install` 并重启 DSH。
