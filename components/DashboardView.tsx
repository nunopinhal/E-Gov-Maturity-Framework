import React from 'react';
import { useFramework } from '../hooks/useFramework';
import RadarChartComponent from './RadarChartComponent';
import LineChartComponent from './LineChartComponent';
import { TrendingUp, Target, BarChart2, ClipboardList } from 'lucide-react';

const DashboardView: React.FC = () => {
  const { getLatestAssessment, getAssessmentHistory } = useFramework();

  const latestAssessment = getLatestAssessment();
  const history = getAssessmentHistory();

  if (!latestAssessment) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <ClipboardList className="w-24 h-24 text-blue-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome to the E-Gov Maturity Framework</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No assessments have been recorded yet. Please go to the "New Assessment" tab to get started.
        </p>
      </div>
    );
  }

  const radarData = latestAssessment.dimensions.map(dim => {
    const totalElWeight = dim.elements.reduce((sum, el) => sum + el.weight, 0);
    const dimScore = totalElWeight > 0 ? dim.elements.reduce((sum, el) => sum + (el.score * (el.weight / totalElWeight)), 0) : 0;
    return {
      subject: dim.name,
      score: parseFloat(dimScore.toFixed(2)),
      fullMark: 100,
    };
  });
  
  const lineData = history.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    score: parseFloat(item.score.toFixed(2))
  }));

  const getTopDimension = () => {
    if (radarData.length === 0) return { name: 'N/A', score: 0 };
    const top = radarData.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    return { name: top.subject, score: top.score };
  };

  const getLowestDimension = () => {
    if (radarData.length === 0) return { name: 'N/A', score: 0 };
    // Corrected logic: find the minimum score
    const lowest = radarData.reduce((prev, current) => (prev.score < current.score) ? prev : current);
    return { name: lowest.subject, score: lowest.score };
  };

  const topDimension = getTopDimension();
  const lowestDimension = getLowestDimension();


  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Maturity Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full"><TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Overall Maturity Score</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{latestAssessment.overallScore.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full"><Target className="w-8 h-8 text-green-600 dark:text-green-400" /></div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Highest Dimension</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{topDimension.name} <span className="text-lg font-medium text-green-600">({topDimension.score})</span></p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
           <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full"><BarChart2 className="w-8 h-8 text-red-600 dark:text-red-400 transform -scale-y-100" /></div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Lowest Dimension</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{lowestDimension.name} <span className="text-lg font-medium text-red-600">({lowestDimension.score})</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Maturity Breakdown</h2>
          <div className="h-96">
            <RadarChartComponent data={radarData} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Progress Over Time</h2>
          <div className="h-96">
            <LineChartComponent data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;