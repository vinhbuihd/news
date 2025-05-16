import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.info({ session });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to the Dashboard
        </h1>
        <p className="text-muted-foreground max-w-[600px]">
          A secure fullstack application built with Next.js, Prisma, and
          NextAuth.
        </p>

        <div className="flex gap-4">
          {!session ? (
            <>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              {session.user.role === "ADMIN" && (
                <Button variant="outline" asChild>
                  <Link href="/admin">Admin Panel</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
