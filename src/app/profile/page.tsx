import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, MessageSquare, ChevronRight, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      items: {
        orderBy: { createdAt: 'desc' }
      },
      chats: {
        include: {
          item: true,
          participants: {
            where: {
              id: { not: session.user.id }
            },
            select: { name: true, image: true }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { updatedAt: 'desc' }
      }
    }
  });

  if (!user) return redirect("/auth/signin");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Profile Info */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center sticky top-24">
          <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500 mb-6">{user.email}</p>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
            <div>
              <p className="text-2xl font-bold text-gray-900">{user.items.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{user.chats.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Chats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow space-y-8">
        
        {/* Active Chats */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
            Your Messages
          </h3>
          
          {user.chats.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-gray-500">
              No active conversations yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {user.chats.map((chat) => {
                const otherPerson = chat.participants[0];
                const lastMsg = chat.messages[0];
                return (
                  <Link href={`/chat/${chat.id}`} key={chat.id} className="block group">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {chat.item.imageUrl ? (
                          <img src={chat.item.imageUrl} alt="" className="w-full h-full object-cover opacity-50" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                        <span className="absolute inset-0 bg-black/10 flex items-center justify-center text-white font-bold text-lg drop-shadow-md">
                          {otherPerson?.name?.[0] || '?'}
                        </span>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition truncate">
                            {otherPerson?.name || "Unknown User"} 
                            <span className="text-xs font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">Re: {chat.item.title}</span>
                          </h4>
                          {lastMsg && (
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                              {new Date(lastMsg.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {lastMsg ? lastMsg.text : <span className="italic">No messages yet</span>}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Your Listed Items */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-500" />
            Your Listings
          </h3>

          {user.items.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-gray-500">
              You haven't reported any items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.items.map(item => (
                <Link href={`/item/${item.id}`} key={item.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
                   <div className="flex h-32">
                     <div className="w-32 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center p-2 bg-gray-50 pattern-dots">No Img</div>
                        )}
                        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded shadow-sm text-white ${item.type === 'LOST' ? 'bg-rose-500' : 'bg-teal-500'}`}>
                          {item.type}
                        </span>
                     </div>
                     <div className="p-4 flex flex-col justify-center flex-grow min-w-0">
                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition truncate mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 truncate"><Calendar className="w-3 h-3"/>{new Date(item.date).toLocaleDateString()}</p>
                        <div className="mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.status}</div>
                     </div>
                   </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
