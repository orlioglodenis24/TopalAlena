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
  // video — ссылка на YouTube/Vimeo или mp4 (можно оставить пустым),
  // model — 3D-модель .glb из /public/models (крутится в шапке карточки)
  projects: [
    {
      id: 'harry-potter',
      title: 'Harry Potter',
      type: 'Моушен и клипы',
      category: 'Fan Art · 3D Animation',
      year: '2026',
      tools: ['Blender', 'Cinema 4D', 'After Effects'],
      cover: '/img/works/hp-cover.jpg',
      gallery: [
        '/img/works/hp-1.jpg',
        '/img/works/hp-2.jpg',
        '/img/works/hp-3.jpg',
        '/img/works/hp-4.jpg',
      ],
      video: '/video/harry-potter.mp4',
      role: 'Концепт, моделинг, анимация, пост-продакшн',
      description:
        'Фан-арт анимация по вселенной Гарри Поттера — Азкабанский монолит. Раскадровка, 3D-моделинг локации, анимация и финальный рендер с полноценным пост-продакшном.',
      link: '',
    },
    {
      id: 'little-prince',
      title: 'Маленький принц',
      type: 'Моушен и клипы',
      category: 'Fan Art · 3D Animation · Color',
      year: '2026',
      tools: ['Blender', 'Cinema 4D', 'DaVinci Resolve'],
      cover: '/img/works/tlp-cover.jpg',
      gallery: [
        '/img/works/tlp-1.jpg',
        '/img/works/tlp-2.jpg',
        '/img/works/tlp-3.jpg',
        '/img/works/tlp-4.jpg',
        '/img/works/tlp-5.jpg',
      ],
      video: '/video/little-prince.mp4',
      role: 'Моделинг, анимация, цветокоррекция',
      description:
        'Анимация по мотивам «Маленького принца» — покадровая работа с цветом, моделинг сцены и финальная цветокоррекция в DaVinci Resolve.',
      link: '',
    },
    {
      id: 'environment',
      title: '3D-окружение',
      type: '3D-окружение',
      category: 'Environment · 3D Render',
      year: '2026',
      tools: ['Blender', 'Cinema 4D'],
      cover: '/img/works/env-cover.jpg',
      gallery: [
        '/img/works/env-1.jpg',
        '/img/works/env-2.jpg',
        '/img/works/env-3.jpg',
        '/img/works/env-4.jpg',
        '/img/works/env-5.jpg',
        '/img/works/env-6.jpg',
      ],
      video: '/video/environment.mp4',
      role: 'Моделинг, текстуры, свет, рендер',
      description:
        'Детальная 3D-локация — от концепта и моделинга до финального рендера. Работа с материалами, освещением и атмосферой сцены.',
      link: '',
    },
    {
      id: 'mechanism',
      title: 'Механизм',
      type: '3D-моделинг',
      category: 'Hard Surface · Анимация',
      year: '2026',
      tools: ['Blender', 'Cinema 4D'],
      cover: '/img/works/mech-cover.jpg',
      gallery: [
        '/img/works/mech-1.jpg',
        '/img/works/mech-2.jpg',
        '/img/works/mech-3.jpg',
        '/img/works/mech-4.jpg',
        '/img/works/mech-5.jpg',
      ],
      video: '/video/mechanism.mp4',
      role: 'Hard surface моделинг, анимация механики',
      description:
        'Hard surface моделинг сложного механизма с анимацией движущихся частей. Детальная проработка каждого элемента, материалы, рендер.',
      link: '',
    },
    {
      id: 'horror-quest',
      title: 'Horror Quest',
      type: 'VFX · Клипы',
      category: 'VFX Cinematic · Horror',
      year: '2026',
      tools: ['After Effects', 'DaVinci Resolve', 'Blender'],
      cover: '/img/works/horror-cover.jpg',
      gallery: ['/img/works/horror-cover.jpg'],
      video: '/video/horror-quest.mp4',
      role: 'VFX, монтаж, цветокоррекция, звук',
      description:
        'VFX-синематик для хоррор-квеста: атмосферная постановка, визуальные эффекты, монтаж и цветокоррекция в жанре хоррор.',
      link: '',
    },
    {
      id: 'product-3d',
      title: 'Продуктовый 3D',
      type: '3D-интеграции',
      category: 'Product 3D · Key art',
      year: '2026',
      tools: ['Blender', 'Cinema 4D', 'Photoshop'],
      cover: '/img/works/prod-cover.jpg',
      gallery: [
        '/img/works/prod-1.jpg',
        '/img/works/prod-2.jpg',
        '/img/works/prod-3.jpg',
        '/img/works/prod-4.jpg',
      ],
      video: '',
      role: 'Концепт, моделинг, лукдев, рендер',
      description:
        'Серия продуктовых 3D-проектов: парфюм Valentino Voce Viva, крем Esthederm и бутылка Drink China. Концепт-скетчи, моделинг и визуальный стиль каждого продукта.',
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
    poster: '/img/works/reel-poster.jpg',
    url: '/video/horror-quest.mp4',
    duration: '00:44',
  },

  // ── Как я работаю ──────────────────────────────────────────
  process: [
    { title: 'Бриф', text: 'Разбираем идею, задачи, аудиторию и формат: клип, ролик, локация или интеграция.' },
    { title: 'Концепт', text: 'Мудборд, референсы, раскадровка и черновые кадры. Находим визуальный язык проекта.' },
    { title: 'Сборка', text: 'Уровни в UE5, модели и рендеры в Blender и Cinema 4D. Показываю промежуточные результаты.' },
    { title: 'Финал', text: 'Анимация, монтаж, цвет и звук в After Effects и DaVinci Resolve. Экспорт под все площадки.' },
  ],
}
