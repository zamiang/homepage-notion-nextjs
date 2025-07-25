import { getPhotosFromCache, getPostsFromCache } from '@/lib/notion';
import PostCard from '@/components/post-card';
import PhotoCard from '@/components/photo-card';

export default function PostsFooter(params: { slug: string }) {
  const posts = getPostsFromCache();
  const photos = getPhotosFromCache();

  const filteredPosts = posts.filter((p) => p.slug !== params.slug).slice(0, 4);
  const filteredPhotos = photos.filter((p) => p.slug !== params.slug).slice(0, 6);

  return (
    <div>
      <div className="centerDivider"></div>
      <div className="">
        <h2 className="heading">Recommended Writing</h2>
        <div className="divider"></div>
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div className="">
        <h2 className="heading">Recommended Photos</h2>
        <div className="divider"></div>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPhotos.map((post) => (
            <PhotoCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
