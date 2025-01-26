import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CommentSection from "@/components/Comments";
import { getCommentsByReportIdAction } from "@/app/actions";

type tParams = Promise<{ id: string }>;

export default async function ReportPage({params}: {params: Promise<{ id: string }>}) {
  const supabase = await createClient();
  const { id } = await params;


  // Fetch the report by ID
  const { data: report, error } = await supabase
    .from("reports")
    .select("*, user_id(*)")
    .eq("id", id)
    .single();

  if (error || !report) {
    notFound(); 
  }


  const initialComments = await getCommentsByReportIdAction(id);

  const user = report.user_id || {}; 

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Link href="/" passHref>
        <button className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
          Back to Home
        </button>
      </Link>

      {/* Report Card */}
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 p-6 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url} alt={user.email} />
              <AvatarFallback>{user.email[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-semibold">{user.display_name}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Reported by {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Report Type Badge */}
          <Badge
            variant={report.type === "missing" ? "destructive" : "default"}
            className="mb-4"
          >
            {report.type === "missing" ? "Missing" : "Found"}
          </Badge>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{report.description}</p>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <p className="text-gray-700">{report.location}</p>
          </div>

          {/* Photo */}
          {report.photo_url && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Photo</h2>
              <img
                src={report.photo_url}
                alt={report.pet_name}
                className="w-full h-auto rounded-md shadow-sm"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 p-6 border-t">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-600">
              Last updated: {new Date(report.created_at).toLocaleDateString()}
            </p>
            <Badge variant="outline" className="text-sm">
              {report.type === "missing" ? "Missing" : "Found"}
            </Badge>
          </div>
        </CardFooter>
      </Card>

      {/* Comment Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <CommentSection reportId={id} initialComments={initialComments} />
      </div>
    </div>
  );
}