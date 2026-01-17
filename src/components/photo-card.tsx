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
    <div className="photo-card group">
      <div className="relative aspect-[1/1] w-full overflow-hidden rounded-sm">
        <Link
          href={`/photos/${post.slug}`}
          aria-label={shouldHideText ? post.title : `View photo: ${post.title}`}
          className="block border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Image
            src={`/images/photos/${post.coverImage}`}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
            priority={priority}
            className="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </Link>
      </div>
      {!shouldHideText && (
        <p className="photo-card-date">
          <time dateTime={new Date(post.date).toISOString().split('T')[0]}>
            {format(new Date(post.date), 'MMM d, yyyy')}
          </time>
        </p>
      )}
      {!shouldHideText && (
        <h3 className="photo-card-title">
          <Link href={`/photos/${post.slug}`}>{post.title}</Link>
        </h3>
      )}
    </div>
  );
}
