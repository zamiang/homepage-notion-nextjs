import PhotoCard from '@/components/photo-card';
import PostCard from '@/components/post-card';
import { getAllSectionPostsFromCache, getPhotosFromCache } from '@/lib/notion';

export default function PostsFooter(params: { slug: string }) {
  const posts = getAllSectionPostsFromCache();
  const photos = getPhotosFromCache();

  const filteredPosts = posts.filter((p) => p.slug !== params.slug).slice(0, 4);
  const filteredPhotos = photos.filter((p) => p.slug !== params.slug).slice(0, 6);

  return (
    <div className="mt-16">
      <div className="section-rule mb-8"></div>
      <div className="mb-12">
        <p className="section-label">More to Read</p>
        <h2 className="section-heading">Recommended Writing</h2>
        <div className="section-rule"></div>
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div>
        <p className="section-label">Visual Stories</p>
        <h2 className="section-heading">Recommended Photos</h2>
        <div className="section-rule"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPhotos.map((post) => (
            <PhotoCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
