// app/api/rss/route.ts
import { fetchArticlesFromRSS } from "@/lib/rss/fetchArticles"; // bạn tự viết hàm này
import { NextResponse } from "next/server";

export const runtime = "edge"; // yêu cầu với scheduled function
export const revalidate = 0;

export async function GET() {
  await fetchArticlesFromRSS();
  return NextResponse.json({ success: true });
}
