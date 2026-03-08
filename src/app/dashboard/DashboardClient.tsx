"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, PlusCircle, MapPin, Calendar, Tag } from "lucide-react";

export default function DashboardClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL, LOST, FOUND
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const categories = ["ALL", "Electronics", "Keys", "Clothing", "Books", "Other", "Cards"];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Campus Feed</h1>
          <p className="text-gray-500 mt-1">Browse recently lost and found items across campus.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/report/lost" className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-full font-medium shadow-md shadow-rose-500/20 hover:bg-rose-600 transition">
            <PlusCircle className="w-5 h-5" />
            Report Lost
          </Link>
          <Link href="/report/found" className="flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-full font-medium shadow-md shadow-teal-500/20 hover:bg-teal-600 transition">
            <PlusCircle className="w-5 h-5" />
            Report Found
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition bg-gray-50 focus:bg-white"
            placeholder="Search items by keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl bg-gray-50"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl bg-gray-50"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>)}
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
            <Search className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Link href={`/item/${item.id}`} key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition duration-300 block flex flex-col h-full">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 pattern-dots">
                    No image provided
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${item.type === 'LOST' ? 'bg-rose-500/90 text-white' : 'bg-teal-500/90 text-white'}`}>
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{item.description}</p>
                <div className="mt-auto space-y-2 text-xs font-medium text-gray-500 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-1.5 hide-scrollbar truncate">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
