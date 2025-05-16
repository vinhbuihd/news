import Parser from "rss-parser";
import { db } from "@/lib/db";

const parser = new Parser();

export async function fetchArticlesFromRSS() {
  const feeds = [
    { url: "https://techcrunch.com/feed/", source: "TechCrunch" },
    { url: "https://www.theverge.com/rss/index.xml", source: "The Verge" },
  ];

  for (const feed of feeds) {
    const result = await parser.parseURL(feed.url);

    for (const item of result.items) {
      try {
        await db.article.create({
          data: {
            title: item.title || "No title",
            link: item.link!,
            content: item.contentSnippet || "",
            publishedAt: new Date(item.pubDate || new Date()),
            source: feed.source,
          },
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Unique constraint failed")
        ) {
          continue;
        }
        console.error("Save failed:", error);
      }
    }
  }
}
