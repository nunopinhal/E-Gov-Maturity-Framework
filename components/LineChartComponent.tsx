
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineData {
  date: string;
  score: number;
}

interface LineChartComponentProps {
  data: LineData[];
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }}/>
        <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip
           contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#10b981" activeDot={{ r: 8 }} name="Overall Score" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
