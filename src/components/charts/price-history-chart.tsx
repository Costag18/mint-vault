"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils/format";

type SnapshotData = { date: string; price: number };

export function PriceHistoryChart({ data }: { data: SnapshotData[] }) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-outline">
        No price history available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fabd00" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#fabd00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: "#8c919e", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#8c919e", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "#1f2020",
            border: "1px solid #424752",
            borderRadius: "8px",
            color: "#e4e2e1",
          }}
          formatter={(value) => [formatCurrency(value as number), "Price"]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#fabd00"
          strokeWidth={3}
          fill="url(#priceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
