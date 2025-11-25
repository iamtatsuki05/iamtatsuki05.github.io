import type { Locale } from '@/lib/i18n';
import type { BlogPost } from '@/lib/content/blog';
import type { Publication } from '@/lib/content/publication';
import type { LinkItem } from '@/lib/data/links';
import React from 'react';
import { ProfileSection } from '@/components/home/sections/ProfileSection';
import { LinksSection } from '@/components/home/sections/LinksSection';
import { LatestBlogSection } from '@/components/home/sections/LatestBlogSection';
import { PublicationsSection } from '@/components/home/sections/PublicationsSection';

type HomeContentViewProps = {
  locale: Locale;
  dict: HomeDictionary;
  latest: BlogPost[];
  publications: Publication[];
  links: LinkItem[];
};

type HomeDictionary = {
  title: string;
  intro: string;
  alias: string;
  handle: string;
  affiliation?: string;
  latest_blog: string;
  latest_pub: string;
  cta_more: string;
};

export function HomeContentView({ locale, dict, latest, publications, links }: HomeContentViewProps) {
  return (
    <div className="space-y-10">
      <ProfileSection
        title={dict.title}
        alias={dict.alias}
        handle={dict.handle}
        affiliation={dict.affiliation}
        intro={dict.intro}
      />

      <LinksSection links={links} ctaLabel={dict.cta_more} />

      <LatestBlogSection posts={latest} locale={locale} title={dict.latest_blog} ctaLabel={dict.cta_more} />

      <PublicationsSection publications={publications} title={dict.latest_pub} ctaLabel={dict.cta_more} />
    </div>
  );
}
