import { getVBCSectionPostsPostsFromCache } from '@/lib/notion';
import PostCard from '@/components/post-card';

export default function PostsFooter(params: { slug: string }) {
  const vbcPosts = getVBCSectionPostsPostsFromCache();

  const filteredVbcPosts = vbcPosts.filter((p) => p.slug !== params.slug).slice(0, 6);

  return (
    <div>
      <div className="centerDivider"></div>
      <div className="">
        <h2 className="heading">VBC Series</h2>
        <div className="divider"></div>
        {filteredVbcPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
