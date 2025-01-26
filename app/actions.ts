"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const firstName = formData.get("first_name")?.toString();
  const lastName = formData.get("last_name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!firstName || !lastName || !email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
  if (authError) {
    return encodedRedirect("error", "/sign-up", authError.message);
  }

  return redirect("/");
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export const createReportAction = async (formData: FormData) => {
  const type = formData.get("type") as string; // 'missing' or 'found'
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const photoUrl = formData.get("photo_url")?.toString();
  
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    return encodedRedirect("error", "/create-report", "User is not authenticated.");
  }

  // Validation
  if (!type) return encodedRedirect("error", "/create-report", "Type is required.");
  if (!description) return encodedRedirect("error", "/create-report", "Description is required.");
  if (!location) return encodedRedirect("error", "/create-report", "Location is required.");

  // Insert Report with user_id (user.id should be from the authenticated user in Appwrite)
  const { data, error } = await supabase
    .from("reports")
    .insert([
      {
        type,
        description,
        photo_url: photoUrl || null,
        location,
        user_id: user.id, // Insert the authenticated user's ID
      },
    ])
    .select()
    .single();

  // Handle Errors
  if (error) {
    console.error("Error inserting report:", error.message);
    return encodedRedirect("error", "/create-report", error.message || "Failed to create the report.");
  }

  // Ensure `data` is valid
  if (!data || !data.id) {
    console.error("Unexpected error: Report creation returned invalid data");
    return encodedRedirect("error", "/create-report", "Unexpected error occurred while creating the report.");
  }

  // Success Redirect
  return redirect(`/report/${data.id}`);
};



// Get all reports
export const getAllReportsAction = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reports:", error.message);
    return [];
  }

  return data;
};


export const createCommentAction = async (formData: FormData) => {
  const reportId = formData.get("report_id") as string;
  const content = formData.get("content") as string;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  // Validation
  if (!reportId) throw new Error("Report ID is required.");
  if (!content) throw new Error("Comment content is required.");

  // Insert Comment
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        report_id: reportId,
        content,
        user_id: user.id,
      },
    ])
    .select("*, user_id(*)")
    .single();

  // Handle Errors
  if (error) {
    console.error("Error inserting comment:", error.message);
    throw new Error(error.message || "Failed to create the comment.");
  }

  // Return the newly created comment
  return data;
};


export const getCommentsByReportIdAction = async (reportId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*, user_id(*)")
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error.message);
    return [];
  }

  return data;
};