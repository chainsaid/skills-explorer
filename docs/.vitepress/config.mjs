import { defineConfig } from 'vitepress';
import { nav, sidebar } from '../.generated/catalog.mjs';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Skills Catalog',
  description: 'Gitea Skills 静态展示站',
  cleanUrls: true,
  themeConfig: {
    logo: '🧩',
    nav,
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://gitea.example.com/' }],
    search: {
      provider: 'local',
    },
  },
});
