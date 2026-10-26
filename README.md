# Hao — 黑白极简风个人介绍网站

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Motion-12-E91E63" alt="Motion 12">
</p>

一个**黑白极简风格**的中英混排单页个人介绍网站：没有彩色、没有图片素材，只有排版、留白和克制的动效。

整站只有一个路由，由 5 个 Section 组成：Hero（关于）→ 技能 → 项目 → 合作 → 联系。Hero 里有一个可交互的**黑色 "agent ball"**：点击唤醒后它会跟随光标、把标题"拉"出 3D 倾斜，并在英文大标题上"挖"出一个圆形窗口，露出下面的中文标题。所有文案与数据集中在**唯一数据源** `data/profile.ts` 中，改内容不需要碰组件。

- 框架：**Next.js 16 App Router + React 19 + TypeScript**
- 样式：**Tailwind CSS v4**（主题 token 写在 CSS 的 `@theme` 里，没有 `tailwind.config`）
- 动效：**`motion`**（Framer Motion v12 的新包名，`import ... from "motion/react"`）
- 图标：lucide-react；类名工具：clsx + tailwind-merge → `cn()`
- 部署：Vercel 零配置

> 仓库里的 `AGENTS.md` / `CLAUDE.md` 是写给 AI 编码助手的开发说明，本 README 面向人类读者，二者内容互补。

---

## 目录

