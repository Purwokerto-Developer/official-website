import { db } from '@/db';
import { articles, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/better-auth/get-session';
import NavbarSection from '@/components/navbar';
import FooterSection from '@/components/landing/footer-section';
import { ArrowLeft, Clock } from 'iconsax-reactjs';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Validate UUID to prevent DB crash if 'id' is not uuid format
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isValidUUID) {
    return { title: 'Article Not Found' };
  }

  const [article] = await db
    .select({ title: articles.title, content: articles.content })
    .from(articles)
    .where(eq(articles.id, id));

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const excerpt = article.content.replace(/[#*_~`>[\]()!]/g, '').trim().substring(0, 160) + '...';

  return {
    title: `${article.title} — PurwokertoDev`,
    description: excerpt,
  };
}

function getReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} menit baca`;
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession();

  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isValidUUID) {
    notFound();
  }

  const [articleData] = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      created_at: articles.created_at,
      status: articles.status,
      author_name: user.name,
      author_image: user.image,
    })
    .from(articles)
    .leftJoin(user, eq(articles.author_id, user.id))
    .where(eq(articles.id, id));

  if (!articleData || articleData.status !== 'approved') {
    notFound();
  }

  const date = articleData.created_at
    ? new Date(articleData.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="relative mx-auto w-full">
      <NavbarSection session={session} />

      <main className="mx-auto max-w-3xl px-5 pt-28 pb-20 sm:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali ke Blog
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            {articleData.author_name && (
              <div className="flex items-center gap-2">
                {articleData.author_image ? (
                  <img
                    src={articleData.author_image}
                    alt={articleData.author_name}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-sky-500" />
                )}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {articleData.author_name}
                </span>
              </div>
            )}
            
            {(articleData.author_name && (date || articleData.content)) && (
               <span className="hidden sm:inline">•</span>
            )}
            
            <div className="flex items-center gap-4">
              <span>{date}</span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} />
                {getReadingTime(articleData.content)}
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white leading-tight">
            {articleData.title}
          </h1>
        </header>

        {/* Article Content */}
        <article className="prose prose-slate prose-lg dark:prose-invert max-w-none">
          {/* Note: In a real app we would parse markdown here. For now we use whitespace-pre-wrap */}
          <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 leading-relaxed">
            {articleData.content}
          </p>
        </article>

        {/* End of article marker */}
        <div className="mt-16 flex justify-center">
            <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
