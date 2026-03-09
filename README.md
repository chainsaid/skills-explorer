# Gitea Skills Catalog (VitePress)

一个纯静态的 Skills 展示站：构建时扫描 `skills/`，自动生成首页、分类页、详情页。

## 目录约定

```text
skills/{category}/{skill-name}/SKILL.md
```

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 可选环境变量

- `REPO_URL`: Gitea 仓库地址（默认 `https://gitea.example.com/your-user/skills-repo`）
- `REPO_BRANCH`: 分支名（默认 `main`）
- `REPO_ZIP_URL`: 自定义 zip 下载地址（默认 `${REPO_URL}/archive/${REPO_BRANCH}.zip`）

## 部署（Docker）

```bash
docker compose up -d --build
```

默认访问：<http://localhost:8080>
