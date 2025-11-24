import React from 'react';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';

type CardItem = {
  key: string;
  title: string;
  description?: string;
  href?: string;
  external?: boolean;
  date?: string;
  linkTestId?: string;
};

type Props = {
  items: CardItem[];
  gridClassName?: string;
  listTestId?: string;
  cardTestId?: string;
};

export function ContentCardList({ items, gridClassName, listTestId, cardTestId }: Props) {
  return (
    <ul className={clsx('grid gap-3 sm:grid-cols-2', gridClassName)} data-testid={listTestId}>
      {items.map((item) => {
        const body = (
          <>
            <h3 className="font-medium mb-1">{item.title}</h3>
            {item.description ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 flex-1">{item.description}</p>
            ) : null}
            {item.date ? <p className="text-xs mt-2 opacity-70">{item.date}</p> : null}
          </>
        );

        const card = (
          <Card
            as={item.href ? 'a' : 'div'}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noreferrer' : undefined}
            className={item.external ? 'hover:border-gray-300 dark:hover:border-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500' : undefined}
            testId={item.linkTestId}
          >
            {body}
          </Card>
        );

        return (
          <li key={item.key} className="h-full" data-testid={cardTestId}>
            {card}
          </li>
        );
      })}
    </ul>
  );
}
