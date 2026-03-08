"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ImagePlus, MapPin, Calendar, FileText, Tag, Loader2 } from "lucide-react";

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();
  const typeParam = params.type as string; // 'lost' or 'found'
  const isLost = typeParam === "lost";
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/signin");
    },
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = ["Electronics", "Keys", "Clothing", "Books", "Other", "Cards"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: isLost ? "LOST" : "FOUND",
          title,
          category,
          description,
          location,
          date,
          imageUrl: imagePreview,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/item/${data.id}`);
        router.refresh();
      } else {
        alert("Failed to create listing.");
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Report a {isLost ? <span className="text-rose-500">Lost</span> : <span className="text-teal-500">Found</span>} Item
        </h1>
        <p className="text-gray-500 mt-2">
          {isLost 
            ? "Provide details about what you lost so others can help you find it." 
            : "Thanks for helping out! Provide details so the owner can claim it."}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:bg-gray-50 transition cursor-pointer relative group">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative mx-auto w-48 h-48 rounded-xl overflow-hidden shadow-sm">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <p className="text-white text-sm font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 px-4 py-3 sm:text-sm border-gray-300 rounded-xl"
                  placeholder="e.g. Blue Hydroflask"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 px-4 py-3 sm:text-sm border-gray-300 rounded-xl bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isLost ? 'Location Last Seen' : 'Location Found'}</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 px-4 py-3 sm:text-sm border-gray-300 rounded-xl"
                  placeholder="e.g. Library 2nd Floor"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date {isLost ? 'Lost' : 'Found'}</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 px-4 py-3 sm:text-sm border-gray-300 rounded-xl bg-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Identifying Features</label>
            <div className="mt-1">
              <textarea
                required
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 sm:text-sm border border-gray-300 rounded-xl"
                placeholder="Any scratches, stickers, or unique markings?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-3 px-8 border border-transparent shadow-md text-sm font-bold rounded-xl text-white ${isLost ? 'bg-rose-500 hover:bg-rose-600' : 'bg-teal-500 hover:bg-teal-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-70`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Post ${isLost ? 'Lost' : 'Found'} Item`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
