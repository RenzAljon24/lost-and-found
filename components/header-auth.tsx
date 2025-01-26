
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { UserPen } from "lucide-react";
export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  return user ? (
    <div className="flex items-center gap-4">
        <Link href="/profile">
          <UserPen className="hover:scale-75 duration-300 ease-in-out" size={24} />
        </Link>
        <Button variant={"default"}>
          <Link href="/create-report">Create a new report</Link>
        </Button>

    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
