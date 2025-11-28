import React, { useMemo } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Brush } from 'recharts';
import type { Task } from '../../types';
import dayjs from '../../lib/dayjs';

interface Props {
  tasks: Task[];
  days?: number; // how many days back to show
}

export const TimelineChart: React.FC<Props> = ({ tasks, days = 30 }) => {
  // Build a time series of tasks created vs completed per day
  const series = useMemo(() => {
    const end = dayjs();
    const start = end.subtract(days - 1, 'day');
    const map: Record<string, { date: string; created: number; completed: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = start.add(i, 'day');
      const key = d.format('YYYY-MM-DD');
      map[key] = { date: key, created: 0, completed: 0 };
    }

    tasks.forEach((t) => {
      if (t.createdAt) {
        const k = dayjs(t.createdAt).format('YYYY-MM-DD');
        if (map[k]) map[k].created += 1;
      }
      if ((t.updatedAt || t.createdAt) && (t.status === 'done' || t.status === 'in_review' || t.status === 'testing')) {
        // treat status changes to done-like statuses as completions; use updatedAt if available
        const when = t.updatedAt ?? t.createdAt;
        if (when) {
          const k = dayjs(when).format('YYYY-MM-DD');
          if (map[k]) map[k].completed += 1;
        }
      }
    });

    const arr = Object.values(map).sort((a, b) => (a.date > b.date ? 1 : -1));
    // accumulate into running totals for burndown-like view
    let cumulativeCreated = 0;
    let cumulativeCompleted = 0;
    return arr.map((row) => {
      cumulativeCreated += row.created;
      cumulativeCompleted += row.completed;
      return {
        date: row.date,
        created: row.created,
        completed: row.completed,
        cumulativeCreated,
        cumulativeCompleted,
        remaining: Math.max(0, cumulativeCreated - cumulativeCompleted),
      };
    });
  }, [tasks, days]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, height: 320 }}>
      <Stack spacing={2} sx={{ height: '100%' }}>
        <Typography variant="h6">Timeline — Created vs Completed</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => dayjs(d).format('MM/DD')}
              minTickGap={10}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => dayjs(label).format('MMM D, YYYY')}
              formatter={(value: number, name: string) => [value, name]}
            />
            <Area type="monotone" dataKey="cumulativeCreated" name="Cumulative Created" stackId="1" stroke="#8884d8" fill="#e9d5ff" />
            <Area type="monotone" dataKey="cumulativeCompleted" name="Cumulative Completed" stackId="1" stroke="#82ca9d" fill="#dcfce7" />
            <Area type="monotone" dataKey="remaining" name="Remaining" stroke="#f97316" fill="#fff7ed" />
            <Brush dataKey="date" height={30} stroke="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
};
