import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  return user ? (
    <div className="flex items-center gap-4">
       {user.user_metadata.first_name}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
        <Button variant={"default"}>
          <Link href="/protected">Create a new report</Link>
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
