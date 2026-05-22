# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

包管理器使用 **pnpm**(锁文件为 `pnpm-lock.yaml`)。

```powershell
pnpm install
pnpm dev          # next dev — http://localhost:3000
pnpm build        # 生产构建
pnpm start        # 启动生产构建后的服务
pnpm lint         # next lint(eslint flat config:next/core-web-vitals + next/typescript)
```

仓库未配置任何测试框架。

## 架构概览

这是一个 **单页** 个人介绍网站(Next.js 16 App Router)。`app/page.tsx` 是唯一路由,按顺序拼装五个 Section:`HeroSection` → `SkillsSection` → `ProjectsSection` → `CooperationSection` → `ContactSection`。`<Header>` 与 `<Footer>` 在 `app/layout.tsx` 中包裹整页。

### 唯一的内容数据源:`data/profile.ts`

所有面向用户的文案与数据 —— 姓名、简介、联系方式、技能卡、项目列表、合作类型、导航项 —— 全部集中在 `data/profile.ts`,由各 Section 引用。**修改文案时只改这个文件,不要去改 Section 组件。** 导出的 `Skill`、`Project`、`CooperationItem` 类型也定义在这里。

`navItems[].id` 必须与对应 `<section>` 上的 `id` 一致 —— Header 通过 `IntersectionObserver` 监听这些 id 来驱动当前导航的高亮 pill。

### Tailwind v4 —— 不存在 `tailwind.config.*`

主题 token(颜色、字体栈、圆角)写在 `app/globals.css` 的 `@theme { ... }` 块里,而不是 JS 配置文件。要新增或修改设计 token,请编辑该块。字体栈已包含中文 fallback(PingFang SC / Microsoft YaHei),因为站点是中英混排。

### 动画库

动画使用 **`motion`** 包(也就是 Framer Motion v12+ 改名后的版本),import 路径是 `motion/react`,**不是** `framer-motion`。不要再单独安装 `framer-motion`;直接复用现有的 `motion`、`useMotionValue`、`useSpring`、`AnimatePresence` 等导入。`globals.css` 里已为 `prefers-reduced-motion` 用户全局降级动画,新增动效时无需重复处理。

### 组件分层

- `components/sections/*` —— 页面 Section,各自负责自己的布局与动画编排。`SectionHeader.tsx` 是共享的 eyebrow / 标题 / 描述区块。
- `components/ui/*` —— 可复用的视觉原语(`PatternBackground`、`TextGenerateEffect`、`FlipCard`、`TiltCard`、`NumberTicker`、`BentoGrid`/`BentoCard`、`BorderBeam`、`DottedGlow`)。多数借鉴 Aceternity / Magic UI 风格,均为自包含的 client component。
- `components/visual/AgentCircle.tsx` —— Hero 里的悬浮黑球视觉。
- `components/layout/{Header,Footer}.tsx`。
- `lib/utils.ts` —— `cn()`(clsx + tailwind-merge)。任何条件类名组合都用它。

路径别名 `@/*` 指向项目根目录(在 `tsconfig.json` 中配置)。

### Hero 交互(非显而易见)

`HeroSection` 实现了一套自定义的指针交互,在改动前请先理解:

- 黑色 "agent ball" 默认停在右下角;左键单击 Hero 区会 **唤醒** 它,右键单击让它 **睡觉**。
- 唤醒后,黑球以弹簧动效跟随光标,标题获得 3D 倾斜(倾斜由 `mxLive`/`myLive` 这两个 **原始** motion value 驱动,不是经过 spring 平滑过的 —— 保证倾斜对光标零延迟),同时英文标题上叠加一个径向 CSS mask,在黑球附近露出中文标题(`你好,我是锦浩`)。
- 整个交互通过 `(pointer: fine)` 媒体查询保护 —— 触屏设备完全跳过这套逻辑。
- `awakeRef` / `insideRef` 镜像对应的 React 状态,目的是避免指针事件回调里的闭包陷阱。

修改黑球尺寸、idle 位置或 reveal 半径时,常量集中在文件顶部(`BALL_SIZE`、`REVEAL_RADIUS`)。

## 视觉规范

- 调色板刻意限定为黑 / 白 / 中性灰 —— 没有充分理由不要引入彩色。
- 卡片:`rounded-2xl`、`border border-neutral-200`、静态 `shadow-sm`,hover 时升级为更重的阴影(已有约定:类似 `hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]`)。
- Section 垂直节奏:`py-24 md:py-32`。
- Section 入场动画统一用 `whileInView` + `viewport={{ once: true, margin: "-60px" }}`,并按 index 给一个小的 `delay` —— 新增内容时请保持这一约定。

## 部署

面向 Vercel —— 推到 GitHub 后在 Vercel 控制台 Import 即可,无需额外配置。`next.config.mjs` 只开启了 `reactStrictMode: true`。
