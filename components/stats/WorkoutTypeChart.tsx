'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface WorkoutTypeChartProps {
  data: Array<{
    week: number;
    Tempo: number;
    Easy: number;
    Intervals: number;
    'Long Run': number;
  }>;
}

const COLORS = {
  Tempo: '#f97316',
  Easy: '#60a5fa',
  Intervals: '#22c55e',
  'Long Run': '#a855f7',
};

export function WorkoutTypeChart({ data }: WorkoutTypeChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#262629" />
          <XAxis
            dataKey="week"
            stroke="#525252"
            tick={{ fill: '#a1a1a1', fontSize: 12 }}
            tickFormatter={(value) => `W${value}`}
          />
          <YAxis
            stroke="#525252"
            tick={{ fill: '#a1a1a1', fontSize: 12 }}
            tickFormatter={(value) => `${value}km`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#141416',
              border: '1px solid #262629',
              borderRadius: '2px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#f5f5f4' }}
            formatter={(value: number) => [`${value} km`]}
            labelFormatter={(label) => `Week ${label}`}
          />
          <Legend
            wrapperStyle={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="Tempo" stackId="a" fill={COLORS.Tempo} />
          <Bar dataKey="Easy" stackId="a" fill={COLORS.Easy} />
          <Bar dataKey="Intervals" stackId="a" fill={COLORS.Intervals} />
          <Bar dataKey="Long Run" stackId="a" fill={COLORS['Long Run']} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
