
import React, { useState, useEffect } from 'react';
import { useFramework } from '../hooks/useFramework';
import type { Dimension } from '../types';
import { CheckCircle, Save } from 'lucide-react';

const AssessmentView: React.FC = () => {
  const { dimensions, saveAssessment } = useFramework();
  const [assessmentState, setAssessmentState] = useState<Dimension[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Deep copy to avoid mutating the original framework state
    setAssessmentState(JSON.parse(JSON.stringify(dimensions)));
  }, [dimensions]);

  const handleScoreChange = (dimId: string, elId: string, score: number) => {
    setAssessmentState(prevState =>
      prevState.map(dim => {
        if (dim.id === dimId) {
          return {
            ...dim,
            elements: dim.elements.map(el =>
              el.id === elId ? { ...el, score } : el
            ),
          };
        }
        return dim;
      })
    );
  };

  const handleSubmit = () => {
    saveAssessment(assessmentState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
  };
  
  if (dimensions.length === 0) {
     return (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No Framework Configured</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Please configure the assessment framework before starting an assessment.
          </p>
        </div>
     );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">New Assessment</h1>
      
      <div className="space-y-6">
        {assessmentState.map((dim, dimIndex) => (
          <div key={dim.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
              {dimIndex + 1}. {dim.name}
            </h2>
            <div className="space-y-6">
              {dim.elements.map(el => (
                <div key={el.id}>
                  <label htmlFor={`slider-${el.id}`} className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">
                    <span>{el.name}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{el.score}</span>
                  </label>
                  <input
                    id={`slider-${el.id}`}
                    type="range"
                    min="0"
                    max="100"
                    value={el.score}
                    onChange={e => handleScoreChange(dim.id, el.id, parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={isSaved}
          className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors duration-200 ${
            isSaved 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Assessment Saved!
            </>
          ) : (
             <>
              <Save className="w-5 h-5 mr-2" />
              Save Assessment
             </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AssessmentView;
