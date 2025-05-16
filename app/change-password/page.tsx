import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RegisterForm from "@/components/register-form";
import ChangePasswordForm from "@/components/change-password-form";

export default async function ChangePwPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Change password</h1>
          <p className="text-muted-foreground">
            Enter your information to change password
          </p>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
