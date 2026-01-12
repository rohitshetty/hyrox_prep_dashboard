'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { getCurrentWeek, TOTAL_WEEKS } from '@/lib/dates';

interface MileageChartProps {
  data: Array<{
    week: number;
    phase: string;
    volume: number;
  }>;
}

export function MileageChart({ data }: MileageChartProps) {
  const currentWeek = getCurrentWeek();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            itemStyle={{ color: '#d4f505' }}
            formatter={(value: number) => [`${value} km`, 'Volume']}
            labelFormatter={(label) => `Week ${label}`}
          />
          {currentWeek > 0 && currentWeek <= TOTAL_WEEKS && (
            <ReferenceLine
              x={currentWeek}
              stroke="#d4f505"
              strokeDasharray="5 5"
              label={{
                value: 'Current',
                fill: '#d4f505',
                fontSize: 10,
                position: 'top',
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#d4f505"
            strokeWidth={2}
            dot={{ fill: '#d4f505', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: '#d4f505' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
