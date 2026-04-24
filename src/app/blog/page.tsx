import { db } from '@/db';
import { articles, user } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/better-auth/get-session';
import NavbarSection from '@/components/navbar';
import FooterSection from '@/components/landing/footer-section';
import { DocumentText } from 'iconsax-reactjs';

export const metadata = {
  title: 'Blog — PurwokertoDev',
  description: 'Artikel dan tulisan dari anggota komunitas developer Purwokerto',
};

async function getPublicArticles() {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
      status: articles.status,
      created_at: articles.created_at,
      author_name: user.name,
      author_image: user.image,
    })
    .from(articles)
    .leftJoin(user, eq(articles.author_id, user.id))
    .where(eq(articles.status, 'approved'))
    .orderBy(desc(articles.created_at))
    .limit(20);

  return rows;
}

function getReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function getExcerpt(content: string, maxLen = 160): string {
  const plain = content.replace(/[#*_~`>[\]()!]/g, '').trim();
  return plain.length > maxLen ? plain.slice(0, maxLen) + '…' : plain;
}

export default async function PublicBlogPage() {
  const session = await getServerSession();
  const allArticles = await getPublicArticles();

  return (
    <div className="relative mx-auto w-full">
      <NavbarSection session={session} />

      <main className="mx-auto max-w-5xl px-5 pt-28 pb-20 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Blog
        </h1>
        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
          Artikel dan tulisan dari anggota komunitas PurwokertoDev.
        </p>

        {allArticles.length > 0 ? (
          <div className="mt-10 space-y-6">
            {allArticles.map((article) => {
              const date = article.created_at
                ? new Date(article.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '';

              return (
                <article
                  key={article.id}
                  className="group rounded-xl border border-slate-200/80 bg-white p-5 transition-all hover:shadow-md sm:p-6 dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                    {/* Author */}
                    {article.author_name && (
                      <>
                        <div className="flex items-center gap-1.5">
                          {article.author_image ? (
                            <img
                              src={article.author_image}
                              alt={article.author_name}
                              className="h-5 w-5 rounded-full"
                            />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-sky-500" />
                          )}
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {article.author_name}
                          </span>
                        </div>
                        <span>·</span>
                      </>
                    )}
                    <span>{date}</span>
                    <span>·</span>
                    <span>{getReadingTime(article.content)}</span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                    {article.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {getExcerpt(article.content)}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <DocumentText size={28} className="text-slate-400" variant="Bulk" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Belum ada artikel
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              Artikel dari anggota komunitas akan muncul di sini setelah disetujui.
            </p>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
