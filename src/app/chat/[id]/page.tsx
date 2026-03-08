import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ChatClient from "./ChatClient";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const chat = await prisma.chat.findUnique({
    where: { id: id },
    include: {
      item: true,
      participants: {
        select: { id: true, name: true, image: true }
      }
    }
  });

  if (!chat) notFound();

  // Verify user is a participant
  const isParticipant = chat.participants.some(p => p.id === session.user.id);
  if (!isParticipant) notFound();

  const otherUser = chat.participants.find(p => p.id !== session.user.id);

  return <ChatClient chatId={chat.id} item={chat.item} otherUser={otherUser!} currentUserId={session.user.id} />;
}
