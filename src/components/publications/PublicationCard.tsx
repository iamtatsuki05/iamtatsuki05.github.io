import { Fragment, type MouseEvent } from 'react';
import Image from '@/components/compat/Image';
import { type PublicationLink, PublicationLinks } from '@/components/publications/PublicationLinks';
import { PublicationRecognition } from '@/components/publications/PublicationRecognition';
import { BibtexControl } from '@/components/publications/BibtexControl';
import { SearchHighlight } from '@/components/search/SearchHighlight';
import type { Locale } from '@/lib/i18n';
import { siteConfig } from '@/lib/seo/config';

export type PublicationCardItem = {
  slug: string;
  title: string;
  publishedAt?: string;
  venue?: string;
  publisher?: string;
  authors?: string[];
  abstract?: string;
  tags?: string[];
  links: PublicationLink[];
  headerImage?: string;
  headerAlt?: string;
  acceptance?: { accepted: number; submitted: number; source?: string } | { rate: number; source?: string };
  award?: string;
  bibtex?: string;
};

type Props = {
  item: PublicationCardItem;
  locale: Locale;
  query?: string;
  eagerImage?: boolean;
  onOpen?: (url: string) => void;
  titleAs?: 'h3' | 'h4';
};

const ownerNames = new Set<string>(siteConfig.aliases);
const CJK = /[぀-ヿ㐀-鿿]/;

function AuthorList({ authors }: { authors: string[] }) {
  const separator = authors.every((name) => CJK.test(name)) ? '、' : ', ';
  return (
    <p className="text-sm text-gray-700 dark:text-gray-300" data-testid="publication-authors">
      {authors.map((name, index) => (
        <Fragment key={name}>
          {index > 0 ? separator : null}
          {ownerNames.has(name) ? <strong className="font-semibold">{name}</strong> : name}
        </Fragment>
      ))}
    </p>
  );
}

export function PublicationCard({ item, locale, query = '', eagerImage = false, onOpen, titleAs: Title = 'h3' }: Props) {
  const primaryLink = item.links[0]?.url;
  // マウス操作の利便のためカード全域クリックを維持する。キーボードと支援技術には
  // タイトルの実リンクがあるため、li には role を与えずクリックのみ委譲する。
  const cardClickProps =
    primaryLink && onOpen
      ? {
          onClick: (event: MouseEvent<HTMLLIElement>) => {
            if ((event.target as HTMLElement).closest('a, button, [data-card-click-ignore]')) return;
            onOpen(primaryLink);
          },
        }
      : {};

  return (
    <li
      data-testid="publication-card"
      className={`card p-3 gap-3 items-start sm:flex ${primaryLink && onOpen ? 'pressable-card cursor-pointer' : ''}`}
      {...cardClickProps}
    >
      {item.headerImage ? (
        <div
          className="relative hidden h-36 w-full shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:block sm:h-20 sm:w-28"
          data-testid="publication-image"
        >
          <Image
            src={item.headerImage}
            alt={item.headerAlt ?? ''}
            fill
            className="object-contain"
            sizes="120px"
            loading={eagerImage ? 'eager' : 'lazy'}
            priority={eagerImage}
          />
        </div>
      ) : null}
      <div className="flex-1 min-w-0 mt-2 sm:mt-0">
        <Title className="text-base font-semibold">
          {primaryLink ? (
            <a
              href={primaryLink}
              target="_blank"
              rel="noreferrer"
              data-testid="publication-card-link"
              className="underline-offset-2 hover:underline"
            >
              <SearchHighlight text={item.title} query={query} />
            </a>
          ) : (
            <SearchHighlight text={item.title} query={query} />
          )}
        </Title>
        {item.authors?.length ? <AuthorList authors={item.authors} /> : null}
        <p className="text-xs opacity-70">
          {(item.publishedAt || '').slice(0, 10)} ・{' '}
          <SearchHighlight text={item.venue || item.publisher || ''} query={query} />
        </p>
        <PublicationRecognition acceptance={item.acceptance} award={item.award} locale={locale} />
        {item.abstract ? (
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            <SearchHighlight text={item.abstract} query={query} />
          </p>
        ) : null}
        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2 mt-1 text-xs opacity-70">
            {item.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-800">
                #<SearchHighlight text={t} query={query} />
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <PublicationLinks links={item.links} />
          {item.bibtex ? <BibtexControl bibtex={item.bibtex} /> : null}
        </div>
      </div>
    </li>
  );
}
