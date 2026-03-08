import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, Calendar, Tag, ArrowLeft, MessageCircle } from "lucide-react";

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  const item = await prisma.item.findUnique({
    where: { id: id },
    include: {
      user: {
        select: { id: true, name: true, image: true }
      }
    }
  });

  if (!item) {
    notFound();
  }

  const isOwner = session?.user?.id === item.userId;

  // Smart Match Logic
  // Fetch items of the opposite type, matching category or having some keyword overlap
  let suggestedMatches: any[] = [];
  
  if (isOwner) {
    const oppType = item.type === "LOST" ? "FOUND" : "LOST";
    
    // Simple logic: fetch same category active items, limit 3
    suggestedMatches = await prisma.item.findMany({
      where: {
        type: oppType,
        status: "ACTIVE",
        category: item.category,
      },
      take: 3,
      orderBy: { date: 'desc' }
    });
  }

  // Handle Create Chat Action
  const handleMessageClick = async () => {
    "use server";
    if (!session?.user?.id) return;
    
    // Check if chat already exists for this user and item
    let chat = await prisma.chat.findFirst({
      where: {
        itemId: item.id,
        participants: {
          some: { id: session.user.id }
        }
      }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          itemId: item.id,
          participants: {
            connect: [{ id: session.user.id }, { id: item.userId }]
          }
        }
      });
    }

    redirect(`/chat/${chat.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:text-indigo-800 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 pattern-dots">
                No image provided
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-1.5 text-sm font-bold rounded-full shadow-md backdrop-blur-md ${item.type === 'LOST' ? 'bg-rose-500/90 text-white' : 'bg-teal-500/90 text-white'}`}>
                {item.type}
              </span>
            </div>
          </div>
          
          <div className="p-8 md:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                <Tag className="w-4 h-4" />
                {item.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">{item.title}</h1>
            
            <p className="text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed flex-grow">{item.description}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Location</p>
                  <p className="font-semibold text-gray-900">{item.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Date</p>
                  <p className="font-semibold text-gray-900">{new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-auto">
              {!isOwner ? (
                session ? (
                  <form action={handleMessageClick}>
                    <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all group">
                      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Message {item.user.name?.split(' ')[0] || 'Finder'}
                    </button>
                  </form>
                ) : (
                  <Link href="/auth/signin" className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                    Sign in to message
                  </Link>
                )
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-center text-sm font-medium">
                  This is your own listing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOwner && suggestedMatches.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Suggested Matches</h2>
              <p className="text-gray-500 text-sm mt-1">We found these {item.type === 'LOST' ? 'FOUND' : 'LOST'} items that might match yours based on category.</p>
            </div>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Smart Match</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedMatches.map((match) => (
              <Link href={`/item/${match.id}`} key={match.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition duration-300">
                <div className="p-5 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {match.imageUrl ? (
                      <img src={match.imageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center pb-2 pt-2 text-xs text-gray-400 text-center">No Img</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">{match.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><Calendar className="w-3 h-3"/> {new Date(match.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> {match.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
