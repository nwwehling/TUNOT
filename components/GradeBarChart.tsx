"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GRADE_STEPS, type GradeDistribution } from "@/lib/types";

export default function GradeBarChart({ distribution }: { distribution: GradeDistribution }) {
  const data = GRADE_STEPS.map(g => ({ grade: g, count: distribution.grades[g] ?? 0 }));

  return (
    <div className="w-full h-80 border rule bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e5e5e0" vertical={false} />
          <XAxis
            dataKey="grade"
            tick={{ fill: "#6b6b6b", fontSize: 12, fontFamily: "Inter Tight" }}
            axisLine={{ stroke: "#d4d4d4" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b6b6b", fontSize: 12, fontFamily: "Inter Tight" }}
            axisLine={{ stroke: "#d4d4d4" }}
            tickLine={false}
            width={32}
          />
          <Tooltip
            cursor={{ fill: "#f0efea" }}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #d4d4d4",
              borderRadius: 0,
              fontFamily: "Inter Tight",
              fontSize: 12,
            }}
            labelFormatter={(l) => `Note ${l}`}
            formatter={(v: number) => [v, "Studierende"]}
          />
          <Bar dataKey="count" fill="#b1bd00" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
