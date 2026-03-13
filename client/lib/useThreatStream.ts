"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

export type ThreatEvent = {
  src_ip: string;
  dst_ip: string;
  anomaly_type: string;
  risk_score: number;
  ai_insight: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
};

export type ChartPoint = {
  time: string;
  rps: number;
  cumulative: number;
};

function formatClock(date: Date) {
  return date.toLocaleTimeString([], {
    hour12: false,
    minute: "2-digit",
    second: "2-digit",
  });
}

export function useThreatStream() {
  const [connected, setConnected] = useState(false);
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const receivedAtRef = useRef<number[]>([]);
  const totalProcessedRef = useRef(0);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const socket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 20,
      reconnectionDelay: 1500,
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("NEW_THREAT", (payload: Partial<ThreatEvent> & Record<string, unknown>) => {
      const srcIp =
        typeof payload.src_ip === "string"
          ? payload.src_ip
          : typeof payload.source_ip === "string"
            ? payload.source_ip
            : "unknown";

      const dstIp =
        typeof payload.dst_ip === "string"
          ? payload.dst_ip
          : typeof payload.destination_ip === "string"
            ? payload.destination_ip
            : "internal-node";

      const anomalyType =
        typeof payload.anomaly_type === "string"
          ? payload.anomaly_type
          : typeof payload.threat_label === "string"
            ? payload.threat_label
            : "UNKNOWN";

      const riskScoreRaw =
        typeof payload.risk_score === "number"
          ? payload.risk_score
          : typeof payload.threat_score === "number"
            ? payload.threat_score / 100
            : NaN;

      const event: ThreatEvent = {
        src_ip: srcIp,
        dst_ip: dstIp,
        anomaly_type: anomalyType,
        risk_score: Number.isFinite(riskScoreRaw) ? Number(riskScoreRaw) : 0.5,
        ai_insight: payload.ai_insight || "Suspicious network activity detected.",
        timestamp: payload.timestamp || new Date().toISOString(),
        latitude:
          typeof payload.latitude === "number"
            ? payload.latitude
            : typeof payload.lat === "number"
              ? payload.lat
              : undefined,
        longitude:
          typeof payload.longitude === "number"
            ? payload.longitude
            : typeof payload.lon === "number"
              ? payload.lon
              : typeof payload.lng === "number"
                ? payload.lng
                : undefined,
      };

      receivedAtRef.current.push(Date.now());
      if (receivedAtRef.current.length > 600) {
        receivedAtRef.current = receivedAtRef.current.slice(-600);
      }

      totalProcessedRef.current += 1;
      setTotalProcessed(totalProcessedRef.current);
      setThreats((prev) => [event, ...prev].slice(0, 200));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();
      const oneSecondWindow = now - 1000;

      receivedAtRef.current = receivedAtRef.current.filter((ts) => ts >= now - 60_000);
      const rps = receivedAtRef.current.filter((ts) => ts >= oneSecondWindow).length;

      setChartData((prev) => {
        const next = [
          ...prev,
          {
            time: formatClock(new Date(now)),
            rps,
            cumulative: totalProcessedRef.current,
          },
        ];
        return next.slice(-60);
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const highRiskCount = useMemo(
    () => threats.filter((threat) => threat.risk_score >= 0.9).length,
    [threats]
  );

  const avgRisk = useMemo(() => {
    if (threats.length === 0) {
      return 0;
    }

    const sum = threats.reduce((acc, threat) => acc + threat.risk_score, 0);
    return sum / threats.length;
  }, [threats]);

  return {
    connected,
    threats,
    totalProcessed,
    chartData,
    highRiskCount,
    avgRisk,
  };
}
