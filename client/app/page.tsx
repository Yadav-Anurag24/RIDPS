"use client";

import { AlertTriangle, ShieldCheck, Skull } from "lucide-react";

const geoDistribution = [
  { label: "North America", value: 42, color: "bg-lime-400", text: "text-lime-400" },
  { label: "East Asia", value: 38, color: "bg-rose-300", text: "text-rose-300" },
  { label: "European Union", value: 15, color: "bg-zinc-200", text: "text-zinc-200" },
];

const breachOrigins = [
  {
    title: "DDOS ATTEMPT",
    time: "02:44:12",
    source: "104.22.4.15 (RU)",
    target: "WEB-PROD-04 (US)",
    accent: "bg-rose-300",
    text: "text-rose-300",
  },
  {
    title: "SQL INJECTION",
    time: "02:41:05",
    source: "185.191.171.3 (CN)",
    target: "AUTH-DB-MAIN (FR)",
    accent: "bg-orange-300",
    text: "text-orange-300",
  },
  {
    title: "PORT SCAN",
    time: "02:39:58",
    source: "13.58.10.111 (US)",
    target: "DMZ-LOADBAL-01 (UK)",
    accent: "bg-cyan-300",
    text: "text-cyan-300",
  },
];

const attackRoutes = [
  {
    id: "route-alpha",
    path: "M330 280 C 640 200, 900 290, 1290 430",
    source: { x: 330, y: 280, label: "TOKYO-09", align: "left" as const },
    target: { x: 1290, y: 430, label: "WEB-EDGE-01", align: "right" as const },
    stroke: "#d10f2f",
  },
  {
    id: "route-beta",
    path: "M450 560 C 700 350, 990 330, 1330 560",
    source: { x: 450, y: 560, label: "MOSCOW-V4", align: "left" as const },
    target: { x: 1330, y: 560, label: "DC-CORE-3", align: "right" as const },
    stroke: "#ff294d",
  },
  {
    id: "route-gamma",
    path: "M840 760 C 1020 610, 1140 480, 1320 350",
    source: { x: 840, y: 760, label: "SAO-PX-7", align: "left" as const },
    target: { x: 1320, y: 350, label: "PARIS-AUTH", align: "right" as const },
    stroke: "#67d8ff",
  },
];

