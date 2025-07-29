import { getVBCSectionPostsPostsFromCache } from '@/lib/notion';
import SeriesPostCard from './series-post-card';

export default function VBCFooter(params: { slug: string }) {
  const vbcPosts = getVBCSectionPostsPostsFromCache();

  const filteredVbcPosts = vbcPosts.sort((a, b) => (a.title > b.title ? 1 : -1));
  const indexOfSlug = filteredVbcPosts.map((p) => p.slug).indexOf(params.slug);
  const slicedPosts = filteredVbcPosts.slice(indexOfSlug + 1, filteredVbcPosts.length + 1);

  return (
    <div>
      <div className="centerDivider"></div>
      <div className="">
        <h3 className="heading">Next in &lsquo;Why is Value-based care so difficult?&rsquo;</h3>
        <div className="divider"></div>
        {slicedPosts.map((post) => (
          <SeriesPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
