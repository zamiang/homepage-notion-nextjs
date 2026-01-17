import { getVBCSectionPostsFromCache } from '@/lib/notion';

import { VBC_DESCRIPTION, VBC_TITLE } from './consts';
import SeriesPostCard from './series-post-card';

export default function VBCFooter(params: { slug: string }) {
  const vbcPosts = getVBCSectionPostsFromCache();

  const filteredVbcPosts = vbcPosts.sort((a, b) => (a.title > b.title ? 1 : -1));
  const indexOfSlug = filteredVbcPosts.map((p) => p.slug).indexOf(params.slug);

  return (
    <section className="section-wrapper section-wrapper--accent" aria-labelledby="vbc-series-heading">
      <div className="section-wrapper-inner">
        <p className="section-label">VBC Deep Dive</p>
        <h2 id="vbc-series-heading" className="section-heading">{VBC_TITLE}</h2>
        <p className="section-subtitle">{VBC_DESCRIPTION}</p>
        <div className="section-rule" aria-hidden="true"></div>
        {filteredVbcPosts.map((post, index) => (
          <SeriesPostCard
            key={post.id}
            post={post}
            isPast={index < indexOfSlug}
            isCurrent={index === indexOfSlug}
            isNext={index === indexOfSlug + 1}
          />
        ))}
      </div>
    </section>
  );
}
