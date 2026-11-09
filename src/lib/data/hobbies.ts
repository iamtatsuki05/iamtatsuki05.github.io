import type { BlogPost } from '@/lib/content/blog';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/routing';
import { normalizeSearchText, tokenizeSearchQuery } from '@/lib/search/queryTokens';

type LocalizedText = Record<Locale, string>;

export type HobbyTone = 'amber' | 'blue' | 'lilac' | 'teal';

export type HobbyBlogFilter = {
  q?: string;
  tags?: string[];
};

type HobbyDefinition = {
  id: string;
  emoji: string;
  tone: HobbyTone;
  title: LocalizedText;
  currentFocus: LocalizedText;
  thumbnailSrc: string;
  thumbnailAlt: LocalizedText;
  blogFilter: HobbyBlogFilter;
};

export type HobbyItem = {
  id: string;
  emoji: string;
  tone: HobbyTone;
  title: string;
  currentFocus: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  blogFilter: HobbyBlogFilter;
  href: string;
  relatedCount: number;
};

const HOBBIES: readonly HobbyDefinition[] = [
  {
    id: 'gadgets',
    emoji: '⌚',
    tone: 'amber',
    title: { ja: 'ガジェット', en: 'Gadgets', zh: '数码产品', fr: 'Gadgets' },
    currentFocus: {
      ja: 'PCやキーボード、スイッチャーなど、いろいろなガジェットに興味があり、気になるとつい買ってしまいます。',
      en: 'I am interested in all kinds of gadgets, such as PCs, keyboards, and switchers, and when something catches my eye, I tend to buy it.',
      zh: '我对各种数码产品都很感兴趣，从电脑、键盘到切换器都有关注，看到喜欢的东西常常会忍不住买下来。',
      fr: 'Je m’intéresse à toutes sortes de gadgets, comme les PC, les claviers ou les switchers, et quand quelque chose attire mon attention, je finis souvent par l’acheter.',
    },
    thumbnailSrc: '/images/hobbies/nextImageExportOptimizer/gadgets-opt-1200.WEBP',
    thumbnailAlt: { ja: 'ガジェットのサムネイル', en: 'Gadgets thumbnail', zh: '数码产品缩略图', fr: 'Miniature de gadgets' },
    blogFilter: { tags: ['gadgets'] },
  },
  {
    id: 'camera',
    emoji: '📷',
    tone: 'blue',
    title: { ja: 'カメラ', en: 'Camera', zh: '相机', fr: 'Photo' },
    currentFocus: {
      ja: 'Leicaで撮られたようなスナップや人物写真が好きで、シネマティックな表現にも惹かれます。映像作品にも興味があり、いつか映画を作ってみたいと思っています。',
      en: 'I like snapshots and portraits that look as if they were shot on a Leica, and I am also drawn to cinematic styles. I am interested in films and video work too, and I hope to make a film someday.',
      zh: '我喜欢像用 Leica 拍出来的街拍和人像，也很喜欢有电影感的画面。我对影像作品也很感兴趣，希望有一天能拍一部电影。',
      fr: 'J’aime les instantanés et les portraits qui semblent pris au Leica, et je suis aussi attiré par les images au rendu cinématographique. Les œuvres visuelles m’intéressent également, et j’aimerais réaliser un film un jour.',
    },
    thumbnailSrc: '/images/hobbies/nextImageExportOptimizer/camera-opt-1200.WEBP',
    thumbnailAlt: { ja: 'カメラのサムネイル', en: 'Camera thumbnail', zh: '相机缩略图', fr: 'Miniature photo' },
    blogFilter: { tags: ['camera'] },
  },
  {
    id: 'bowling',
    emoji: '🎳',
    tone: 'teal',
    title: { ja: 'ボウリング', en: 'Bowling', zh: '保龄球', fr: 'Bowling' },
    currentFocus: {
      ja: '大学の授業後に友人とよく行くうちにハマり、気づけばマイボールまで揃えていました。',
      en: 'I started going with friends after classes at university, got hooked before I knew it, and eventually ended up buying my own ball.',
      zh: '我开始在大学下课后和朋友一起去打保龄球，不知不觉就迷上了，最后还买了自己的球。',
      fr: 'J’ai commencé à y aller avec des amis après les cours à l’université, puis je me suis pris au jeu au point d’acheter ma propre boule.',
    },
    thumbnailSrc: '/images/hobbies/bowling.svg',
    thumbnailAlt: { ja: 'ボウリングのサムネイル', en: 'Bowling thumbnail', zh: '保龄球缩略图', fr: 'Miniature bowling' },
    blogFilter: { tags: ['bowling'] },
  },
  {
    id: 'cute-characters',
    emoji: '🧸',
    tone: 'lilac',
    title: { ja: 'かわいいキャラクター', en: 'Cute Characters', zh: '可爱的角色', fr: 'Personnages mignons' },
    currentFocus: {
      ja: 'ハチワレ、あらいぐまラスカル、ガチャピン、ドラえもんなどのキャラクターが特に好きです。色や形、小さなディテールに安心感のあるキャラクターに惹かれます。',
      en: 'I especially like characters such as Hachiware, Rascal the Raccoon, Gachapin, and Doraemon. I am drawn to characters whose colors, shapes, and small details feel comforting.',
      zh: '我特别喜欢小八、浣熊拉斯卡尔、Gachapin、哆啦 A 梦等角色。颜色、造型和小细节让人安心的角色很吸引我。',
      fr: 'J’aime particulièrement Hachiware, Rascal, Gachapin et Doraemon. Je suis attiré par les personnages dont les couleurs, les formes et les petits détails ont quelque chose de rassurant.',
    },
    thumbnailSrc: '/images/hobbies/nextImageExportOptimizer/cute-characters-opt-1200.WEBP',
    thumbnailAlt: { ja: 'かわいいキャラクターのサムネイル', en: 'Cute characters thumbnail', zh: '可爱角色缩略图', fr: 'Miniature de personnages mignons' },
    blogFilter: { tags: ['cute-character'] },
  },
  {
    id: 'nlp',
    emoji: '🧠',
    tone: 'blue',
    title: { ja: 'NLP', en: 'NLP', zh: 'NLP', fr: 'NLP' },
    currentFocus: {
      ja: '海外で翻訳アプリを使ったときに、こうした技術で人の生活を豊かにしたいと思ったことがきっかけで、自然言語処理に興味を持ちました。最近は言語モデルの解析に特に興味があります。',
      en: 'Using a translation app abroad made me want to improve people’s lives with this kind of technology, and that is how I became interested in NLP. Lately, I have been especially interested in analyzing language models.',
      zh: '在海外使用翻译应用时，我开始想用这类技术改善人们的生活，这也让我对自然语言处理产生了兴趣。最近我尤其关注语言模型的分析。',
      fr: 'En utilisant une application de traduction à l’étranger, j’ai eu envie d’améliorer la vie des gens grâce à ce genre de technologie, et c’est ainsi que je me suis intéressé au NLP. En ce moment, l’analyse des modèles de langue m’intéresse particulièrement.',
    },
    thumbnailSrc: '/images/hobbies/huggingface-logo.svg',
    thumbnailAlt: { ja: 'Hugging Face ロゴ', en: 'Hugging Face logo', zh: 'Hugging Face 标志', fr: 'Logo Hugging Face' },
    blogFilter: { q: 'LLM' },
  },
  {
    id: 'chai',
    emoji: '☕',
    tone: 'teal',
    title: { ja: 'チャイ', en: 'Chai', zh: '印度奶茶', fr: 'Chai' },
    currentFocus: {
      ja: '最初はインスタントから始めましたが、今は茶葉やスパイスにもこだわり、鍋で煮出すスタイルで楽しんでいます。',
      en: 'I started with instant chai, but now I enjoy making it in a pot with more attention to the tea leaves and spices.',
      zh: '一开始我喝的是速溶奶茶，现在会更讲究茶叶和香料，并喜欢用锅煮出来。',
      fr: 'J’ai commencé avec du chai instantané, mais aujourd’hui j’aime le préparer à la casserole, en choisissant avec soin le thé et les épices.',
    },
    thumbnailSrc: '/images/hobbies/chai.svg',
    thumbnailAlt: { ja: 'チャイのサムネイル', en: 'Chai thumbnail', zh: '印度奶茶缩略图', fr: 'Miniature chai' },
    blogFilter: { tags: ['chai'] },
  },
  {
    id: 'piano',
    emoji: '🎹',
    tone: 'amber',
    title: { ja: 'ピアノ', en: 'Piano', zh: '钢琴', fr: 'Piano' },
    currentFocus: {
      ja: '左右の手で別々の動きをするトレーニングと、教養として音楽を身につけることを目的に始めましたが、思った以上にハマっています。',
      en: 'I started piano to train my hands to move independently and to build some musical literacy, but I ended up enjoying it much more than I expected.',
      zh: '我开始学钢琴，是想练习左右手做不同的动作，也想培养一些音乐素养，结果比想象中更让我着迷。',
      fr: 'J’ai commencé le piano pour apprendre à mes deux mains à bouger indépendamment et pour acquérir une culture musicale, mais j’y ai pris beaucoup plus de plaisir que prévu.',
    },
    thumbnailSrc: '/images/hobbies/piano.svg',
    thumbnailAlt: { ja: 'ピアノのサムネイル', en: 'Piano thumbnail', zh: '钢琴缩略图', fr: 'Miniature piano' },
    blogFilter: { tags: ['piano'] },
  },
  {
    id: 'visual-works',
    emoji: '🎬',
    tone: 'blue',
    title: { ja: '映像作品', en: 'Visual Works', zh: '影像作品', fr: 'Œuvres visuelles' },
    currentFocus: {
      ja: 'カラーグレーディングや構図、演出に強く興味があります。Netflixも観ますが、映画館でも月に2本ほど観ることが多いです。いつか映画を作ってみたいと思っています。',
      en: 'I am strongly interested in color grading, composition, and direction. I watch Netflix too, but I also go to the cinema around twice a month, and I would like to make a film someday.',
      zh: '我对调色、构图和导演手法很感兴趣。虽然也看 Netflix，但每个月大约也会去电影院看两部电影，希望有一天能自己拍电影。',
      fr: 'Je m’intéresse beaucoup à l’étalonnage, à la composition et à la mise en scène. Je regarde aussi Netflix, mais je vais souvent au cinéma, environ deux fois par mois, et j’aimerais réaliser un film un jour.',
    },
    thumbnailSrc: '/images/hobbies/visual-works.svg',
    thumbnailAlt: { ja: '映像作品のサムネイル', en: 'Visual works thumbnail', zh: '影像作品缩略图', fr: 'Miniature œuvres visuelles' },
    blogFilter: { tags: ['visual-works'] },
  },
  {
    id: 'legal-cases',
    emoji: '⚖️',
    tone: 'teal',
    title: { ja: '法律の判例', en: 'Legal Cases', zh: '法律判例', fr: 'Jurisprudence' },
    currentFocus: {
      ja: '民事の判例に興味があり、判決に至るまでの過程や背景を理解するのが好きです。特に、法律をそのように解釈するのかという点に惹かれます。',
      en: 'I am interested in civil case law, and I like understanding the process and background that led to a particular judgment. I am especially drawn to how the law is interpreted in each case.',
      zh: '我对民事判例感兴趣，也喜欢了解判决背后的过程和背景。尤其吸引我的是法律在每个案件中是如何解释的。',
      fr: 'Je m’intéresse à la jurisprudence civile et j’aime comprendre le processus et le contexte qui mènent à une décision. Ce qui m’attire surtout, c’est la manière dont le droit est interprété dans chaque affaire.',
    },
    thumbnailSrc: '/images/hobbies/legal-cases.svg',
    thumbnailAlt: { ja: '法律の判例のサムネイル', en: 'Legal cases thumbnail', zh: '法律判例缩略图', fr: 'Miniature jurisprudence' },
    blogFilter: { tags: ['legal-case'] },
  },
  {
    id: 'tomoo',
    emoji: '🎧',
    tone: 'lilac',
    title: { ja: 'TOMOO', en: 'TOMOO', zh: 'TOMOO', fr: 'TOMOO' },
    currentFocus: {
      ja: 'YouTubeのおすすめで「Cinderella」が流れてきたとき、人生で初めてと言っていいほど感動しました。特に、イントロの引き込み方や曲全体の緩急、歌詞の表現に惹かれました。MVの映像表現もとても好きで、世界観に引き込まれたことをきっかけにライブにも行くようになりました。',
      en: 'When “Cinderella” came up in my YouTube recommendations, it moved me in a way I had never really experienced before. I was especially drawn to the way the intro pulls you in, the pacing across the song, and how the lyrics are written. I also love the visual language of the music videos, and being pulled into that world is what led me to start going to live shows.',
      zh: '当 YouTube 推荐里出现《Cinderella》时，我几乎可以说是人生第一次被那样打动。尤其是前奏的吸引力、整首歌的节奏起伏和歌词表达让我着迷。我也很喜欢 MV 的视觉表现，被其中的世界观吸引后，还开始去听现场演出。',
      fr: 'Quand « Cinderella » est apparu dans mes recommandations YouTube, j’ai été touché comme rarement auparavant. J’ai été attiré par l’intro, le rythme de la chanson et l’écriture des paroles. J’aime aussi beaucoup l’univers visuel des clips, et c’est ce monde qui m’a donné envie d’aller aux concerts.',
    },
    thumbnailSrc: '/images/hobbies/nextImageExportOptimizer/tomoo-opt-1200.WEBP',
    thumbnailAlt: { ja: 'TOMOO のサムネイル', en: 'TOMOO thumbnail', zh: 'TOMOO 缩略图', fr: 'Miniature TOMOO' },
    blogFilter: { tags: ['tomoo'] },
  },
] as const;

