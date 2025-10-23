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
    <div className="gridItem">
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
        <p style={{ marginTop: 0, paddingBottom: 0 }}>
          <Link href={`/photos/${post.slug}`} aria-label={post.title}>
            {format(new Date(post.date), 'MMM d, yyyy')}
          </Link>
        </p>
      )}
      {!shouldHideText && (
        <Link href={`/photos/${post.slug}`} aria-label={post.title}>
          <h4 style={{ marginTop: 0 }}>{post.title}</h4>
        </Link>
      )}
    </div>
  );
}
