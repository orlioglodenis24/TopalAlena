// ─────────────────────────────────────────────────────────────
//  ВСЕ ДАННЫЕ САЙТА — ЗДЕСЬ.
//  Меняешь значения → сайт обновляется. Вёрстку трогать не нужно.
//  Картинки кладём в /public/img/..., путь пишем от корня: '/img/...'
// ─────────────────────────────────────────────────────────────

export const site = {
  // ── Личные данные ──────────────────────────────────────────
  firstName: 'Topal Alena',
  latinName: 'TOPAL ALENA', // для декоративных подписей
  role: '3D Generalist · Motion Designer',
  roleLong: '3D Generalist · Motion Designer · 3D Visual Storyteller · Visual Production',
  roleShort: '3D generalist · motion designer',
  city: 'Молдова',
  timeZone: 'Europe/Chisinau', // для «местного времени» в футере
  since: 'С 2022',
  status: 'Открыта для новых проектов',
  photo: '/img/alena.jpg',

  // ── SEO ────────────────────────────────────────────────────
  meta: {
    title: 'Topal Alena — 3D Generalist & Motion Designer',
    description:
      'Портфолио Topal Alena: 3D-окружение и локации, клипы и моушен на любую тематику, интеграции логотипов в 3D-сцены. Blender, Cinema 4D, Unreal Engine 5, After Effects, DaVinci Resolve.',
    url: 'https://example.com', // ЗАГЛУШКА — домен сайта
  },

  // ── Контакты ───────────────────────────────────────────────
  email: 'alena.mnlv@gmail.com',
  telegram: { label: '@freeid2', url: 'https://t.me/freeid2' },
  instagram: { label: '@alll.eena', url: 'https://www.instagram.com/alll.eena/' },

  socials: [
    { name: 'Telegram', url: 'https://t.me/freeid2' },
    { name: 'Instagram', url: 'https://www.instagram.com/alll.eena/' },
  ],

  // ── Блок «Обо мне» ─────────────────────────────────────────
  about: [
    'Создаю виртуальные пространства и воплощаю идеи, которые вы, возможно, ещё даже не успели себе представить. Клипы на любую тематику, рекламные ролики, логотипы, встроенные в 3D-локации, атмосферные игровые сцены — от первого наброска до финального кадра.',
    'Моделирую и собираю сцены в <strong>Blender</strong>, <strong>Cinema 4D</strong> и <strong>Unreal Engine 5</strong>, продумываю визуал в <strong>Figma</strong>. Пост-продакшн — в <em>After Effects</em> и <em>DaVinci Resolve</em>: композитинг, моушен, монтаж и цветокоррекция.',
  ],
  facts: [
    { label: 'Специализация', value: '3D · Motion · Visual' },
    { label: 'Опыт', value: '4+ года' },
    { label: 'Проектов', value: '40+' },
    { label: 'Формат', value: 'Удалённо / фриланс' },
  ],
  tools: [
    'Blender',
    'Cinema 4D',
    'Unreal Engine 5',
    'After Effects',
    'DaVinci Resolve',
    'Premiere Pro',
    'Substance Painter',
    'Photoshop',
    'Figma',
  ],
  // техническая база — отдельной строкой под инструментами
  skills: ['UV-развёртка', 'Текстуры', 'Масштаб', 'Pivot', 'Collision', 'Материалы'],

  // ── Работы ─────────────────────────────────────────────────
  // type — для фильтра над сеткой (одинаковые значения объединяются в одну кнопку),
  // cover — превью (16:10 или 3:2), gallery — кадры в карточке (картинки или .mp4),
  // video — ссылка на YouTube/Vimeo или mp4 (можно оставить пустым)
  projects: [
    {
      id: 'ward-13',
      title: 'Палата 13',
      type: 'Игры',
      category: 'Хоррор-игра · Level design',
      year: '2026',
      tools: ['Unreal Engine 5', 'Blender'],
      cover: '/img/works/w1.jpg',
      gallery: ['/img/works/w1.jpg', '/img/works/w4.jpg'],
      video: '',
      role: 'Левел-дизайн, свет, сборка сцены',
      description:
        'ЗАГЛУШКА. Заброшенная больница, в которой коридоры меняются, стоит отвернуться. Дизайн уровня, расстановка света и скриптовые события в UE5.',
      link: '',
    },
    {
      id: 'static',
      title: 'Помехи',
      type: 'Key art',
      category: 'Key art · Превью',
      year: '2026',
      tools: ['Blender', 'Photoshop'],
      cover: '/img/works/w2.jpg',
      gallery: ['/img/works/w2.jpg', '/img/works/w5.jpg'],
      video: '',
      role: 'Key art, превью, афиша',
      description:
        'ЗАГЛУШКА. Серия превью для квест-комнаты по мотивам 90-х: телевизор, который включается сам, и кукла, которая всегда смотрит на дверь.',
      link: '',
    },
    {
      id: 'chapel',
      title: 'Часовня',
      type: '3D-окружение',
      category: 'Окружение · UE5',
      year: '2025',
      tools: ['Unreal Engine 5', 'Substance Painter'],
      cover: '/img/works/w3.jpg',
      gallery: ['/img/works/w3.jpg', '/img/works/w6.jpg'],
      video: '',
      role: 'Окружение, атмосфера, кинематик',
      description:
        'ЗАГЛУШКА. Ночной березовый лес и часовня с одним горящим окном. Туман, свет и тишина — сцена, собранная целиком в движке.',
      link: '',
    },
    {
      id: 'last-train',
      title: 'Последний поезд',
      type: 'Моушен и клипы',
      category: 'Трейлер · Монтаж',
      year: '2025',
      tools: ['Unreal Engine 5', 'After Effects', 'DaVinci Resolve'],
      cover: '/img/works/w4.jpg',
      gallery: ['/img/works/w4.jpg', '/img/works/w1.jpg'],
      video: '',
      role: 'Кинематик, монтаж, цвет',
      description:
        'ЗАГЛУШКА. Тизер-трейлер игры о метро, в котором поезд приходит только один раз. Съёмка в UE5, монтаж, цветокоррекция и саунд-дизайн.',
      link: '',
    },
    {
      id: 'she',
      title: 'Она',
      type: '3D-окружение',
      category: 'Персонаж · Blender',
      year: '2025',
      tools: ['Blender', 'Substance Painter'],
      cover: '/img/works/w5.jpg',
      gallery: ['/img/works/w5.jpg', '/img/works/w2.jpg'],
      video: '',
      role: 'Концепт и 3D персонажа',
      description:
        'ЗАГЛУШКА. Дизайн и рендер персонажа для инди-игры. Моделинг, текстуры, свет и постер.',
      link: '',
    },
    {
      id: 'camp',
      title: 'Лагерь «Звёздочка»',
      type: 'Моушен и клипы',
      category: 'Афиша и моушен-тизер',
      year: '2024',
      tools: ['Blender', 'After Effects'],
      cover: '/img/works/w6.jpg',
      gallery: ['/img/works/w6.jpg', '/img/works/w3.jpg'],
      video: '',
      role: 'Арт-дирекшн, афиша, моушен-тизер',
      description:
        'ЗАГЛУШКА. Визуал для квеста о пионерском лагере, который закрыли в одну ночь. Афиша и анимированный тизер для соцсетей.',
      link: '',
    },
  ],

  // ── Направления ────────────────────────────────────────────
  services: [
    {
      title: '3D-локации',
      subtitle: 'Blender · Cinema 4D · UE5',
      text: 'Виртуальные пространства любой тематики — от интерьера до фантастического мира. Моделинг, материалы, свет и сборка сцены, которая корректно работает в движке.',
      list: ['Окружение и интерьеры', 'Уровни и локации в UE5', 'Свет и атмосфера', 'UV, текстуры, pivot, collision'],
    },
    {
      title: 'Клипы и моушен',
      subtitle: 'After Effects · DaVinci Resolve',
      text: 'Музыкальные клипы, рекламные ролики, тизеры и рилсы на любую тематику. Моушен-графика, монтаж, цветокоррекция и пост-продакшн под все площадки.',
      list: ['Клипы и промо-ролики', 'Моушен-графика', 'Монтаж и цветокоррекция', 'Рилсы и шортсы'],
    },
    {
      title: '3D-интеграции',
      subtitle: 'Логотипы · Продукты · Key art',
      text: 'Встраиваю логотипы, продукты и бренды в 3D-локации так, будто они всегда там были. Key art, обложки и превью, которые останавливают скролл.',
      list: ['Логотип в 3D-сцене', 'Продуктовый 3D', 'Key art и обложки', 'Превью для игр и соцсетей'],
    },
    {
      title: 'Визуальный сторителлинг',
      subtitle: 'От идеи до финального кадра',
      text: 'Придумываю историю и собираю её в кадре: раскадровка, камера, свет, ритм монтажа. Атмосферные сцены для игр, квестов и кино — включая хоррор.',
      list: ['Концепт и раскадровка', 'Кинематики в UE5', 'Игровые и хоррор-сцены', 'Арт-дирекшн'],
    },
  ],

  // ── Шоурил ─────────────────────────────────────────────────
  reel: {
    poster: '/img/works/w4.jpg',
    // ЗАГЛУШКА — вставь ссылку на YouTube (обычную) или путь к mp4 (/video/reel.mp4)
    url: '',
    duration: '01:30',
  },

  // ── Как я работаю ──────────────────────────────────────────
  process: [
    { title: 'Бриф', text: 'Разбираем идею, задачи, аудиторию и формат: клип, ролик, локация или интеграция.' },
    { title: 'Концепт', text: 'Мудборд, референсы, раскадровка и черновые кадры. Находим визуальный язык проекта.' },
    { title: 'Сборка', text: 'Уровни в UE5, модели и рендеры в Blender и Cinema 4D. Показываю промежуточные результаты.' },
    { title: 'Финал', text: 'Анимация, монтаж, цвет и звук в After Effects и DaVinci Resolve. Экспорт под все площадки.' },
  ],
}