const HOBBY_DISPLAY_ORDER = [
  'nlp',
  'gadgets',
  'camera',
  'visual-works',
  'tomoo',
  'cute-characters',
  'piano',
  'chai',
  'bowling',
  'legal-cases',
] as const;

const HOBBY_DISPLAY_ORDER_INDEX = new Map<string, number>(
  HOBBY_DISPLAY_ORDER.map((id, index) => [id, index]),
);

export function buildBlogsFilterPath(locale: Locale, filter: HobbyBlogFilter): string {
  const params = new URLSearchParams();
  const q = filter.q?.trim();
  const tags = filter.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [];

  if (q) params.set('q', q);
  if (tags.length > 0) params.set('tags', tags.join(','));

  const basePath = localizedPath('/blogs/', locale);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function resolveHobbies(locale: Locale, posts: readonly BlogPost[] = []): HobbyItem[] {
  return HOBBIES.map((hobby) => ({
    id: hobby.id,
    emoji: hobby.emoji,
    tone: hobby.tone,
    title: hobby.title[locale],
    currentFocus: hobby.currentFocus[locale],
    thumbnailSrc: hobby.thumbnailSrc,
    thumbnailAlt: hobby.thumbnailAlt[locale],
    blogFilter: hobby.blogFilter,
    href: buildBlogsFilterPath(locale, hobby.blogFilter),
    relatedCount: posts.filter((post) => matchesBlogFilter(post, hobby.blogFilter)).length,
  })).sort((left, right) => {
    const leftIndex = HOBBY_DISPLAY_ORDER_INDEX.get(left.id) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = HOBBY_DISPLAY_ORDER_INDEX.get(right.id) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

function matchesBlogFilter(post: BlogPost, filter: HobbyBlogFilter): boolean {
  const query = filter.q?.trim();
  const tags = filter.tags?.map((tag) => normalizeSearchText(tag)).filter(Boolean) ?? [];

  if (query) {
    const haystack = normalizeSearchText([post.title, post.summary, ...(post.tags || [])].join(' '));
    const tokens = tokenizeSearchQuery(query);
    if (!tokens.every((token) => haystack.includes(token))) return false;
  }

  if (tags.length > 0) {
    const postTags = new Set((post.tags || []).map((tag) => normalizeSearchText(tag)));
    if (!tags.some((tag) => postTags.has(tag))) return false;
  }

  return true;
}
