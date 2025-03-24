import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function LostPetsPage() {
  const supabase = await createClient();

  // Fetch all lost pets
  const { data: lostPets, error } = await supabase
    .from("reports")
    .select("*, user_id(*)")
    .eq("type", "missing");

  if (error) {
    console.error("Error fetching lost pets:", error);
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Lost Pets</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lostPets?.map((pet) => (
          <Link key={pet.id} href={`/report/${pet.id}`} passHref>
            <Card className="shadow-lg rounded-lg cursor-pointer hover:shadow-2xl transition">
              <CardContent>
                <p className="font-medium mt-4">Location: {pet.location}</p>
                <p className="text-sm text-gray-400">{pet.description}</p>

                {pet.photo_url && (
                  <div className="mt-4">
                    <img
                      src={pet.photo_url}
                      alt={pet.pet_name}
                      className="w-full h-auto rounded-md shadow-md"
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex items-center justify-between mt-4">
                <Badge variant="outline" className="text-sm">
                  Lost
                </Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
