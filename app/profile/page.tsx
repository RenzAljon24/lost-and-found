import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "../actions";
import { redirect } from "next/navigation";

export default async function Profile() {
  const supabase = await createClient();

  // Get the authenticated user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/sign-in");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id) 
    .single(); 

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return <p>Error fetching profile data.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {profile && (
        <div className="space-y-2">
          <p><strong>Email:</strong> {authUser.email}</p>
          <p><strong>Full Name:</strong> {profile.display_name}</p>
        </div>
      )}

      <form action={signOutAction} className="mt-6">
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}