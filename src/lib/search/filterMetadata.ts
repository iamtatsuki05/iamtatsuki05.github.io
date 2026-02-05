type FilterMetadataOptions<T> = {
  extractYear: (item: T) => string | undefined;
  extractTags: (item: T) => readonly string[] | undefined;
};

export type SearchFilterMetadata = {
  years: string[];
  tags: string[];
};

export function buildSearchFilterMetadata<T>(
  items: readonly T[],
  { extractYear, extractTags }: FilterMetadataOptions<T>,
): SearchFilterMetadata {
  const years = new Set<string>();
  const tags = new Set<string>();

  for (const item of items) {
    const year = (extractYear(item) || '').slice(0, 4);
    if (year) years.add(year);

    for (const tag of extractTags(item) || []) {
      tags.add(tag);
    }
  }

  return {
    years: Array.from(years).sort((a, b) => (a < b ? 1 : -1)),
    tags: Array.from(tags).sort(),
  };
}

export function buildOrderedFacetValues<T, TValue extends string>(
  items: readonly T[],
  extractValue: (item: T) => TValue | undefined,
  orderedValues: readonly TValue[],
): TValue[] {
  const values = new Set<TValue>();

  for (const item of items) {
    const value = extractValue(item);
    if (value) values.add(value);
  }

  return orderedValues.filter((value) => values.has(value));
}
