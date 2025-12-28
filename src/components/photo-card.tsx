import { Post } from '@/lib/notion';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  shouldHideText?: boolean;
  priority?: boolean;
}

export default function PhotoCard({ post, shouldHideText, priority = false }: PostCardProps) {
  return (
    <div className="photo-card">
      <div className="relative aspect-[1/1] w-full">
        <Link href={`/photos/${post.slug}`} aria-label={post.title}>
          <Image
            src={`/images/photos/${post.coverImage}`}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
            priority={priority}
          />
        </Link>
      </div>
      {!shouldHideText && (
        <p className="photo-card-date">{format(new Date(post.date), 'MMM d, yyyy')}</p>
      )}
      {!shouldHideText && (
        <h3 className="photo-card-title">
          <Link href={`/photos/${post.slug}`} aria-label={post.title}>
            {post.title}
          </Link>
        </h3>
      )}
    </div>
  );
}
