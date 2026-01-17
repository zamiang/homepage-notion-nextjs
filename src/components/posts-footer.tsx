import PhotoCard from '@/components/photo-card';
import PostCard from '@/components/post-card';
import { getAllSectionPostsFromCache, getPhotosFromCache } from '@/lib/notion';

export default function PostsFooter(params: { slug: string }) {
  const posts = getAllSectionPostsFromCache();
  const photos = getPhotosFromCache();

  const filteredPosts = posts.filter((p) => p.slug !== params.slug).slice(0, 4);
  const filteredPhotos = photos.filter((p) => p.slug !== params.slug).slice(0, 6);

  return (
    <div>
      {/* Recommended Writing - Warm background */}
      <section className="section-wrapper section-wrapper--warm" aria-labelledby="recommended-writing-heading">
        <div className="section-wrapper-inner">
          <p className="section-label">More to Read</p>
          <h2 id="recommended-writing-heading" className="section-heading">Recommended Writing</h2>
          <p className="section-subtitle">
            Essays on engineering leadership, startups, and building teams.
          </p>
          <div className="section-rule" aria-hidden="true"></div>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Recommended Photos - Muted background */}
      <section className="section-wrapper section-wrapper--muted" aria-labelledby="recommended-photos-heading">
        <div className="section-wrapper-inner">
          <p className="section-label">Visual Stories</p>
          <h2 id="recommended-photos-heading" className="section-heading">Recommended Photos</h2>
          <p className="section-subtitle">Capturing moments from travels and everyday life.</p>
          <div className="section-rule" aria-hidden="true"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPhotos.map((post) => (
              <PhotoCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
