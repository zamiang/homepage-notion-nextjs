import { getVBCSectionPostsFromCache } from '@/lib/notion';

import { VBC_DESCRIPTION, VBC_TITLE } from './consts';
import SeriesPostCard from './series-post-card';

export default function VBCFooter(params: { slug: string }) {
  const vbcPosts = getVBCSectionPostsFromCache();

  const filteredVbcPosts = vbcPosts.sort((a, b) => (a.title > b.title ? 1 : -1));
  const indexOfSlug = filteredVbcPosts.map((p) => p.slug).indexOf(params.slug);

  return (
    <div>
      <div className="center-divider"></div>
      <div className="">
        <h3 className="heading">{VBC_TITLE}</h3>
        <p>{VBC_DESCRIPTION}</p>
        <div className="divider"></div>
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
