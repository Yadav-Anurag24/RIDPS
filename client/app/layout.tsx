import './globals.css';
import { Shield, Map, AlertTriangle, Network, Activity, Search, Bell } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-zinc-300 font-sans h-screen flex overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-[#111111] border-r border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <h2 className="text-white font-bold tracking-wide">System Secure</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Global Status</p>
                </div>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              <a href="#" className="flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 transition-colors">
                <Activity size={18} /> <span className="text-sm">Live Traffic</span>
              </a>
              <a href="#" className="flex items-center gap-3 bg-zinc-800/50 text-emerald-500 px-4 py-3 border-l-2 border-emerald-500 rounded-r-md">
                <Map size={18} /> <span className="text-sm font-medium">Geo-Map</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 transition-colors">
                <AlertTriangle size={18} /> <span className="text-sm">Incident Feed</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 transition-colors">
                <Network size={18} /> <span className="text-sm">Network Topology</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-zinc-400 hover:text-white px-4 py-3 transition-colors">
                <Activity size={18} /> <span className="text-sm">System Health</span>
              </a>
            </nav>
          </div>

          <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-white text-sm font-medium">Admin Avatar</p>
              <p className="text-xs text-zinc-500">Level 7 Clear</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main 
          className="flex-1 flex flex-col relative overflow-y-auto"
          style={{ 
            backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }}
        >
          {/* TOP NAVIGATION */}
          <header className="h-20 border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-white leading-tight">CyberWar<br/>Room</h1>
              <nav className="flex gap-6 text-xs font-semibold tracking-widest text-zinc-400">
                <a href="#" className="hover:text-white text-white">DASHBOARD</a>
                <a href="#" className="hover:text-white">LOGS</a>
                <a href="#" className="hover:text-white">THREAT INTEL</a>
                <a href="#" className="hover:text-white">SETTINGS</a>
              </nav>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search vectors..." 
                  className="bg-zinc-900 border border-zinc-800 rounded text-sm py-2 pl-10 pr-4 text-zinc-300 focus:outline-none focus:border-zinc-600"
                />
              </div>
              <Shield size={20} className="text-zinc-400" />
              <Bell size={20} className="text-zinc-400" />
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded text-sm tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all">
                MANUAL OVERRIDE
              </button>
            </div>
          </header>

          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
