import './globals.css';
import { Shield, Map, AlertTriangle, Bell, Radio } from 'lucide-react';
import Link from 'next/link';
import { Orbitron, Rajdhani } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700'] });
const rajdhani = Rajdhani({ subsets: ['latin'], variable: '--font-ui', weight: ['400', '500', '600', '700'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${rajdhani.variable} flex h-screen overflow-hidden bg-[#050505] text-zinc-200 font-[var(--font-ui)]`}>
        <aside className="hidden w-64 border-r border-zinc-800/70 bg-[#0f0f0f]/90 backdrop-blur lg:flex lg:flex-col">
          <div className="border-b border-zinc-800/70 p-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
              <div>
                <h2 className="font-[var(--font-display)] text-white font-bold tracking-wide">Control Center</h2>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400">Live Monitoring</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <Link href="/" className="flex items-center gap-3 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-cyan-200">
              <Map size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link href="/incidents" className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-800/70 hover:text-white">
              <AlertTriangle size={18} />
              <span className="text-sm">Incidents</span>
            </Link>
            <Link href="/live-traffic" className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-800/70 hover:text-white">
              <Radio size={18} />
              <span className="text-sm">Live Traffic</span>
            </Link>
          </nav>

          <div className="mt-auto border-t border-zinc-800/70 p-5">
            <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">Operation Mode</p>
              <p className="mt-2 text-base font-semibold text-white">Autonomous Defense</p>
            </div>
          </div>
        </aside>

        <main className="relative flex flex-1 flex-col overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-zinc-800/70 bg-[#050505]/90 px-5 backdrop-blur md:px-8">
            <div className="flex items-center gap-4 md:gap-8">
              <h1 className="font-[var(--font-display)] text-xl font-bold leading-tight text-white md:text-2xl">
                CyberWar
                <br className="hidden md:block" />
                <span className="md:hidden"> </span>
                Room
              </h1>
              <nav className="hidden gap-6 text-xs font-semibold tracking-widest text-zinc-300 md:flex">
                <Link href="/" className="text-white hover:text-white">DASHBOARD</Link>
                <Link href="/incidents" className="hover:text-white">INCIDENTS</Link>
                <Link href="/live-traffic" className="hover:text-white">LIVE TRAFFIC</Link>
              </nav>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
              <div className="hidden items-center gap-2 rounded-full border border-zinc-800/70 bg-zinc-900 px-3 py-1 text-xs text-zinc-300 md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Monitoring
              </div>
              <Shield size={20} className="text-zinc-300" />
              <Bell size={20} className="text-zinc-300" />
              <button className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold tracking-wider text-white transition-all hover:bg-rose-700 md:px-6 md:text-sm">
                LOCKDOWN
              </button>
            </div>
          </header>

          <div className="p-5 md:p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
