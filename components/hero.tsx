import Link from "next/link";
import { Button } from "./ui/button";


export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              CHASE
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Helping Lost Pets Find Their Way Home.            
            </p>
            <div className="flex gap-4 items-center justify-center">
              <Button variant='default' asChild>
                <Link href="/lost">Lost</Link>
              </Button>
              <Button variant='default' asChild>
                <Link href="/found">Found</Link>
              </Button>
            </div>
          </div>
        </main>
    </div>
  );
}
