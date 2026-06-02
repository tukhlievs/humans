import type { Category, Channel, Person } from "@/types";

export const categories: Category[] = [
  { slug: "crypto", title: "Криптовалюта", subtitle: "Новости и аналитика рынка" },
  { slug: "news", title: "Новости", subtitle: "Международная повестка" },
  { slug: "pro", title: "Профессиональный блог", subtitle: "Известные личности" },
  { slug: "blog", title: "Блог", subtitle: "Авторы, одобренные админом" },
];

export const channels: Channel[] = [
  // Криптовалюта
  {
    id: "btc-news",
    username: "bitcoin",
    title: "Bitcoin",
    category: "crypto",
    niche: "Криптовалюта",
    description:
      "Главные новости биткоина и крипторынка: курсы, движения китов, регуляции и техника.",
    subscribers: 1_800_000,
    tags: ["GLOBAL"],
    verified: true,
  },
  {
    id: "forklog",
    username: "forklog",
    title: "ForkLog",
    category: "crypto",
    niche: "Криптовалюта",
    description: "Издание о криптовалютах, блокчейне и децентрализованных финансах.",
    subscribers: 1_120_000,
    tags: ["CIS"],
  },
  {
    id: "defi-pulse",
    username: "defipulse",
    title: "DeFi Pulse",
    category: "crypto",
    niche: "DeFi",
    description: "Протоколы, доходность, ончейн-метрики и разбор новых запусков в DeFi.",
    subscribers: 1_040_000,
    tags: ["GLOBAL"],
  },

  // Новости
  {
    id: "breaking",
    username: "breaking",
    title: "Breaking News",
    category: "news",
    niche: "Новости",
    description: "Срочные международные новости в реальном времени, без воды.",
    subscribers: 2_400_000,
    tags: ["GLOBAL"],
    verified: true,
  },
  {
    id: "world-today",
    username: "worldtoday",
    title: "World Today",
    category: "news",
    niche: "Новости",
    description: "Политика, экономика и общество — обзор главного за день.",
    subscribers: 1_650_000,
    tags: ["GLOBAL"],
  },

  // Профессиональный блог
  {
    id: "durov",
    username: "durov",
    title: "Pavel Durov",
    category: "pro",
    niche: "Технологии",
    description: "Личный канал основателя Telegram о приватности, продукте и свободе.",
    subscribers: 1_530_000,
    tags: ["GLOBAL"],
    verified: true,
  },
  {
    id: "roxman",
    username: "roxman",
    title: "Roxman",
    category: "pro",
    niche: "Контент / медиа",
    description: "Заметки о медиа, продакшене и жизни за кадром от известного блогера.",
    subscribers: 940_000,
    tags: ["CIS", "GLOBAL"],
    verified: true,
  },
  {
    id: "maxim",
    username: "maxim",
    title: "Maxim",
    category: "pro",
    niche: "Бизнес",
    description: "Предпринимательство, продукты и личная эффективность без инфоцыганства.",
    subscribers: 610_000,
    tags: ["CIS"],
  },

  // Блог (обычные авторы)
  {
    id: "devnotes",
    username: "devnotes",
    title: "Dev Notes",
    category: "blog",
    niche: "Разработка",
    description: "Дневник самоучки: Python, проекты и путь к первой работе в IT.",
    subscribers: 48_200,
    tags: ["CIS"],
  },
  {
    id: "studyflow",
    username: "studyflow",
    title: "Study Flow",
    category: "blog",
    niche: "Образование",
    description: "Как учиться эффективно: системы, заметки и привычки.",
    subscribers: 21_400,
    tags: ["CIS"],
  },
  {
    id: "minimal-life",
    username: "minimallife",
    title: "Minimal Life",
    category: "blog",
    niche: "Лайфстайл",
    description: "Минимализм, фокус и осознанное потребление в эпоху шума.",
    subscribers: 12_900,
    tags: ["GLOBAL"],
  },
];

export const seedPeople: Person[] = [
  {
    id: "p-1",
    name: "Амир",
    username: "amir_codes",
    goal: "Ищу напарника для пет-проекта на Next.js",
    interests: ["Frontend", "Telegram Mini Apps", "Дизайн"],
  },
  {
    id: "p-2",
    name: "Дина",
    username: "dina_ml",
    goal: "Собираю команду для соревнований по ML",
    interests: ["Python", "ML", "Kaggle"],
  },
  {
    id: "p-3",
    name: "Тимур",
    goal: "Хочу найти единомышленников по крипте и трейдингу",
    interests: ["Crypto", "DeFi", "Аналитика"],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getChannelsByCategory(slug: string): Channel[] {
  return channels.filter((c) => c.category === slug);
}

export function getChannel(id: string): Channel | undefined {
  return channels.find((c) => c.id === id);
}
