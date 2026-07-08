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
      en: 'I am interested in all kinds of gadgets, from PCs and keyboards to switchers, and if something catches my eye, I tend to buy it.',
      zh: '我对各种数码产品都很感兴趣，从电脑、键盘到切换器都有关注，看到喜欢的东西常常会忍不住买下来。',
      fr: 'Je m interesse a toutes sortes de gadgets, des PC et claviers aux switchers, et quand quelque chose attire mon attention, je finis souvent par l acheter.',
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
      ja: 'Leicaで撮られたようなスナップや人物写真が好きで、それ以外ではシネマティックな表現にも惹かれます。映像作品にも興味があり、いつか映画を作ってみたいと思っています。',
      en: 'I like snapshots and portraits in the kind of style often associated with Leica, and I am also drawn to cinematic expression more broadly. I am interested in visual storytelling as a whole and hope to make a film someday.',
      zh: '我喜欢带有 Leica 氛围的街拍和人像，也被更广义的电影感表达所吸引。我对影像叙事整体都很感兴趣，希望有一天能拍一部电影。',
      fr: 'J aime les instantanes et portraits dans un style souvent associe a Leica, et je suis aussi attire par une expression plus cinematographique. Le recit visuel m interesse au sens large, et j aimerais realiser un film un jour.',
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
      fr: 'J ai commence a y aller avec des amis apres les cours a l universite, puis je me suis pris au jeu au point d acheter ma propre boule.',
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
      fr: 'J aime particulierement Hachiware, Rascal, Gachapin et Doraemon. Je suis attire par les personnages dont les couleurs, formes et petits details ont quelque chose de rassurant.',
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
      en: 'Using a translation app while abroad made me want to build technology that could genuinely improve people’s lives, and that experience sparked my interest in NLP. Recently, I have been especially interested in analyzing language models.',
      zh: '在海外使用翻译应用时，我开始想用这类技术真正改善人们的生活，这也让我对自然语言处理产生了兴趣。最近我尤其关注语言模型的分析。',
      fr: 'L utilisation d une application de traduction a l etranger m a donne envie de creer des technologies qui ameliorent vraiment la vie des gens, ce qui a declenche mon interet pour le NLP. En ce moment, l analyse des modeles de langue m interesse particulierement.',
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
      fr: 'J ai commence avec du chai instantane, mais aujourd hui j aime le preparer a la casserole en choisissant davantage le the et les epices.',
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
      ja: '左右で別の動きをすることのトレーニングや、教養として音楽を身につけたいと思って始めましたが、思った以上にハマっています。',
      en: 'I started piano as a way to train my coordination and to build some musical literacy, but I ended up enjoying it much more than I expected.',
      zh: '我开始学钢琴，是想训练左右手不同动作的协调性，也想把音乐作为一种素养学起来，但实际比想象中更让我着迷。',
      fr: 'J ai commence le piano pour travailler ma coordination et acquerir une culture musicale, mais j y ai pris beaucoup plus de plaisir que prevu.',
    },
    thumbnailSrc: '/images/hobbies/piano.svg',
    thumbnailAlt: { ja: 'ピアノのサムネイル', en: 'Piano thumbnail', zh: '钢琴缩略图', fr: 'Miniature piano' },
    blogFilter: { tags: ['piano'] },
  },
  {
    id: 'visual-works',
    emoji: '🎬',
    tone: 'blue',
    title: { ja: '映像作品', en: 'Visual Works', zh: '影像作品', fr: 'Oeuvres visuelles' },
    currentFocus: {
      ja: 'カラーグレーディングや構図、演出に強く興味があります。Netflixも観ますが、映画館にも月に2本ほど行くことが多いです。いつか映画を作ってみたいと思っています。',
      en: 'I am strongly interested in color grading, composition, and direction. I watch Netflix too, but I also go to the cinema around twice a month, and I would like to make a film someday.',
      zh: '我对调色、构图和演出很感兴趣。虽然也看 Netflix，但每个月大约也会去电影院看两部电影，希望有一天能自己拍电影。',
      fr: 'Je m interesse beaucoup a l etalonnage, a la composition et a la mise en scene. Je regarde aussi Netflix, mais je vais souvent au cinema environ deux fois par mois, et j aimerais realiser un film un jour.',
    },
    thumbnailSrc: '/images/hobbies/visual-works.svg',
    thumbnailAlt: { ja: '映像作品のサムネイル', en: 'Visual works thumbnail', zh: '影像作品缩略图', fr: 'Miniature oeuvres visuelles' },
    blogFilter: { tags: ['visual-works'] },
  },
  {
    id: 'legal-cases',
    emoji: '⚖️',
    tone: 'teal',
    title: { ja: '法律の判例', en: 'Legal Cases', zh: '法律判例', fr: 'Jurisprudence' },
    currentFocus: {
      ja: '民事の判例に興味があり、その判例に至るまでの過程や背景を理解するのが好きです。特に、法律をそのように解釈するのかという点に惹かれます。',
      en: 'I am interested in civil case law, and I like understanding the process and background that led to a particular judgment. I am especially drawn to how the law is interpreted in each case.',
      zh: '我对民事判例感兴趣，也喜欢理解判决形成之前的过程和背景。尤其吸引我的是法律在每个案件中如何被解释。',
      fr: 'Je m interesse a la jurisprudence civile et j aime comprendre le processus et le contexte qui menent a une decision. Ce qui m attire surtout, c est la maniere dont le droit est interprete dans chaque cas.',
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
      en: 'When “Cinderella” came up in my YouTube recommendations, it moved me in a way I had never really experienced before. I was especially drawn to the way the intro pulls you in, the pacing across the song, and the lyrical expression. I also love the visual language of the music videos, and being pulled into that world is what led me to start going to live shows.',
      zh: '当 YouTube 推荐里出现《Cinderella》时，我几乎可以说是人生第一次被那样打动。尤其是前奏的吸引力、整首歌的节奏起伏和歌词表达让我着迷。我也很喜欢 MV 的视觉表现，被那个世界观吸引之后开始去现场演出。',
      fr: 'Quand "Cinderella" est apparu dans mes recommandations YouTube, j ai ete touche comme rarement auparavant. J ai ete attire par l intro, le rythme de la chanson et l expression des paroles. J aime aussi beaucoup l univers visuel des clips, et c est ce monde qui m a donne envie d aller aux concerts.',
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
