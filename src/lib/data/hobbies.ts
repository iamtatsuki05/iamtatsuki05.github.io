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
    title: { ja: 'ガジェット', en: 'Gadgets' },
    currentFocus: {
      ja: 'PCやキーボード、スイッチャーなど、いろいろなガジェットに興味があり、気になるとつい買ってしまいます。',
      en: 'I am interested in all kinds of gadgets, from PCs and keyboards to switchers, and if something catches my eye, I tend to buy it.',
    },
    thumbnailSrc: '/images/hobbies/gadgets.jpg',
    thumbnailAlt: { ja: 'ガジェットのサムネイル', en: 'Gadgets thumbnail' },
    blogFilter: { tags: ['gadgets'] },
  },
  {
    id: 'camera',
    emoji: '📷',
    tone: 'blue',
    title: { ja: 'カメラ', en: 'Camera' },
    currentFocus: {
      ja: 'Leicaで撮られたようなスナップや人物写真が好きで、それ以外ではシネマティックな表現にも惹かれます。映像作品にも興味があり、いつか映画を作ってみたいと思っています。',
      en: 'I like snapshots and portraits in the kind of style often associated with Leica, and I am also drawn to cinematic expression more broadly. I am interested in visual storytelling as a whole and hope to make a film someday.',
    },
    thumbnailSrc: '/images/hobbies/camera.jpg',
    thumbnailAlt: { ja: 'カメラのサムネイル', en: 'Camera thumbnail' },
    blogFilter: { tags: ['camera'] },
  },
  {
    id: 'bowling',
    emoji: '🎳',
    tone: 'teal',
    title: { ja: 'ボウリング', en: 'Bowling' },
    currentFocus: {
      ja: '大学の授業後に友人とよく行くうちにハマり、気づけばマイボールまで揃えていました。',
      en: 'I started going with friends after classes at university, got hooked before I knew it, and eventually ended up buying my own ball.',
    },
    thumbnailSrc: '/images/hobbies/bowling.svg',
    thumbnailAlt: { ja: 'ボウリングのサムネイル', en: 'Bowling thumbnail' },
    blogFilter: { tags: ['bowling'] },
  },
  {
    id: 'cute-characters',
    emoji: '🧸',
    tone: 'lilac',
    title: { ja: 'かわいいキャラクター', en: 'Cute Characters' },
    currentFocus: {
      ja: 'ハチワレ、あらいぐまラスカル、ガチャピン、ドラえもんなどのキャラクターが特に好きです。色や形、小さなディテールに安心感のあるキャラクターに惹かれます。',
      en: 'I especially like characters such as Hachiware, Rascal the Raccoon, Gachapin, and Doraemon. I am drawn to characters whose colors, shapes, and small details feel comforting.',
    },
    thumbnailSrc: '/images/hobbies/cute-characters.jpeg',
    thumbnailAlt: { ja: 'かわいいキャラクターのサムネイル', en: 'Cute characters thumbnail' },
    blogFilter: { tags: ['cute-character'] },
  },
  {
    id: 'nlp',
    emoji: '🧠',
    tone: 'blue',
    title: { ja: 'NLP', en: 'NLP' },
    currentFocus: {
      ja: '海外で翻訳アプリを使ったときに、こうした技術で人の生活を豊かにしたいと思ったことがきっかけで、自然言語処理に興味を持ちました。最近は言語モデルの解析に特に興味があります。',
      en: 'Using a translation app while abroad made me want to build technology that could genuinely improve people’s lives, and that experience sparked my interest in NLP. Recently, I have been especially interested in analyzing language models.',
    },
    thumbnailSrc: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    thumbnailAlt: { ja: 'Hugging Face ロゴ', en: 'Hugging Face logo' },
    blogFilter: { q: 'LLM' },
  },
  {
    id: 'chai',
    emoji: '☕',
    tone: 'teal',
    title: { ja: 'チャイ', en: 'Chai' },
    currentFocus: {
      ja: '最初はインスタントから始めましたが、今は茶葉やスパイスにもこだわり、鍋で煮出すスタイルで楽しんでいます。',
      en: 'I started with instant chai, but now I enjoy making it in a pot with more attention to the tea leaves and spices.',
    },
    thumbnailSrc: '/images/hobbies/chai.svg',
    thumbnailAlt: { ja: 'チャイのサムネイル', en: 'Chai thumbnail' },
    blogFilter: { tags: ['chai'] },
  },
  {
    id: 'piano',
    emoji: '🎹',
    tone: 'amber',
    title: { ja: 'ピアノ', en: 'Piano' },
    currentFocus: {
      ja: '左右で別の動きをすることのトレーニングや、教養として音楽を身につけたいと思って始めましたが、思った以上にハマっています。',
      en: 'I started piano as a way to train my coordination and to build some musical literacy, but I ended up enjoying it much more than I expected.',
    },
    thumbnailSrc: '/images/hobbies/piano.svg',
    thumbnailAlt: { ja: 'ピアノのサムネイル', en: 'Piano thumbnail' },
    blogFilter: { tags: ['piano'] },
  },
  {
    id: 'visual-works',
    emoji: '🎬',
    tone: 'blue',
    title: { ja: '映像作品', en: 'Visual Works' },
    currentFocus: {
      ja: 'カラーグレーディングや構図、演出に強く興味があります。Netflixも観ますが、映画館にも月に2本ほど行くことが多いです。いつか映画を作ってみたいと思っています。',
      en: 'I am strongly interested in color grading, composition, and direction. I watch Netflix too, but I also go to the cinema around twice a month, and I would like to make a film someday.',
    },
    thumbnailSrc: '/images/hobbies/visual-works.svg',
    thumbnailAlt: { ja: '映像作品のサムネイル', en: 'Visual works thumbnail' },
    blogFilter: { tags: ['visual-works'] },
  },
  {
    id: 'legal-cases',
    emoji: '⚖️',
    tone: 'teal',
    title: { ja: '法律の判例', en: 'Legal Cases' },
    currentFocus: {
      ja: '民事の判例に興味があり、その判例に至るまでの過程や背景を理解するのが好きです。特に、法律をそのように解釈するのかという点に惹かれます。',
      en: 'I am interested in civil case law, and I like understanding the process and background that led to a particular judgment. I am especially drawn to how the law is interpreted in each case.',
    },
    thumbnailSrc: '/images/hobbies/legal-cases.svg',
    thumbnailAlt: { ja: '法律の判例のサムネイル', en: 'Legal cases thumbnail' },
    blogFilter: { tags: ['legal-case'] },
  },
  {
    id: 'tomoo',
    emoji: '🎧',
    tone: 'lilac',
    title: { ja: 'TOMOO', en: 'TOMOO' },
    currentFocus: {
      ja: 'YouTubeのおすすめで「Cinderella」が流れてきたとき、人生で初めてと言っていいほど感動しました。特に、イントロの引き込み方や曲全体の緩急、歌詞の表現に惹かれました。MVの映像表現もとても好きで、世界観に引き込まれたことをきっかけにライブにも行くようになりました。',
      en: 'When “Cinderella” came up in my YouTube recommendations, it moved me in a way I had never really experienced before. I was especially drawn to the way the intro pulls you in, the pacing across the song, and the lyrical expression. I also love the visual language of the music videos, and being pulled into that world is what led me to start going to live shows.',
    },
    thumbnailSrc: '/images/hobbies/tomoo.jpg',
    thumbnailAlt: { ja: 'TOMOO のサムネイル', en: 'TOMOO thumbnail' },
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
