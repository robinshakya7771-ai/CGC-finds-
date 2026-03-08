"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Send, ArrowLeft, Package, UserCircle } from "lucide-react";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
  sender: {
    name: string;
    image: string | null;
  }
};

export default function ChatClient({ 
  chatId, 
  item, 
  otherUser, 
  currentUserId 
}: { 
  chatId: string;
  item: any;
  otherUser: any;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Simple polling every 3 seconds for new messages
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const tempText = inputText;
    setInputText("");

    // Optimistic UI update
    const tempMsg: Message = {
      id: Date.now().toString(),
      text: tempText,
      createdAt: new Date().toISOString(),
      senderId: currentUserId,
      sender: { name: "You", image: null }
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tempText }),
      });
      if (!res.ok) {
        // Handle error, maybe revert optimistic update
        console.error("Failed to send");
      } else {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 w-full h-[calc(100vh-80px)] flex flex-col">
      <Link href="/profile" className="inline-flex items-center gap-2 text-indigo-600 font-medium mb-4 hover:text-indigo-800 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-grow">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {otherUser.name?.[0]?.toUpperCase() || <UserCircle />}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">{otherUser.name}</h2>
              <p className="text-xs text-green-500 font-medium tracking-wide">● Active now</p>
            </div>
          </div>
          <Link href={`/item/${item.id}`} className="hidden sm:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition">
            <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-shrink-0">
               {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 m-1.5 text-gray-400" />}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Regarding</p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{item.title}</p>
            </div>
          </Link>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          <div className="text-center my-4">
            <span className="bg-gray-200/50 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
              Never share personal passwords or exact dorm numbers.
            </span>
          </div>
          
          {loading ? (
             <div className="text-center text-gray-400 text-sm mt-10 animate-pulse">Loading messages...</div>
          ) : messages.length === 0 ? (
             <div className="text-center text-gray-500 text-sm mt-10">
               <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
               <p>No messages yet. Send a message to start coordinating!</p>
             </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex max-w-[80%] ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mr-2 flex-shrink-0 mt-auto">
                      {msg.sender?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm shadow-sm'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-500/20"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
