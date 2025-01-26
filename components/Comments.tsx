"use client"; 

import { useTransition, useState, useRef, useEffect } from "react";
import { createCommentAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: {
    id: string;
    email: string;
  };
}

export default function CommentSection({
  reportId,
  initialComments,
}: {
  reportId: string;
  initialComments: Comment[];
}) {
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [user, setUser] = useState<any>(null); 
  const formRef = useRef<HTMLFormElement>(null); 
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, [supabase.auth]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const content = formData.get("content") as string;

    if (!content) return;

    startTransition(async () => {
      try {

        const newComment = await createCommentAction(formData);

  
        setComments((prevComments) => [...prevComments, newComment]);

     
        if (formRef.current) {
          formRef.current.reset();
        }
      } catch (error: any) {
        console.error("Error submitting comment:", error);
        alert(error.message); 
      }
    });
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Show login/signup prompt if not logged in*/}
          {!user && (
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                You must be logged in to comment.{" "}
                <Link href="/sign-in" className="text-blue-500 hover:underline">
                  Log in
                </Link>{" "}
                or{" "}
                <Link href="/sign-up" className="text-blue-500 hover:underline">
                  sign up
                </Link>
                .
              </p>
            </div>
          )}

          {/* Comment Form for auth user */}
          {user && (
            <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
              <input type="hidden" name="report_id" value={reportId} />
              <Textarea
                name="content"
                placeholder="Add a comment..."
                required
                className="mb-4"
                disabled={isPending}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p>No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${comment.user_id.email}`} />
                    <AvatarFallback>{comment.user_id.email[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.user_id.email}</p>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}