- [1. 页面结构](#1-页面结构)
- [2. 技术栈](#2-技术栈)
- [3. 快速开始](#3-快速开始)
- [4. 内容维护](#4-内容维护)
- [5. 项目结构](#5-项目结构)
- [6. 设计系统](#6-设计系统)
- [7. 核心交互实现](#7-核心交互实现)
- [8. UI 原语组件](#8-ui-原语组件)
- [9. 动效与可访问性](#9-动效与可访问性)
- [10. 构建与部署](#10-构建与部署)
- [11. 已知限制](#11-已知限制)
- [12. 许可](#12-许可)

---

## 1. 页面结构

```text
app/layout.tsx
├─ <Header />            固定在顶部：滚动后毛玻璃背景 + IntersectionObserver 高亮导航 pill
└─ app/page.tsx
   ├─ HeroSection        #about       标题 + agent ball 交互 + 联系方式入口
   ├─ SkillsSection      #skills      4 张可翻转技能卡（数字指标 → 子技能列表）
   ├─ ProjectsSection    #projects    3 个项目卡片（网格背景 + 3D 倾斜）
   ├─ CooperationSection #cooperation 3 种合作方式 Bento 卡片（其中 1 张 featured 带流光边框）
   └─ ContactSection     #contact     联系 CTA + 邮箱/微信/GitHub/所在地（可一键复制）
```

导航项（`navItems`）只有 4 个锚点：关于 / 技能 / 项目 / 合作；「联系我」按钮直达 `#contact`。

## 2. 技术栈

| 层 | 技术 | 版本（`package.json`） |
| --- | --- | --- |
| 框架 | Next.js（App Router） | `^16.2.4` |
| UI | React / React DOM | `^19.2.5` |
| 语言 | TypeScript | `^6.0.3` |
| 样式 | Tailwind CSS + `@tailwindcss/postcss` | `^4.2.4` |
| 动画 | `motion`（Framer Motion v12+） | `^12.38.0` |
| 图标 | lucide-react | `^0.460.0` |
| 工具 | clsx + tailwind-merge | `^2.1.1` / `^3.5.0` |
| 质量 | ESLint（flat config，next/core-web-vitals + next/typescript） | `^9` |
| 包管理 | **pnpm**（仓库带 `pnpm-lock.yaml`） | — |

## 3. 快速开始

### 环境

- Node.js 20+（Next.js 16 要求）
- pnpm（`npm i -g pnpm`，或 `corepack enable`）

### 本地开发

```powershell
pnpm install
pnpm dev        # http://localhost:3000
```

### 生产构建与检查

```powershell
pnpm build      # next build
pnpm start      # 启动生产服务
pnpm lint       # eslint .
```

> 仓库没有配置测试框架，`pnpm lint` 是唯一的静态检查入口。

## 4. 内容维护

**所有面向用户的内容都在 `data/profile.ts` 里**，组件只负责渲染。改文案只改这一个文件。

### 4.1 `profile`

| 字段 | 说明 |
| --- | --- |
| `name` | 显示名（Header 左上角、SEO 标题） |
| `title` | 身份标题（SEO 标题） |
| `city` | 城市 |
| `heroLine` | Hero 英文主标题（默认固定为 `HELLO, I'M Hao` 的英文展示） |
| `heroSubtitle` | Hero 副标题 / OpenGraph 描述 |
| `contact.email` | 邮箱（Hero CTA、联系区、`mailto:`） |
| `contact.wechat` | 微信号（联系区可复制） |
| `contact.github` / `githubUrl` | GitHub 用户名与链接 |
| `contact.location` | 所在地 |

### 4.2 其他导出

| 导出 | 类型 | 说明 |
| --- | --- | --- |
| `navItems` | `{ id, label }[]` | 导航项。**`id` 必须与页面 Section 的 `id` 完全一致**，Header 的 IntersectionObserver 靠它高亮 |
| `skills` | `Skill[]` | 技能卡：`name / desc / metric / suffix / metricLabel / details[]`；`details[].level` 只能是 `精通` / `熟练` / `了解`（决定徽章样式） |
| `projects` | `Project[]` | 项目卡：`index / name / tags[] / desc / year` |
| `cooperation` | `CooperationItem[]` | 合作方式：`title / desc / highlights[] / featured?`；`featured: true` 的卡片会渲染流光边框（仅 1 张效果最好） |

### 4.3 常见修改

- **换姓名/身份**：改 `profile.name`、`profile.title`、`profile.heroLine`。
- **增加技能卡**：向 `skills` 数组追加，注意前端布局为 `sm:2 列 / lg:4 列`，4 张最平衡。
- **增加项目**：向 `projects` 追加即可，无需改组件。
- **高亮另一种合作方式**：把 `featured: true` 挪到目标项。
- **改导航**：同时修改 `navItems` 与对应 `<section id="...">`，否则高亮和滚动定位会失效。

## 5. 项目结构

```text
Personal-website-project/
├─ app/
│  ├─ layout.tsx              # 根布局：Inter 字体、metadata/OpenGraph、Header/Footer 包裹
│  ├─ page.tsx                # 单页：按顺序拼装 5 个 Section
│  └─ globals.css             # Tailwind v4 @import + @theme 设计 token + reduced-motion
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx           # 固定头部、滚动毛玻璃、IntersectionObserver 导航
│  │  └─ Footer.tsx           # 页脚
│  ├─ sections/
│  │  ├─ HeroSection.tsx      # 核心交互：agent ball + 中英标题遮罩联动（约 500 行）
│  │  ├─ SkillsSection.tsx    # 翻转技能卡 + 数字滚动
│  │  ├─ ProjectsSection.tsx  # 网格背景 + 倾斜项目卡
│  │  ├─ CooperationSection.tsx # Bento 合作卡 + 流光边框
│  │  ├─ ContactSection.tsx   # 联系方式 + 一键复制
│  │  └─ SectionHeader.tsx    # 共享的 eyebrow/标题/描述块
│  ├─ ui/                     # 自包含视觉原语（见第 8 节）
│  └─ visual/AgentCircle.tsx  # Hero 黑球外观
├─ data/profile.ts            # 唯一内容数据源 + 全部类型定义
├─ lib/utils.ts               # cn()：clsx + tailwind-merge
├─ public/                    # 静态资源目录（如需要）
├─ next.config.mjs            # reactStrictMode + outputFileTracingRoot（修复 Vercel 路径告警）
├─ eslint.config.mjs          # flat ESLint 配置
├─ postcss.config.mjs
├─ pnpm-lock.yaml
└─ 个人介绍网站_UI组件需求文档_简版.docx  # 初始 UI 需求文档
```

## 6. 设计系统

Tailwind v4 不再使用 `tailwind.config.ts`，主题 token 写在 `app/globals.css` 的 `@theme` 块：

| Token | 值 | 用途 |
| --- | --- | --- |
| `--color-background` | `#ffffff` | 背景 |
| `--color-foreground` | `#0a0a0a` | 正文 |
| `--color-muted` | `#f5f5f5` | 次级背景 |
| `--color-muted-foreground` | `#6b7280` | 次级文字 |
| `--color-border` | `#e5e7eb` | 边框（全局 `*` 默认边框色） |
| `--color-accent` | `#111111` | 主按钮 |
| `--font-sans` | Inter + 系统字体 + **中文 fallback**（PingFang SC / Microsoft YaHei） | 中英混排 |
| `--radius-card` | `1rem` | 卡片圆角（组件中对应 `rounded-2xl`） |

排版约定：

- 卡片：`rounded-2xl`、`border border-neutral-200`、静态 `shadow-sm`，hover 升级为更重阴影；
- Section 垂直节奏：`py-24 md:py-32`；
- 容器宽度：`max-w-3xl`（联系）/ `max-w-4xl`（项目）/ `max-w-6xl`（合作、Header）/ `max-w-7xl`（技能）；
- 入场动画统一 `whileInView` + `viewport={{ once: true, margin: "-60px" }}`，按 index 递增 `delay`；
- 调色板刻意限定为黑 / 白 / 中性灰，没有彩色强调色。

## 7. 核心交互实现

### 7.1 Hero 的 agent ball（`HeroSection.tsx`）

这是全站最复杂的部分（约 500 行），实现一套"球唤醒 + 拉拽标题 + 中英文遮罩揭示"的指针交互。

**状态机**

- 黑球默认停靠在 Hero 右下角的 idle 锚点，轻微浮动；
- **左键单击 Hero 区**：唤醒（`awake = true`），球跟随光标；
- **右键单击**或**光标移出 Hero**：休眠，弹簧回到 idle 锚点；
- 唤醒/休眠各触发一次 `Burst` 动画（缩放关键帧），持续 900ms / 1400ms；
- 整段逻辑由 `(pointer: fine)` 媒体查询保护——触屏设备完全跳过，回退为静态展示。

**物理与"拉拽感"**

- 球的位置：`useMotionValue` 记录目标，`useSpring(damping: 22, stiffness: 130, mass: 1.1)` 产生**带微小过冲的滞后**；
- 标题位移：由 `tanh` 饱和函数根据"球相对标题中心的距离"映射（`useSaturated`），避免线性映射在边缘突然钉死；
- 位移再经过**二阶弹簧**（`txLag` / `tyLag`，stiffness 200 / damping 20 / mass 0.55），使文字比球慢一拍跟上——视觉上就是"球把文字拽过去"；
- 旋转（`rotX` / `rotY`）不做二次弹簧，保证 3D 深度反馈即时。

**中英文遮罩揭示**

- 两层标题叠放：英文在上、中文在下（`你好，我是锦浩`）；
- 用 `useMotionTemplate` 生成两个互补的 `radial-gradient` mask：英文层在球周围**挖洞**（`transparent 55% → black 92%`），中文层在球周围**显影**（`black 50% → transparent 90%`）；
- 圆的中心实时减去标题的**滞后位移**，保证揭示窗口始终贴着球，即使标题还在追赶；
- 常量集中在文件顶部：`BALL_SIZE = 200`、`REVEAL_RADIUS = 130`。

**闭包陷阱处理**：`awakeRef` / `insideRef` 镜像 React 状态，供指针事件回调读取最新值，避免 `useEffect` 闭包拿到过期状态。

### 7.2 Header（`components/layout/Header.tsx`）

- 滚动超过 8px 后切换为 `bg-white/70 + backdrop-blur-xl + 下边框`；
- 用 `IntersectionObserver`（`rootMargin: "-40% 0px -50% 0px"`，5 档 threshold）监听 4 个 Section，取可见比例最高的作为当前项；
- 激活项用 `motion` 的 `layoutId="nav-pill"` 实现黑色 pill 平滑滑动；
- 点击导航调用 `scrollIntoView({ behavior: "smooth" })`，配合 `html { scroll-behavior: smooth }`；
- `md` 以上显示胶囊导航，`md` 以下切换为底部一行小号导航。

### 7.3 各 Section 的动画编排

| Section | 交互 |
| --- | --- |
| Skills | `FlipCard` 3D 翻转：正面是大号 `NumberTicker` 数字 + 技能名，背面是子技能与「精通/熟练/了解」徽章 |
| Projects | `TiltCard`（`maxRotate=16`）鼠标跟随倾斜；`PatternBackground variant="grid"` 网格底纹 |
| Cooperation | `BentoGrid`（行高 20rem），`featured` 卡片叠加 `BorderBeam` 流光；`lucide` 的 Check/ArrowUpRight 图标 |
| Contact | `DottedGlow` 点阵底纹；邮箱/微信可复制（`navigator.clipboard`，1.6s 后恢复图标） |

## 8. UI 原语组件

`components/ui/` 下是一个个自包含的 client component，可以单独复用：

| 组件 | 作用 |
| --- | --- |
| `grid-dot-background.tsx` → `PatternBackground` | 点阵 / 网格背景，支持 `fade` 渐隐 |
| `text-generate-effect.tsx` → `TextGenerateEffect` | 按词 stagger 的逐字显现标题 |
| `flip-card.tsx` → `FlipCard` | 正反面 3D 翻转容器 |
| `tilt-card.tsx` → `TiltCard` | 鼠标跟随的 3D 倾斜卡片（`maxRotate` 可调） |
| `number-ticker.tsx` → `NumberTicker` | 进入视口后数字滚动到目标值（spring） |
| `bento-grid.tsx` → `BentoGrid` / `BentoCard` | Bento 布局容器与卡片 |
| `border-beam.tsx` → `BorderBeam` | 卡片边缘的流光动画 |
| `dotted-glow.tsx` → `DottedGlow` | 点阵 + 中心光晕背景 |

## 9. 动效与可访问性

- `app/globals.css` 全局处理了 `prefers-reduced-motion: reduce`：所有动画/过渡时长压到 0.001ms，新增动效无需重复适配；
- 指针交互统一用 `(pointer: fine)` 保护，触屏不会出现"看不见的球"；
- 联系区的复制按钮带 `aria-label="复制 Email"` 这类可访问名称；
- 语义结构：`header` / `main` / `section[id]` / `footer`，标题层级 `h2 → h3`；
- 外链（GitHub）带 `target="_blank" rel="noopener noreferrer"`；
- `html lang="zh-CN"`，字体栈内置中文 fallback。

## 10. 构建与部署

### Vercel（推荐）

推到 GitHub 后在 Vercel 导入仓库，框架自动识别，无需环境变量。

`next.config.mjs` 中显式设置了 `outputFileTracingRoot`，用于规避 Vercel `modifyConfig` 在自动探测失败时对 `path.*` 传入 `undefined` 的告警。

### 自托管

```powershell
pnpm build
pnpm start      # 默认 3000 端口，可用 PORT 环境变量覆盖
```

Node 服务器模式；如需静态导出，需要在 `next.config.mjs` 增加 `output: "export"`（当前未开启）。

## 11. 已知限制

- 仓库没有测试框架，只有 ESLint；CI 也未配置。
- 内容均为静态硬编码，没有 CMS / 后台 / 数据库。
- 项目与技能部分内容更像作品集模板：项目没有外链或详情页。
- `HeroSection` 体积大、逻辑复杂（约 500 行），修改前建议先读第 7.1 节与 `AGENTS.md`。
- 联系电话/微信等属于公开个人信息，直接写在 `data/profile.ts` 中，若用于公开部署请自行评估。
- 中文文案与英文品牌名混排，字体依赖系统 fallback，不同平台观感略有差异。
- Hero 交互仅在精细指针设备生效，移动端只能看到静态黑球。

## 12. 许可

仓库未附带 LICENSE 文件；代码可作学习参考，个人资料、文案与设计版权归作者所有。
