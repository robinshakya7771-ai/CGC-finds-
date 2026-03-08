import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.message.findMany({
    where: { chatId: id },
    include: { sender: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await req.json();

  if (!text) return NextResponse.json({ error: "Message text required" }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      text,
      senderId: session.user.id,
      chatId: id,
    },
    include: { sender: { select: { id: true, name: true, image: true } } }
  });

  // Update chat's updatedAt field
  await prisma.chat.update({
    where: { id: id },
    data: { updatedAt: new Date() }
  });

  return NextResponse.json(message);
}
