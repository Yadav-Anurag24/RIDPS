"use client";

import { useEffect, useMemo, useState } from "react";
import { geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import {
  Activity,
  AlertTriangle,
  Globe,
  Minus,
  Plus,
  Radar,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useThreatStream, ThreatEvent } from "@/lib/useThreatStream";

type MarkerPoint = {
  id: string;
  coordinates: [number, number];
  threat: ThreatEvent;
};

const REGION_BUCKETS = [
  "North America",
  "Europe",
  "East Asia",
  "South America",
  "Middle East / Africa",
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function ipToCoordinates(ip: string): [number, number] {
  const hash = hashString(ip);
  const lng = ((hash % 36000) / 100) - 180;
  const lat = (((hash >> 8) % 14000) / 100) - 70;
  return [lng, lat];
}

function getRegionFromIp(ip: string) {
  const firstOctet = Number.parseInt(ip.split(".")[0] || "0", 10);
  if (!Number.isFinite(firstOctet)) return "Unknown";
  if (firstOctet <= 49) return "North America";
  if (firstOctet <= 99) return "Europe";
  if (firstOctet <= 149) return "East Asia";
  if (firstOctet <= 199) return "South America";
  return "Middle East / Africa";
}

function toneByRisk(risk: number) {
  if (risk >= 0.9) return "#fb7185";
  if (risk >= 0.75) return "#f59e0b";
  return "#22d3ee";
}

function routeCurvePath(start: [number, number], end: [number, number]) {
  const [x1, y1] = start;
  const [x2, y2] = end;
  const cx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.18;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export default function DashboardPage() {
  const { connected, chartData, threats, totalProcessed, highRiskCount, avgRisk } = useThreatStream();
  const [countries, setCountries] = useState<Array<Feature<Geometry>>>([]);
  const [zoom, setZoom] = useState(1);
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadMap() {
      try {
        const res = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
        const geo = (await res.json()) as FeatureCollection<Geometry>;
        if (mounted) {
          setCountries(geo.features || []);
        }
      } catch {
        setCountries([]);
      }
    }

    loadMap();

    return () => {
      mounted = false;
    };
  }, []);

  const regionDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    REGION_BUCKETS.forEach((region) => counts.set(region, 0));

    threats.forEach((threat) => {
      const region = getRegionFromIp(threat.src_ip);
      counts.set(region, (counts.get(region) || 0) + 1);
    });

    const total = threats.length || 1;
    return REGION_BUCKETS.map((region) => {
      const value = counts.get(region) || 0;
      const percent = Math.round((value / total) * 100);
      return {
        label: region,
        value: percent,
      };
    });
  }, [threats]);

  const markers = useMemo<MarkerPoint[]>(() => {
    return threats.slice(0, 30).map((threat, idx) => {
      const hasGeo = Number.isFinite(threat.longitude) && Number.isFinite(threat.latitude);
      const coordinates: [number, number] = hasGeo
        ? [Number(threat.longitude), Number(threat.latitude)]
        : ipToCoordinates(threat.src_ip);

      return {
        id: `${threat.src_ip}-${idx}`,
        coordinates,
        threat,
      };
    });
  }, [threats]);

  const burstBars = useMemo(
    () =>
      chartData.slice(-28).map((point, idx) => ({
        id: `${point.time}-${idx}`,
        height: Math.max(8, Math.min(100, point.rps * 12 + 8)),
        value: point.rps,
      })),
    [chartData]
  );

  const mapWidth = 1000;
  const mapHeight = 520;
  const projection = useMemo(
    () => geoNaturalEarth1().scale(165).translate([mapWidth / 2, mapHeight / 2]),
    []
  );
  const pathGenerator = useMemo(() => geoPath(projection), [projection]);
  const graticulePath = useMemo(() => pathGenerator(geoGraticule10()) || "", [pathGenerator]);

  const routeSweeps = useMemo(() => {
    return threats.slice(0, 14).flatMap((threat, idx) => {
      const srcCoordinates = Number.isFinite(threat.longitude) && Number.isFinite(threat.latitude)
        ? [Number(threat.longitude), Number(threat.latitude)] as [number, number]
        : ipToCoordinates(threat.src_ip);

      const dstCoordinates = ipToCoordinates(threat.dst_ip || `node-${idx}`);
      const start = projection(srcCoordinates);
      const end = projection(dstCoordinates);
      if (!start || !end) return [];

      return [{
        id: `${threat.src_ip}-${threat.dst_ip}-${idx}`,
        d: routeCurvePath([start[0], start[1]], [end[0], end[1]]),
        risk: threat.risk_score,
      }];
    });
  }, [projection, threats]);

  const topOrigins = useMemo(() => {
    const counts = new Map<string, number>();
    threats.forEach((threat) => {
      counts.set(threat.src_ip, (counts.get(threat.src_ip) || 0) + 1);
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ip, count]) => ({ ip, count }));
  }, [threats]);

  const latestThreat = threats[0];
  const latestRps = chartData[chartData.length - 1]?.rps ?? 0;
  const peakRps = chartData.reduce((max, point) => Math.max(max, point.rps), 0);
  const burstState = latestRps >= 8 ? "High burst" : latestRps >= 3 ? "Moderate" : "Calm";
  const geoSpread = regionDistribution.filter((region) => region.value > 0).length;
  const criticalRatio = totalProcessed > 0 ? (highRiskCount / totalProcessed) * 100 : 0;
  const defenseReadiness = Math.max(0, Math.round(100 - avgRisk * 52 - latestRps * 3));
  const activeMarkers = markers.length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-r from-[#0b0f12] via-[#0b0b0b] to-[#13120f] p-4">
        <div className="absolute -left-10 top-0 h-20 w-20 rounded-full bg-cyan-500/20 blur-2xl" />
        <div className="absolute right-0 top-0 h-16 w-28 bg-gradient-to-l from-amber-400/15 to-transparent" />
        <div className="relative grid gap-3 text-xs uppercase tracking-[0.18em] text-zinc-300 md:grid-cols-4">
          <div className="rounded-xl border border-cyan-400/25 bg-black/40 px-3 py-2">
            <p className="text-zinc-500">Node Link</p>
            <p className="mt-1 text-cyan-200">{connected ? "Secure Tunnel Active" : "Reconnecting"}</p>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-black/40 px-3 py-2">
            <p className="text-zinc-500">Threat Velocity</p>
            <p className="mt-1 text-zinc-100">{latestRps} pkt/s realtime</p>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-black/40 px-3 py-2">
            <p className="text-zinc-500">Geo Spread</p>
            <p className="mt-1 text-zinc-100">{geoSpread} active zones</p>
          </div>
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2">
            <p className="text-zinc-500">Defense Readiness</p>
            <p className="mt-1 text-emerald-200">{defenseReadiness}% stable</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="group rounded-2xl border border-zinc-800/80 bg-[#0e0e0e] p-5 transition hover:border-cyan-400/40 hover:bg-[#0f1316]">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Total Threats</p>
          <p className="mt-2 text-4xl font-semibold text-white">{totalProcessed}</p>
          <div className="mt-3 h-1.5 rounded-full bg-zinc-900">
            <div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min(100, totalProcessed / 2)}%` }} />
          </div>
        </div>
        <div className="group rounded-2xl border border-zinc-800/80 bg-[#0e0e0e] p-5 transition hover:border-rose-400/40 hover:bg-[#141012]">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Critical Alerts</p>
          <p className="mt-2 text-4xl font-semibold text-white">{highRiskCount}</p>
          <div className="mt-3 h-1.5 rounded-full bg-zinc-900">
            <div className="h-full rounded-full bg-rose-400" style={{ width: `${Math.min(100, criticalRatio)}%` }} />
          </div>
        </div>
        <div className="group rounded-2xl border border-zinc-800/80 bg-[#0e0e0e] p-5 transition hover:border-amber-300/40 hover:bg-[#14130f]">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Average Risk</p>
          <p className="mt-2 text-4xl font-semibold text-white">{avgRisk.toFixed(2)}</p>
          <div className="mt-3 h-1.5 rounded-full bg-zinc-900">
            <div className="h-full rounded-full bg-amber-300" style={{ width: `${Math.min(100, avgRisk * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800/80 bg-[#0e0e0e] p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-zinc-300">
            <Activity size={16} className="text-cyan-300" />
            <span className="text-sm uppercase tracking-[0.2em]">Live Traffic Pulse</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-black px-4 py-2 text-sm text-zinc-200">
            {connected ? <Wifi size={14} className="text-emerald-300" /> : <WifiOff size={14} className="text-zinc-500" />}
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">Current Throughput</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-200">{latestRps} pkt/s</p>
          </div>
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200/80">Peak Last 60s</p>
            <p className="mt-1 text-2xl font-semibold text-sky-100">{peakRps} pkt/s</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/80">Burst State</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{burstState}</p>
          </div>
        </div>

        <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-black/70 p-2">
          <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cyan-500/10 to-transparent" />
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="80%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(113,113,122,0.28)" strokeDasharray="3 7" />
              <XAxis dataKey="time" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#080808",
                  border: "1px solid rgba(161,161,170,0.4)",
                  borderRadius: "12px",
                  color: "#f4f4f5",
                }}
              />

              <ReferenceLine y={8} stroke="#fb7185" strokeDasharray="4 4" strokeOpacity={0.5} />
              <Area type="monotone" dataKey="rps" stroke="#22d3ee" strokeWidth={2.8} fill="url(#pulseFill)" name="Threats/sec" />
              <Line type="monotone" dataKey="cumulative" stroke="#38bdf8" strokeWidth={2.2} dot={false} name="Cumulative" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-zinc-700/80 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-zinc-300">
            60s live window
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-md border border-zinc-700/80 bg-black/65 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Threats/sec
            <span className="ml-2 h-2 w-2 rounded-full bg-sky-300" />
            Cumulative
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-800/90 bg-black/45 p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            <span>Burst Timeline</span>
            <span>{burstBars.length} samples</span>
          </div>
          <div className="flex h-16 items-end gap-1">
            {burstBars.map((bar) => (
              <div
                key={bar.id}
                className="flex-1 rounded-sm bg-gradient-to-t from-cyan-700/80 via-cyan-400/70 to-cyan-200/90"
                style={{ height: `${bar.height}%` }}
                title={`${bar.value} pkt/s`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-3xl border border-zinc-800/80 bg-[#0e0e0e] p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Global Threat Map</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Real Interactive Map</h3>
            </div>
            <div className="hidden rounded-lg border border-zinc-700/80 bg-black/60 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-zinc-300 md:block">
              {activeMarkers} active markers
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                className="rounded-lg border border-zinc-700 bg-black p-2 text-zinc-300 hover:text-white"
                aria-label="Zoom out"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                className="rounded-lg border border-zinc-700 bg-black p-2 text-zinc-300 hover:text-white"
                aria-label="Zoom in"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="rounded-lg border border-zinc-700 bg-black px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
            <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="h-[520px] w-full">
              <defs>
                <radialGradient id="oceanGlow" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#072132" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#050505" stopOpacity={1} />
                </radialGradient>
              </defs>
              <rect width={mapWidth} height={mapHeight} fill="url(#oceanGlow)" />
              <g transform={`translate(${mapWidth / 2} ${mapHeight / 2}) scale(${zoom}) translate(${-mapWidth / 2} ${-mapHeight / 2})`}>
                <path d={graticulePath} fill="none" stroke="#123247" strokeOpacity={0.35} strokeWidth={0.7} />
                {countries.map((country, idx) => (
                  <path
                    key={`country-${idx}`}
                    d={pathGenerator(country) || ""}
                    fill="#111111"
                    stroke="#27272a"
                    strokeWidth={0.6}
                  />
                ))}

                {routeSweeps.map((route) => (
                  <path
                    key={route.id}
                    d={route.d}
                    fill="none"
                    stroke={toneByRisk(route.risk)}
                    strokeWidth={1.3}
                    strokeOpacity={0.5}
                    strokeDasharray="5 6"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;-60" dur="2.1s" repeatCount="indefinite" />
                  </path>
                ))}

                {markers.map((marker) => {
                  const point = projection(marker.coordinates);
                  if (!point) return null;
                  const [x, y] = point;
                  const color = toneByRisk(marker.threat.risk_score);
                  return (
                    <g
                      key={marker.id}
                      onClick={() => setSelectedThreat(marker.threat)}
                      className="cursor-pointer"
                    >
                      <circle cx={x} cy={y} r={9} fill={color} fillOpacity={0.18} />
                      <circle cx={x} cy={y} r={5} fill={color} />
                      <circle cx={x} cy={y} r={5} fill="none" stroke={color} strokeWidth={1.4} opacity={0.75}>
                        <animate attributeName="r" values="5;13" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.75;0" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-zinc-800/80 bg-[#0e0e0e] p-5">
            <div className="mb-4 flex items-center gap-2 text-zinc-300">
              <Globe size={16} className="text-cyan-300" />
              <p className="text-xs uppercase tracking-[0.22em]">Region Distribution</p>
            </div>
            <div className="space-y-4">
              {regionDistribution.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm text-zinc-200">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-900">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800/80 bg-[#0e0e0e] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300">
                <Radar size={16} className="text-cyan-300" />
                <p className="text-xs uppercase tracking-[0.22em]">Top Origins</p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">Live rank</span>
            </div>

            <div className="space-y-2">
              {topOrigins.map((origin, idx) => (
                <div key={origin.ip} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/35 px-3 py-2 text-sm">
                  <span className="font-mono text-zinc-300">#{idx + 1} {origin.ip}</span>
                  <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs text-cyan-200">{origin.count}</span>
                </div>
              ))}
              {topOrigins.length === 0 && <p className="text-sm text-zinc-400">No active origin nodes yet.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800/80 bg-[#0e0e0e] p-5">
            <div className="mb-4 flex items-center gap-2 text-zinc-300">
              <Radar size={16} className="text-cyan-300" />
              <p className="text-xs uppercase tracking-[0.22em]">Map Selection</p>
            </div>

            {selectedThreat ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Anomaly</p>
                  <p className="mt-1 text-zinc-100">{selectedThreat.anomaly_type}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Source</p>
                  <p className="mt-1 font-mono text-zinc-100">{selectedThreat.src_ip}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Risk</p>
                  <p className="mt-1 font-mono text-zinc-100">{selectedThreat.risk_score.toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-black/45 p-3 text-zinc-200">
                  {selectedThreat.ai_insight}
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">Click any map marker to inspect live threat details.</p>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-800/80 bg-[#0e0e0e] p-5">
            <div className="mb-4 flex items-center gap-2 text-zinc-300">
              <ShieldCheck size={16} className="text-emerald-300" />
              <p className="text-xs uppercase tracking-[0.22em]">Latest Insight</p>
            </div>
            <p className="text-sm leading-6 text-zinc-300">
              {latestThreat
                ? latestThreat.ai_insight
                : "No incidents received yet. Start backend and Python sensor to see live intelligence."}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800/80 bg-[#0e0e0e] p-5">
            <div className="mb-3 flex items-center gap-2 text-zinc-300">
              <AlertTriangle size={16} className="text-rose-300" />
              <p className="text-xs uppercase tracking-[0.22em]">Recent Incidents</p>
            </div>
            <div className="space-y-3">
              {threats.slice(0, 4).map((item, idx) => (
                <div key={`${item.src_ip}-${item.timestamp}-${idx}`} className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                  <p className="text-sm font-semibold text-zinc-100">{item.anomaly_type}</p>
                  <p className="mt-1 font-mono text-xs text-zinc-400">{item.src_ip}</p>
                </div>
              ))}
              {threats.length === 0 && <p className="text-sm text-zinc-400">No live incidents yet.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
