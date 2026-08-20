# dsh-produced-file-paths

[中文](README.md)

An independent DSH Web plugin that displays the **absolute paths** of files produced or modified during the current turn and makes those paths easy to copy.

## Why is this plugin needed?

DSH's remote Web interface shows files created or modified during a turn as clickable file items. However, those items are implemented as JavaScript buttons rather than ordinary links with an `href`. This creates several practical problems in remote Web deployments:

- There is no normal “Copy link address” browser action;
- The complete absolute path is not directly visible on the page;
- The remote Web Host often has no desktop application available, so clicking a file item may not open anything;
- Users still need to copy the path into SSH, a terminal, an editor, or another tool.

This plugin does not try to turn a Host filesystem path into a browser URL, and it does not add a file-download service. Instead, it reuses DSH's own produced-file list, displays the corresponding absolute paths, and provides copy controls. The original DSH file-opening behavior remains unchanged, while remote Web users gain a simple way to see and copy the paths they need.

## Screenshot

The following screenshot shows the plugin working in the DSH remote Web interface:

![dsh-produced-file-paths UI](filepath.png)

## Features

- Displays absolute paths below DSH's built-in produced-files row;
- Copies one file path at a time;
- Copies all produced paths, one per line;
- Keeps the path text selectable for ordinary text copying;
- Reads DSH's published produced-file list without modifying files;
- Does not add a file-download endpoint;
- Does not modify `dsh-sticky-notes`.

## Installation

Install it directly from GitHub with the DSH plugin manager:

```bash
dsh plugin --profile web add github:flyhigao/dsh-produced-file-paths
```

After installation, restart `dsh web` and hard-refresh the remote Web page (`Ctrl+Shift+R`).

### Local development

To develop from a local checkout instead, use a local directory source:

```bash
dsh plugin --profile web add file:/path/to/dsh-produced-file-paths
```

Refresh the page after client-bundle changes. Restart `dsh web` after changing the host entry or bundle composition.
