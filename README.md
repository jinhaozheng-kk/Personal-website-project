# Hao — 个人介绍网站

黑白极简风格的单页个人网站。Next.js 16 + React 19 + Tailwind CSS v4 + Framer Motion。

## 本地开发

```powershell
pnpm install
pnpm dev
```

打开 http://localhost:3000 。

## 构建与部署

```powershell
pnpm build
pnpm start
```

部署到 Vercel:把目录推送到 GitHub 仓库,在 Vercel 控制台 Import 即可,无需额外配置。

## 内容更新指南

所有文案与数据都集中在 **`data/profile.ts`**。改这一个文件就能更新:

- `profile`: 姓名 / 身份 / 城市 / Hero 标题 / 副标题
- `profile.contact`: 邮箱、微信、GitHub、所在地
- `skills`: 4 张技能卡(名称 / 说明 / 数字指标)
- `projects`: 项目列表(编号 / 名称 / 标签 / 简介 / 年份)
- `cooperation`: 合作类型(可标 `featured: true` 高亮 1 张)
- `navItems`: 顶部导航项(id 必须与 Section 的 id 对应)

## 目录结构

```
app/                  # 路由(单页)
  layout.tsx          # 根布局 + 字体 + Header/Footer
  page.tsx            # 拼装 5 个 Section
  globals.css         # Tailwind v4 + 主题变量
components/
  layout/             # Header / Footer
  sections/           # Hero / Skills / Projects / Cooperation / Contact
  ui/                 # 视觉组件(Pattern 背景 / Text Generate / Flip / Tilt / Number Ticker / Bento / Border Beam / Dotted Glow)
  visual/             # AgentCircle 自定义
data/profile.ts       # 单一数据源
lib/utils.ts          # cn() 工具
```

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS v4(配置写在 `app/globals.css` 的 `@theme`)
- **动画**: Framer Motion(`motion` 包)
- **图标**: lucide-react
- **工具**: clsx + tailwind-merge → `cn()`

## 视觉规范

- 主色:黑 / 白 / 浅灰
- 圆角统一 `rounded-2xl`
- 阴影从 `shadow-sm` 起,hover 升至 `shadow-[0_8px_30px_rgba(0,0,0,0.06)]`
- Section 间距 `py-24 md:py-32`
- 移动端自动降低动效复杂度;尊重 `prefers-reduced-motion`
