
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RadarData {
  subject: string;
  score: number;
  fullMark: number;
}

interface RadarChartComponentProps {
  data: RadarData[];
}

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <Legend />
        <Radar name="Maturity Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartComponent;
