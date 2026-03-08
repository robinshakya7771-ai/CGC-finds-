import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, title, category, description, location, date, imageUrl } = await req.json();

    if (!title || !category || !location || !date) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        type,
        title,
        category,
        description,
        location,
        date: new Date(date),
        imageUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Item creation error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
