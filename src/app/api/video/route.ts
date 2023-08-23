import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const User: any = await getCurrentUser();

    const body = await req.json();
    const { prompt } = body;
    if (!User) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!replicate.auth) {
      return new NextResponse("Replicate Api is not configured", {
        status: 500,
      });
    }
    if (!prompt) {
      return new NextResponse("Message is required", { status: 400 });
    }

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      {
        input: {
          prompt,
        },
      }
    );
    return new NextResponse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
