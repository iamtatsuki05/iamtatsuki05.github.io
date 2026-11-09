import type { LinkItem } from '@/lib/data/links';
import { LinkIcon } from '@/components/links/LinkIcon';

type Props = {
  items: LinkItem[];
  showDescription?: boolean;
  iconSize?: number;
  gridClassName?: string;
  idPrefix?: string;
};

export function LinkGrid({
  items,
  showDescription = false,
  iconSize = 48,
  gridClassName = 'flex flex-wrap justify-center gap-4 sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
  idPrefix = 'link-grid',
}: Props) {
  const renderItem = (key: string, item: LinkItem, index: number) => {
    const titleId = `${idPrefix}-${index}-title`;
    const descriptionId = showDescription && item.desc ? `${idPrefix}-${index}-description` : undefined;

    return (
      <li key={key} className="link-grid__item text-center card p-4">
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="link-grid__item-link block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          <span aria-hidden="true" className="link-grid__icon-link inline-block mb-2">
            <LinkIcon item={item} size={iconSize} />
          </span>
          <span
            id={titleId}
            className="link-grid__title font-medium block break-words sm:break-normal sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis"
          >
            {item.title}
          </span>
          {descriptionId ? (
            <span id={descriptionId} className="mt-1 block text-sm text-gray-600 dark:text-gray-300">
              {item.desc}
            </span>
          ) : null}
        </a>
      </li>
    );
  };

  return (
    <ul className={gridClassName}>
      {items.map((item, index) => renderItem(`${item.url}-${index}`, item, index))}
    </ul>
  );
}
