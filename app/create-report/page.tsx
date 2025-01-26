import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createReportAction } from "../actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function CreateReport(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Create a New Report</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-4" action={createReportAction}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type of Report</Label>
            <select
              name="type"
              className="border rounded-md p-2 text-foreground"
              required
            >
              <option value="missing">Missing</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              name="description"
              placeholder="Provide a description of the pet"
              className="border rounded-md p-2 text-foreground"
              rows={4}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Input name="location" placeholder="Enter location" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="photo_url">Photo URL (Optional)</Label>
            <Input
              name="photo_url"
              placeholder="https://example.com/photo.jpg"
              type="url"
            />
          </div>

          <CardFooter className="flex justify-end mt-4">
            <SubmitButton pendingText="Submitting..." formAction={createReportAction}>
              Submit Report
            </SubmitButton>
          </CardFooter>

          <FormMessage message={searchParams} />
        </form>
      </CardContent>
    </Card>
  );
}
