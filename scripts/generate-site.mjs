import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skillsRoot = path.join(root, 'skills');
const docsRoot = path.join(root, 'docs');
const generatedRoot = path.join(docsRoot, '.generated');
const categoriesRoot = path.join(docsRoot, 'categories');
const skillsPagesRoot = path.join(docsRoot, 'skills');

const repoUrl = process.env.REPO_URL || 'https://gitea.example.com/your-user/skills-repo';
const branch = process.env.REPO_BRANCH || 'main';
const zipUrl = process.env.REPO_ZIP_URL || `${repoUrl}/archive/${branch}.zip`;

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });
const cleanDir = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    fs.rmSync(full, { recursive: true, force: true });
  }
};

function findSkillFiles(baseDir) {
  const result = [];
  if (!fs.existsSync(baseDir)) return result;
  const categories = fs.readdirSync(baseDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  for (const categoryDir of categories) {
    const category = categoryDir.name;
    const absCategory = path.join(baseDir, category);
    const skills = fs.readdirSync(absCategory, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const skillDir of skills) {
      const skillName = skillDir.name;
      const skillPath = path.join(absCategory, skillName, 'SKILL.md');
      if (!fs.existsSync(skillPath)) continue;
      result.push({
        category,
        skillName,
        skillPath,
        relPath: `skills/${category}/${skillName}/SKILL.md`,
      });
    }
  }
  return result.sort((a, b) => a.category.localeCompare(b.category) || a.skillName.localeCompare(b.skillName));
}

const escapeMd = (value) => value.replace(/[|]/g, '\\|');
const titleCase = (value) => value.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

function parseFrontmatterName(markdown, fallback) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return fallback;
  const body = match[1];
  const nameLine = body.match(/^name:\s*(.+)$/m);
  return nameLine ? nameLine[1].trim() : fallback;
}

function generateSkillPage(skill) {
  const markdown = fs.readFileSync(skill.skillPath, 'utf8');
  const displayName = parseFrontmatterName(markdown, skill.skillName);
  const sourceUrl = `${repoUrl}/src/branch/${branch}/${skill.relPath}`;

  return `---\ntitle: ${displayName}\noutline: deep\n---\n\n<div class="skill-meta">\n  <span class="pill">分类：${skill.category}</span>\n  <span class="pill">技能：${skill.skillName}</span>\n</div>\n\n# ${displayName}\n\n<div class="skill-actions">\n  <a class="action-link" href="${sourceUrl}" target="_blank" rel="noreferrer">查看 Gitea 源码</a>\n  <a class="action-link" href="${zipUrl}" target="_blank" rel="noreferrer">下载仓库 ZIP</a>\n</div>\n\n---\n\n${markdown}\n`;
}

function generateCategoryPage(category, skills) {
  const rows = skills
    .map((skill) => `- [${escapeMd(skill.displayName)}](/skills/${skill.category}/${skill.skillName})`) 
    .join('\n');

  return `---\ntitle: ${titleCase(category)}\n---\n\n# ${titleCase(category)}\n\n共 ${skills.length} 个技能：\n\n${rows}\n`;
}

function generateHome(skills) {
  const byCategory = skills.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
  const sections = Object.keys(byCategory)
    .sort()
    .map((category) => {
      const list = byCategory[category]
        .map((item) => `- [${escapeMd(item.displayName)}](/skills/${item.category}/${item.skillName})`)
        .join('\n');
      return `## ${titleCase(category)}\n\n${list}`;
    })
    .join('\n\n');

  return `---\nlayout: home\n\nhero:\n  name: Skills Catalog\n  text: 基于 Gitea 仓库构建的静态技能展示站\n  tagline: 构建时自动扫描 skills/，无数据库、无后端、无运行时 API 请求\n  actions:\n    - theme: brand\n      text: 浏览全部技能\n      link: /categories/\n    - theme: alt\n      text: 下载仓库 ZIP\n      link: ${zipUrl}\n\nfeatures:\n  - icon: 🧭\n    title: 分类浏览\n    details: 按 category 自动聚合技能，快速定位目标内容\n  - icon: ⚡\n    title: 静态生成\n    details: 构建时扫描 SKILL.md 生成页面，部署简单稳定\n  - icon: 🔗\n    title: 源码直达\n    details: 每个技能页都可一键跳转到 Gitea 原始目录\n---\n\n${sections}\n`;
}

function main() {
  ensureDir(generatedRoot);
  ensureDir(categoriesRoot);
  ensureDir(skillsPagesRoot);

  cleanDir(generatedRoot);
  cleanDir(categoriesRoot);
  cleanDir(skillsPagesRoot);

  const skills = findSkillFiles(skillsRoot).map((item) => {
    const markdown = fs.readFileSync(item.skillPath, 'utf8');
    return {
      ...item,
      displayName: parseFrontmatterName(markdown, item.skillName),
    };
  });

  const byCategory = skills.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
  const categoryIndexItems = [];

  for (const skill of skills) {
    const pageDir = path.join(skillsPagesRoot, skill.category);
    ensureDir(pageDir);
    fs.writeFileSync(path.join(pageDir, `${skill.skillName}.md`), generateSkillPage(skill));
  }

  for (const category of Object.keys(byCategory).sort()) {
    fs.writeFileSync(path.join(categoriesRoot, `${category}.md`), generateCategoryPage(category, byCategory[category]));
    categoryIndexItems.push(`- [${titleCase(category)}](/categories/${category})`);
  }

  fs.writeFileSync(path.join(docsRoot, 'index.md'), generateHome(skills));
  fs.writeFileSync(
    path.join(categoriesRoot, 'index.md'),
    `---\ntitle: 分类\n---\n\n# 分类\n\n${categoryIndexItems.join('\n') || '暂无分类。'}\n`,
  );

  const nav = [
    { text: '首页', link: '/' },
    { text: '分类', link: '/categories/' },
    { text: '下载 ZIP', link: zipUrl },
  ];

  const sidebar = {
    '/categories/': [
      {
        text: '分类',
        items: Object.keys(byCategory).sort().map((category) => ({
          text: titleCase(category),
          link: `/categories/${category}`,
        })),
      },
    ],
    '/skills/': Object.keys(byCategory)
      .sort()
      .map((category) => ({
        text: titleCase(category),
        collapsed: false,
        items: byCategory[category].map((skill) => ({
          text: skill.displayName,
          link: `/skills/${skill.category}/${skill.skillName}`,
        })),
      })),
  };

  fs.writeFileSync(
    path.join(generatedRoot, 'catalog.mjs'),
    `export const nav = ${JSON.stringify(nav, null, 2)};\nexport const sidebar = ${JSON.stringify(sidebar, null, 2)};\n`,
  );

  console.log(`Generated ${skills.length} skill pages in ${Object.keys(byCategory).length} categories.`);
}

main();
