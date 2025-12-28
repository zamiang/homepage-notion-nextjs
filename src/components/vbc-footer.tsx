import { getVBCSectionPostsFromCache } from '@/lib/notion';

import { VBC_DESCRIPTION, VBC_TITLE } from './consts';
import SeriesPostCard from './series-post-card';

export default function VBCFooter(params: { slug: string }) {
  const vbcPosts = getVBCSectionPostsFromCache();

  const filteredVbcPosts = vbcPosts.sort((a, b) => (a.title > b.title ? 1 : -1));
  const indexOfSlug = filteredVbcPosts.map((p) => p.slug).indexOf(params.slug);

  return (
    <div className="mt-12">
      <div className="section-rule mb-8"></div>
      <div>
        <p className="section-label">Deep Dive Series</p>
        <h3 className="section-heading">{VBC_TITLE}</h3>
        <p className="section-subtitle">{VBC_DESCRIPTION}</p>
        <div className="section-rule"></div>
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
    </div>
  );
}
