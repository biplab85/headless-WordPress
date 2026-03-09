import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json({ error: "Missing tag" }, { status: 400 });
    }

    await revalidateTag(tag, { expire: 0 });
    return NextResponse.json({ revalidated: true, tag });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