function RouteLabel({
  x,
  y,
  label,
  align,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  align: "left" | "right";
  tone: string;
}) {
  const translate = align === "left" ? "-translate-x-full -translate-y-1/2" : "translate-x-3 -translate-y-1/2";

  return (
    <div
      className={`absolute z-20 rounded-sm border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-200 shadow-[0_0_18px_rgba(0,0,0,0.3)] ${translate}`}
      style={{ left: x, top: y }}
    >
      <span className={tone}>{label}</span>
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
  accent,
  glow,
}: {
  title: string;
  value: string;
  detail: string;
  accent: string;
  glow: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/6 bg-zinc-900/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur ${glow}`}>
      <div className={`mb-4 h-9 w-1 rounded-full ${accent}`} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">{title}</p>
      <p className="mt-2 text-5xl font-semibold tracking-tight text-white">{value}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-300">{detail}</span>
        <div className={`h-px flex-1 ${accent} opacity-70`} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="relative overflow-hidden rounded-[28px] border border-zinc-800/80 bg-[#111111] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(110,255,78,0.08),transparent_28%),radial-gradient(circle_at_72%_44%,rgba(255,255,255,0.06),transparent_36%),radial-gradient(circle_at_50%_78%,rgba(93,212,255,0.07),transparent_34%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:68px_68px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(3,7,18,0.42)_68%,rgba(3,7,18,0.82)_100%)]" />

        <div className="relative flex min-h-[820px] flex-col px-6 pb-6 pt-6 lg:px-8">
          <div className="mb-8 grid gap-4 lg:max-w-[430px] lg:grid-cols-2">
            <MetricCard
              title="Active Threats"
              value="2,481"
              detail="+12% vs last hr"
              accent="bg-rose-400"
              glow="shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_60px_rgba(255,88,120,0.06)]"
            />
            <MetricCard
              title="Secure Endpoints"
              value="94,002"
              detail="All sectors online"
              accent="bg-cyan-300"
              glow="shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_60px_rgba(34,211,238,0.06)]"
            />
          </div>

          <div className="relative flex-1 overflow-hidden rounded-[24px] border border-white/6 bg-[linear-gradient(180deg,rgba(14,14,16,0.35),rgba(7,7,8,0.78))]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_50%,rgba(255,255,255,0.06),transparent_22%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_48%)]" />

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1600 900"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f4f4f5" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#a1a1aa" stopOpacity="0.02" />
                </linearGradient>
                <radialGradient id="continentFill" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#fafafa" stopOpacity="0.09" />
                  <stop offset="100%" stopColor="#fafafa" stopOpacity="0.02" />
                </radialGradient>
              </defs>

              <g opacity="0.55">
                <path
                  d="M150 295 L290 250 L360 270 L398 315 L382 362 L335 392 L280 405 L218 390 L160 338 Z"
                  fill="url(#continentFill)"
                  stroke="url(#mapGlow)"
                  strokeWidth="2"
                />
                <path
                  d="M320 415 L352 445 L360 505 L338 585 L304 642 L274 620 L286 548 L278 476 Z"
                  fill="url(#continentFill)"
                  stroke="url(#mapGlow)"
                  strokeWidth="2"
                />
                <path
                  d="M664 260 L716 235 L776 246 L800 280 L780 304 L722 300 L682 326 L650 306 Z"
                  fill="url(#continentFill)"
                  stroke="url(#mapGlow)"
                  strokeWidth="2"
                />
                <path
                  d="M736 312 L792 332 L836 388 L826 502 L774 620 L728 578 L712 484 L692 400 Z"
                  fill="url(#continentFill)"
                  stroke="url(#mapGlow)"
                  strokeWidth="2"
                />
                <path
                  d="M824 236 L894 214 L1006 232 L1142 266 L1254 322 L1288 402 L1248 456 L1178 442 L1114 472 L1000 452 L930 398 L872 404 L822 360 Z"
                  fill="url(#continentFill)"
                  stroke="url(#mapGlow)"
                  strokeWidth="2"
                />
                <path
                  d="M1172 574 L1256 556 L1326 588 L1306 640 L1234 658 L1164 628 Z"
                  fill="url(#continentFill)"
                  stroke="url(#mapGlow)"
                  strokeWidth="2"
                />
              </g>

              {Array.from({ length: 120 }).map((_, index) => {
                const x = 120 + ((index * 89) % 1280);
                const y = 120 + ((index * 53) % 610);
                const radius = index % 7 === 0 ? 2.2 : 1.3;

                return <circle key={`node-${index}`} cx={x} cy={y} r={radius} fill="rgba(255,255,255,0.12)" />;
              })}

              <g opacity="0.78">
                {attackRoutes.map((route) => (
                  <path
                    key={route.id}
                    d={route.path}
                    stroke={route.stroke}
                    strokeWidth="3"
                    strokeDasharray="16 10"
                    strokeLinecap="round"
                  />
                ))}
              </g>

              <g>
                {attackRoutes.map((route) => (
                  <g key={`${route.id}-points`}>
                    <circle cx={route.source.x} cy={route.source.y} r="7" fill={route.stroke} />
                    <circle cx={route.source.x} cy={route.source.y} r="16" fill="none" stroke={route.stroke} strokeOpacity="0.3" />
                    <circle cx={route.target.x} cy={route.target.y} r="7" fill="#57ff4d" />
                    <circle cx={route.target.x} cy={route.target.y} r="18" fill="none" stroke="#57ff4d" strokeOpacity="0.28" />
                  </g>
                ))}
              </g>

              <g opacity="0.65">
                <circle cx="980" cy="520" r="82" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <circle cx="980" cy="520" r="36" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
                <path d="M980 420 L980 620" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <path d="M880 520 L1080 520" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
              </g>
            </svg>

            {attackRoutes.map((route) => (
              <div key={`${route.id}-labels`}>
                <RouteLabel x={route.source.x} y={route.source.y} label={route.source.label} align={route.source.align} tone="text-rose-200" />
                <RouteLabel x={route.target.x} y={route.target.y} label={route.target.label} align={route.target.align} tone="text-lime-300" />
              </div>
            ))}

            <div className="absolute left-8 top-8 max-w-sm rounded-2xl border border-white/8 bg-black/28 px-5 py-4 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.34em] text-zinc-400">Global Threat Map</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">Realtime Geo-Vector Overlay</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Satellite-mode tracing across hostile regions, hardened edges, and inbound breach corridors.
              </p>
            </div>

            <div className="absolute right-8 top-8 flex items-center gap-5 rounded-full border border-white/8 bg-black/28 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-300 backdrop-blur-md">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                Attack Source
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
                Target Node
              </span>
            </div>

            <div className="absolute bottom-8 left-8 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/36 p-2 backdrop-blur-md">
              <button className="rounded-xl bg-lime-400/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-lime-300 shadow-[inset_0_0_0_1px_rgba(163,230,53,0.24)]">
                Satellite
              </button>
              <button className="rounded-xl px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400 transition-colors hover:text-zinc-100">
                Topology
              </button>
              <button className="rounded-xl px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400 transition-colors hover:text-zinc-100">
                Heatmap
              </button>
              <button className="rounded-xl px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400 transition-colors hover:text-zinc-100">
                Filters
              </button>
            </div>

            <div className="absolute bottom-8 right-8 rounded-2xl border border-white/8 bg-black/36 px-5 py-4 text-right backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Tracked Sector</p>
              <p className="mt-2 text-sm font-medium text-zinc-200">LAT: 34.0522 N</p>
              <p className="text-sm font-medium text-zinc-200">LNG: 118.2437 W</p>
            </div>

            <div className="absolute left-[54%] top-[56%] -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="rounded-full border border-white/10 bg-black/25 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-400 backdrop-blur">
                Threat Hub
              </div>
              <p className="mt-5 text-[clamp(56px,7vw,110px)] font-extralight tracking-[0.1em] text-zinc-100/85">
                300x300
              </p>
            </div>
          </div>
        </div>
      </section>

      <aside className="flex flex-col gap-6">
        <div className="rounded-[28px] border border-zinc-800/80 bg-[#111111] p-6 shadow-[0_26px_70px_rgba(0,0,0,0.36)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.35em] text-zinc-400">Geographic Distribution</p>

          <div className="mt-8 space-y-7">
            {geoDistribution.map((item) => (
              <div key={item.label}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-lg text-zinc-200">{item.label}</span>
                  <span className={`text-2xl font-semibold ${item.text}`}>{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-zinc-800/80 bg-[#111111] p-6 shadow-[0_26px_70px_rgba(0,0,0,0.36)]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-rose-300" size={18} />
            <p className="text-[12px] font-semibold uppercase tracking-[0.35em] text-zinc-400">Active Breach Origins</p>
          </div>

          <div className="mt-6 space-y-4">
            {breachOrigins.map((item) => (
              <div key={item.title} className="relative overflow-hidden rounded-2xl border border-white/6 bg-zinc-950/90 p-5">
                <div className={`absolute inset-y-0 left-0 w-1 ${item.accent}`} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-xl font-semibold ${item.text}`}>{item.title}</p>
                    <p className="mt-3 text-sm uppercase tracking-[0.18em] text-zinc-400">Source</p>
                    <p className="font-mono text-base text-zinc-100">{item.source}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-zinc-400">Target</p>
                    <p className="font-mono text-base text-zinc-100">{item.target}</p>
                  </div>
                  <span className="font-mono text-sm text-zinc-500">{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full rounded-2xl border border-white/10 bg-transparent px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.28em] text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white">
            Export Threat Log
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[24px] border border-zinc-800/80 bg-[#111111] p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-lime-400" size={20} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">Defense Protocol</p>
                <p className="mt-1 text-2xl font-semibold text-white">OMEGA-7 ACTIVE</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-lime-300">
              <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
              Auto-mitigation engaged
            </div>
          </div>

          <div className="rounded-[24px] border border-zinc-800/80 bg-[#111111] p-5">
            <div className="flex items-center gap-3">
              <Skull className="text-rose-400" size={20} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">Threat Density</p>
                <p className="mt-1 text-2xl font-semibold text-white">7 Hot Zones</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Eastern corridors show the highest burst frequency over the last 30 minutes.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
