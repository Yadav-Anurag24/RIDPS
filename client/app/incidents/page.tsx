"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { useThreatStream } from "@/lib/useThreatStream";

function tone(risk: number) {
  if (risk >= 0.9) return "text-rose-200 border-rose-300/30 bg-rose-500/10";
  if (risk >= 0.75) return "text-amber-200 border-amber-300/30 bg-amber-500/10";
  return "text-cyan-200 border-cyan-300/30 bg-cyan-500/10";
}

export default function IncidentsPage() {
  const { threats, connected, totalProcessed } = useThreatStream();
  const [query, setQuery] = useState("");
  const [minRisk, setMinRisk] = useState(0.7);

  const filtered = useMemo(() => {
    return threats.filter((item) => {
      const matchesRisk = item.risk_score >= minRisk;
      const source = `${item.src_ip} ${item.dst_ip} ${item.anomaly_type}`.toLowerCase();
      const matchesQuery = source.includes(query.toLowerCase());
      return matchesRisk && matchesQuery;
    });
  }, [threats, query, minRisk]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-700/40 bg-slate-900/65 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Incident Console</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Live Incident Feed</h2>
            <p className="mt-2 text-sm text-slate-300">
              {connected ? "Live stream active" : "Waiting for stream"} · Total processed: {totalProcessed}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search IP or anomaly"
                className="rounded-xl border border-slate-700/40 bg-slate-900 px-9 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500/60"
              />
            </div>

            <select
              value={minRisk}
              onChange={(e) => setMinRisk(Number(e.target.value))}
              className="rounded-xl border border-slate-700/40 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500/60"
            >
              <option value={0.5}>Risk 0.50+</option>
              <option value={0.7}>Risk 0.70+</option>
              <option value={0.9}>Risk 0.90+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/55 p-5 text-sm text-slate-300">
            No incidents match current filters.
          </div>
        )}

        {filtered.map((item, index) => (
          <div
            key={`${item.src_ip}-${item.timestamp}-${index}`}
            className="rounded-2xl border border-slate-700/40 bg-slate-900/65 p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone(item.risk_score)}`}>
                <AlertTriangle size={12} />
                {item.anomaly_type}
              </div>
              <span className="font-mono text-xs text-slate-400">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Source IP</p>
                <p className="mt-1 font-mono text-slate-100">{item.src_ip}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Target IP</p>
                <p className="mt-1 font-mono text-slate-100">{item.dst_ip}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Risk Score</p>
                <p className="mt-1 font-mono text-slate-100">{item.risk_score.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-700/40 bg-slate-950/55 p-3 text-sm text-slate-200">
              {item.ai_insight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
