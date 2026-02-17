import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or malformed token" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);

  if (token !== "123") {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({
    name: "Heinr-Anselm Urakpa",
    email: "heinryanselm@gmail.com",
    role: "Lead Software Specialist",
    department: "Engineering",
    location: "Hull, UK",
    phone: "+44 7700 900123",
    joinedDate: "2026-02-17",
  });
}
