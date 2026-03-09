# Gitea Skills Catalog (VitePress)

一个纯静态的 Skills 展示站：构建时扫描 `skills/`，自动生成首页、分类页、详情页。

## 目录约定

```text
skills/{category}/{skill-name}/SKILL.md
```

## 0) 先准备你的 Skills 内容

把你自己的 skill 放进仓库，例如：

```text
skills/coding/python-debug/SKILL.md
skills/devops/docker-helper/SKILL.md
```

> 页面是构建时生成的，所以新增/修改 skill 后，需要重新执行生成或 build。

## 1) 本地运行（推荐）

```bash
npm install
REPO_URL="https://your-gitea.example.com/your-user/your-repo" \
REPO_BRANCH="main" \
npm run dev
```

启动后访问：<http://localhost:4173>

### 如果你只想先看生成结果

```bash
REPO_URL="https://your-gitea.example.com/your-user/your-repo" \
REPO_BRANCH="main" \
npm run generate
```

生成内容会写入：

- `docs/index.md`
- `docs/categories/*.md`
- `docs/skills/{category}/{skill-name}.md`
- `docs/.generated/catalog.mjs`（自动 nav/sidebar）

## 2) 生产构建

```bash
REPO_URL="https://your-gitea.example.com/your-user/your-repo" \
REPO_BRANCH="main" \
npm run build
```

产物目录：`docs/.vitepress/dist`

本地预览构建产物：

```bash
npm run preview
```

## 3) Docker 一键部署

```bash
docker compose up -d --build
```

默认访问：<http://localhost:8080>

## 4) 环境变量

- `REPO_URL`: Gitea 仓库地址（用于生成“查看源码”“下载 ZIP”链接）
- `REPO_BRANCH`: 分支名（默认 `main`）
- `REPO_ZIP_URL`: 自定义 ZIP 链接（默认 `${REPO_URL}/archive/${REPO_BRANCH}.zip`）

## 5) 常见问题

### npm install 403 / 无法访问 npm registry

这是网络或镜像策略问题，不是项目本身问题。可尝试：

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

如果你的环境只能走内网镜像，请将 registry 切到你们内部 npm 源。
