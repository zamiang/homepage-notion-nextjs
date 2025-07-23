import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Post } from '@/lib/notion';

interface PostCardProps {
  post: Post;
}

export default function PhotoCard({ post }: PostCardProps) {
  const imageUrl = process.env.NODE_ENV === 'production' ? 'https://image.zamiang.com' : '/images';
  return (
    <div className="gridItem">
      <div className="relative aspect-[1/1] w-full">
        <Link href={`/photos/${post.slug}`} aria-label={post.title}>
          <Image src={`${imageUrl}/photos/${post.coverImage}`} alt={post.title} fill />
        </Link>
      </div>
      <p style={{ marginTop: 0, paddingBottom: 0 }}>
        <Link href={`/photos/${post.slug}`} aria-label={post.title}>
          {format(new Date(post.date), 'MMM d, yyyy')}
        </Link>
      </p>
      <Link href={`/photos/${post.slug}`} aria-label={post.title}>
        <h4 style={{ marginTop: 0 }}>{post.title}</h4>
      </Link>
    </div>
  );
}
