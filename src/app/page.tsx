import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4 border border-indigo-100 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Now live for CGC Campus
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Find what you <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">lost</span>, <br className="hidden md:block"/>
          return what you <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">found</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          The official campus platform to reunite students with their belongings. 
          Report lost items or help a fellow student by returning found ones.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group">
            Browse Items
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/auth/signin" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-800 rounded-full font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2">
            Sign in to Report
          </Link>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mt-24">
        {[
          { icon: Search, title: "Smart Search", desc: "Easily filter by category, location, and date to find your item faster." },
          { icon: ShieldCheck, title: "Secure Chat", desc: "Coordinate returns safely with in-app messaging. No phone numbers needed." },
          { icon: HeartPulse, title: "Community Driven", desc: "Built by and for students to foster a helpful campus environment." }
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
