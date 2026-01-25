import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export function GET(req: NextRequest) {
    // This route is used as unique database source identifier in Ease Pass.
    // e.g. https://your-easepass-cloud-instance.com/api/database/your-database-slug
    // If someone tries to access it via browser, we just redirect to homepage.
    redirect("/");
}