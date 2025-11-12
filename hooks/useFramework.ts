import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Dimension, Element, Assessment } from '../types';
import { DEFAULT_FRAMEWORK } from '../constants';

interface FrameworkContextType {
  dimensions: Dimension[];
  assessments: Assessment[];
  addDimension: (name: string) => void;
  updateDimension: (id: string, name: string, weight: number) => void;
  deleteDimension: (id: string) => void;
  addElement: (dimensionId: string, name: string) => void;
  updateElement: (dimensionId: string, elementId: string, name: string, weight: number) => void;
  deleteElement: (dimensionId: string, elementId: string) => void;
  saveAssessment: (assessedDimensions: Dimension[]) => void;
  getLatestAssessment: () => Assessment | null;
  getAssessmentHistory: () => { date: string; score: number }[];
}

const FrameworkContext = createContext<FrameworkContextType | undefined>(undefined);

const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const FrameworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    try {
      const storedDimensions = localStorage.getItem('frameworkDimensions');
      const storedAssessments = localStorage.getItem('frameworkAssessments');

      if (storedDimensions) {
        setDimensions(JSON.parse(storedDimensions));
      } else {
        setDimensions(deepCopy(DEFAULT_FRAMEWORK));
      }

      if (storedAssessments) {
        setAssessments(JSON.parse(storedAssessments));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setDimensions(deepCopy(DEFAULT_FRAMEWORK));
      setAssessments([]);
    }
  }, []);

  useEffect(() => {
    if (dimensions.length > 0) {
      localStorage.setItem('frameworkDimensions', JSON.stringify(dimensions));
    }
  }, [dimensions]);

  useEffect(() => {
    if(assessments.length > 0) {
      localStorage.setItem('frameworkAssessments', JSON.stringify(assessments));
    }
  }, [assessments]);

  const normalizeWeights = (items: (Dimension | Element)[]) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight === 0 || items.length === 0) return items.map(item => ({ ...item, weight: items.length > 0 ? 100 / items.length : 0 }));
    return items.map(item => ({ ...item, weight: (item.weight / totalWeight) * 100 }));
  };

  const addDimension = useCallback((name: string) => {
    setDimensions(prev => {
      const newDimension: Dimension = {
        id: `dim-${Date.now()}`,
        name,
        weight: 10,
        elements: [],
      };
      const updated = [...prev, newDimension];
      return normalizeWeights(updated) as Dimension[];
    });
  }, []);

  const updateDimension = useCallback((id: string, name: string, weight: number) => {
    setDimensions(prev => {
      const updated = prev.map(d => (d.id === id ? { ...d, name, weight } : d));
      return normalizeWeights(updated) as Dimension[];
    });
  }, []);
  
  const deleteDimension = useCallback((id: string) => {
    setDimensions(prev => {
        const updated = prev.filter(d => d.id !== id);
        return normalizeWeights(updated) as Dimension[];
    });
  }, []);

  const addElement = useCallback((dimensionId: string, name: string) => {
    setDimensions(prev => {
      return prev.map(dim => {
        if (dim.id === dimensionId) {
          const newElement: Element = {
            id: `el-${Date.now()}`,
            name,
            weight: 10,
            score: 0
          };
          const updatedElements = [...dim.elements, newElement];
          return { ...dim, elements: normalizeWeights(updatedElements) as Element[] };
        }
        return dim;
      });
    });
  }, []);

  const updateElement = useCallback((dimensionId: string, elementId: string, name: string, weight: number) => {
    setDimensions(prev => {
      return prev.map(dim => {
        if (dim.id === dimensionId) {
          const updatedElements = dim.elements.map(el =>
            el.id === elementId ? { ...el, name, weight } : el
          );
          return { ...dim, elements: normalizeWeights(updatedElements) as Element[] };
        }
        return dim;
      });
    });
  }, []);

  const deleteElement = useCallback((dimensionId: string, elementId: string) => {
    setDimensions(prev => {
      return prev.map(dim => {
        if (dim.id === dimensionId) {
          const updatedElements = dim.elements.filter(el => el.id !== elementId);
          return { ...dim, elements: normalizeWeights(updatedElements) as Element[] };
        }
        return dim;
      });
    });
  }, []);

  const calculateOverallScore = (assessedDimensions: Dimension[]): number => {
    const totalDimWeight = assessedDimensions.reduce((sum, dim) => sum + dim.weight, 0);
    
    let totalScore = 0;
    assessedDimensions.forEach(dim => {
      const totalElWeight = dim.elements.reduce((sum, el) => sum + el.weight, 0);
      let dimScore = 0;
      if (totalElWeight > 0) {
        dimScore = dim.elements.reduce((sum, el) => {
            return sum + (el.score * (el.weight / totalElWeight));
        }, 0);
      }
      if (totalDimWeight > 0) {
        totalScore += dimScore * (dim.weight / totalDimWeight);
      }
    });

    return totalScore;
  }

  const saveAssessment = useCallback((assessedDimensions: Dimension[]) => {
    const overallScore = calculateOverallScore(assessedDimensions);
    const newAssessment: Assessment = {
      id: `asm-${Date.now()}`,
      date: new Date().toISOString(),
      dimensions: deepCopy(assessedDimensions),
      overallScore: overallScore,
    };
    setAssessments(prev => [...prev, newAssessment]);
  }, []);

  const getLatestAssessment = useCallback(() => {
    if (assessments.length === 0) return null;
    return assessments[assessments.length - 1];
  }, [assessments]);

  const getAssessmentHistory = useCallback(() => {
    return assessments.map(a => ({ date: a.date, score: a.overallScore }));
  }, [assessments]);

  const value = {
    dimensions,
    assessments,
    addDimension,
    updateDimension,
    deleteDimension,
    addElement,
    updateElement,
    deleteElement,
    saveAssessment,
    getLatestAssessment,
    getAssessmentHistory,
  };

  // FIX: The `.ts` file extension does not allow JSX syntax. Replaced with `React.createElement` to resolve compilation errors.
  return React.createElement(FrameworkContext.Provider, { value: value }, children);
};

export const useFramework = (): FrameworkContextType => {
  const context = useContext(FrameworkContext);
  if (context === undefined) {
    throw new Error('useFramework must be used within a FrameworkProvider');
  }
  return context;
};
