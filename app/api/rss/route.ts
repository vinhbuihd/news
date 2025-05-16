// app/api/rss/route.ts
import { fetchArticlesFromRSS } from "@/lib/rss/fetchArticles";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  await fetchArticlesFromRSS();
  return NextResponse.json({ success: true });
}
