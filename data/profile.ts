export type SkillDetail = {
  name: string;
  level: "精通" | "熟练" | "了解";
};

export type Skill = {
  name: string;
  desc: string;
  metric: number;
  suffix: string;
  metricLabel: string;
  details: SkillDetail[];
};

export type Project = {
  index: string;
  name: string;
  tags: string[];
  desc: string;
  year: string;
};

export type CooperationItem = {
  title: string;
  desc: string;
  highlights: string[];
  featured?: boolean;
};

export const profile = {
  name: "Hao",
  title: "AI agent engineer",
  city: "Sydney",
  heroLine: "HELLO, I'M Hao",
  heroSubtitle:
    "AI Agent · 全栈开发 · 自动化。把模型能力变成真正可用的产品与流程。",
  contact: {
    email: "jinhaozheng80@gmail.com",
    wechat: "Zhengjh15067774985",
    github: "jinhaozheng-kk",
    githubUrl: "https://github.com/jinhaozheng-kk",
    location: "Sydney, Australia",
  },
};

export const navItems = [
  { id: "about", label: "关于" },
  { id: "skills", label: "技能" },
  { id: "projects", label: "项目" },
  { id: "cooperation", label: "合作" },
];

export const skills: Skill[] = [
  {
    name: "AI Agent",
    desc: "围绕 LLM 与工具调用,设计可上线的多轮 Agent 系统与工作流。",
    metric: 3,
    suffix: "+",
    metricLabel: "落地项目",
    details: [
      { name: "AI Agent 架构设计", level: "熟练" },
      { name: "LLM 应用开发", level: "精通" },
      { name: "多智能体系统", level: "熟练" },
    ],
  },
  {
    name: "后端",
    desc: "Java / Spring 体系服务端开发,熟悉数据建模、微服务与中间件。",
    metric: 95,
    suffix: "%",
    metricLabel: "线上稳定性",
    details: [
      { name: "Java SpringBoot", level: "精通" },
      { name: "Spring Cloud", level: "熟练" },
      { name: "MySQL / PostgreSQL", level: "熟练" },
      { name: "Redis / MongoDB", level: "熟练" },
    ],
  },
  {
    name: "前端",
    desc: "React + TypeScript + Tailwind,构建有质感的现代界面与交互。",
    metric: 2,
    suffix: "",
    metricLabel: "年实战经验",
    details: [
      { name: "React / Next.js", level: "熟练" },
      { name: "TypeScript", level: "熟练" },
      { name: "Tailwind CSS", level: "精通" },
      { name: "Framer Motion 动效", level: "熟练" },
    ],
  },
  {
    name: "自动化",
    desc: "用脚本与 Agent 串联工具链,把重复劳动变成一次性配置。",
    metric: 3,
    suffix: "+",
    metricLabel: "自动化方案",
    details: [
      { name: "n8n / Zapier 工作流", level: "精通" },
      { name: "Python 脚本", level: "精通" },
      { name: "GitHub Actions / CI", level: "熟练" },
    ],
  },
];

export const projects: Project[] = [
  {
    index: "01",
    name: "AI 客服 Agent 平台",
    tags: ["LLM", "Agent", "Next.js"],
    desc: "基于工具调用的客户支持 Agent,接入工单系统,自动处理 70% 常见问题。",
    year: "2025",
  },
  {
    index: "02",
    name: "内容自动化流水线",
    tags: ["Automation", "Python", "n8n"],
    desc: "从素材采集 → 生成 → 审核 → 发布全链路自动化,日产出提升 5×。",
    year: "2024",
  },
  {
    index: "03",
    name: "企业订单管理全栈开发",
    tags: ["Spring Boot", "React", "MySQL"],
    desc: "企业级订单管理系统,覆盖下单 / 审核 / 履约 / 对账全链路,支持多租户与细粒度权限。",
    year: "2025",
  },
];

export const cooperation: CooperationItem[] = [
  {
    title: "技术咨询",
    desc: "围绕 AI Agent / 自动化 / 全栈架构,提供选型、方案与代码评审。",
    highlights: ["1 对 1 沟通", "按小时或项目计费", "可签 NDA"],
  },
  {
    title: "项目开发",
    desc: "从 0 到 1 把 idea 变成可上线产品,聚焦 AI 与工作流方向。",
    highlights: ["MVP 2-6 周", "代码全交付", "上线即可用"],
    featured: true,
  },
  {
    title: "技术分享",
    desc: "团队内训 / 公开演讲 / 文章合作,主题围绕 LLM 应用与工程实践。",
    highlights: ["内训 / 公开课", "可定制大纲", "中英文皆可"],
  },
];
