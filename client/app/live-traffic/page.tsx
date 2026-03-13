"use client";

import { Activity, Wifi, WifiOff } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useThreatStream } from "@/lib/useThreatStream";

export default function LiveTrafficPage() {
  const { connected, chartData, totalProcessed, highRiskCount, avgRisk } = useThreatStream();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-700/40 bg-slate-900/65 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Traffic Telemetry</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Live Threat Throughput</h2>
            <p className="mt-2 text-sm text-slate-300">
              Real-time anomaly throughput and cumulative event growth.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/40 bg-slate-900 px-4 py-2 text-sm text-slate-200">
            {connected ? <Wifi size={14} className="text-emerald-300" /> : <WifiOff size={14} className="text-slate-500" />}
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/65 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Processed</p>
          <p className="mt-2 text-4xl font-semibold text-white">{totalProcessed}</p>
        </div>
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/65 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Critical Alerts</p>
          <p className="mt-2 text-4xl font-semibold text-white">{highRiskCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/65 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg Risk</p>
          <p className="mt-2 text-4xl font-semibold text-white">{avgRisk.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-700/40 bg-slate-900/65 p-4 md:p-6">
        <div className="mb-4 flex items-center gap-3 text-slate-300">
          <Activity size={16} className="text-cyan-200" />
          <span className="text-sm uppercase tracking-[0.2em]">Threats Per Second</span>
        </div>

        <div className="h-[420px] w-full">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="4 6" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(148,163,184,0.35)",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                }}
              />
              <Line type="monotone" dataKey="rps" stroke="#22d3ee" strokeWidth={3} dot={false} name="Threats/sec" />
              <Line type="monotone" dataKey="cumulative" stroke="#38bdf8" strokeWidth={2.5} dot={false} name="Cumulative" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
