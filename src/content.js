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
      id: 'goetia',
      title: 'GOETIA — The Birth of a Monster',
      type: 'Creature Design',
      category: 'Creature Design · 3D Sculpt · Animation',
      year: '2026',
      tools: ['Cinema 4D', 'Unreal Engine 5', 'Blender', 'DaVinci Resolve', 'Figma'],
      cover: '/img/works/goetia/cover.jpg',
      gallery: [
        '/img/works/goetia/poster.jpg',
        '/img/works/goetia/concept.webp',
        '/img/works/goetia/shot-01.webp',
        '/img/works/goetia/shot-02.webp',
        '/img/works/goetia/shot-03.webp',
        '/img/works/goetia/shot-04.webp',
        '/img/works/goetia/shot-05.webp',
        '/img/works/goetia/shot-06.webp',
        '/img/works/goetia/shot-07.webp',
        '/img/works/goetia/shot-08.webp',
        '/img/works/goetia/shot-09.webp',
        '/video/goetia-process-1.mp4',
        '/video/goetia-process-2.mp4',
        '/video/goetia-process-3.mp4',
      ],
      video: '/video/goetia.mp4',
      role: 'Creature design, 3D sculpt, animation, concept & art direction',
      description:
        'GOETIA is a personal project centered on the creation of a fantastical creature. At its heart is a monster whose emergence unfolds on screen, from its first vague outlines to its complete form.\n\nThe video turns the creative process into a story of birth. The creature seems to emerge from the darkness: its shape takes form, its features become more distinct, and its presence grows increasingly vivid. The viewer witnesses not only the finished character, but the moment it first comes into being.\n\nThe monochrome palette, digital glitches, and fragmented imagery create an eerie, otherworldly atmosphere. The cover resembles a classified file on an unknown being, as though its existence has been documented and is now under investigation.\n\nGOETIA is an exploration of form and atmosphere, as well as a short visual story about the birth of a creature.',
      link: '',
    },
    {
      id: 'little-prince',
      title: 'The Little Prince — Night on the Planet',
      type: '3D-анимация',
      category: 'Fan Art · 3D Animation · Storytelling',
      year: '2026',
      tools: ['Cinema 4D', 'Unreal Engine 5', 'Blender', 'DaVinci Resolve', 'Figma'],
      cover: '/img/works/the-little-prince/cover.jpg',
      gallery: [
        '/img/works/the-little-prince/concept-1.webp',
        '/img/works/the-little-prince/concept-2.webp',
        '/img/works/the-little-prince/concept-3.webp',
        '/img/works/the-little-prince/shot-01.webp',
        '/img/works/the-little-prince/shot-04.webp',
        '/img/works/the-little-prince/shot-08.webp',
        '/img/works/the-little-prince/shot-09.webp',
        '/video/tlp-process-1.mp4',
        '/video/tlp-process-2.mp4',
        '/video/tlp-process-3.mp4',
        '/img/works/the-little-prince/process-board.webp',
        '/img/works/the-little-prince/credits.webp',
      ],
      video: '/video/little-prince.mp4',
      role: 'Concept & storyboard, 3D modeling, lighting, camera & render',
      description:
        'A personal visual interpretation of The Little Prince: a quiet night on his tiny planet. The camera starts close to the character, pulls away to show how small his world is, and returns to him. Everything in this project was created by me: the character, planet, rose, grass, sky, lighting and camera animation. Modeled in Cinema 4D, assembled, lit and rendered in Unreal Engine. The camera path was planned in a 10-shot hand-drawn storyboard.',
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
