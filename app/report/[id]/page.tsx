import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CommentSection from "@/components/Comments";
import { getCommentsByReportIdAction } from "@/app/actions";

interface Params {
  id: string;
}

export default async function ReportPage({ params }: { params: Params }) {
  const supabase = await createClient();
  const { id } = params;

  // Fetch the report by ID
  const { data: report, error } = await supabase
    .from("reports")
    .select("*, user_id(*)")
    .eq("id", id)
    .single();

  if (error || !report) {
    notFound(); // Return a 404 page if the report is not found
  }

  // Fetch initial comments
  const initialComments = await getCommentsByReportIdAction(id);

  // Safe access to user_id properties
  const user = report.user_id || {}; // Ensure user_id is not null

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <Link href="/" passHref>
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Back to Home
        </button>
      </Link>

      <Card className="max-w-md mx-auto shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{report.pet_name}</CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription>
            <span className="font-medium">Description: </span>
            {report.description}
          </CardDescription>
          <p className="mt-2">
            <span className="font-medium">Location: </span>
            {report.location}
          </p>

          {report.photo_url && (
            <div className="mt-4">
              <img
                src={report.photo_url}
                alt={report.pet_name}
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-gray-500">Reported By</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {report.type === "missing" ? "Missing" : "Found"}
          </Badge>
        </CardFooter>
      </Card>

      {/* Add Comment Section */}
      <CommentSection reportId={id} initialComments={initialComments} />
    </div>
  );
}