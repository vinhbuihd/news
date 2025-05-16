import { db } from "@/lib/db";

export default async function NewsPage() {
  const articles = await db.article.findMany({
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  return (
    <div className="p-4 space-y-4">
      {articles.map((a) => (
        <a key={a.id} href={a.link} target="_blank" className="block">
          <h2 className="font-semibold">{a.title}</h2>
          <p className="text-sm text-gray-500">
            {a.source} • {a.publishedAt.toDateString()}
          </p>
        </a>
      ))}
    </div>
  );
}
