
export interface Element {
  id: string;
  name: string;
  weight: number;
  score: number; // Score from 0 to 100
}

export interface Dimension {
  id: string;
  name: string;
  weight: number;
  elements: Element[];
}

export interface Assessment {
  id: string;
  date: string; // ISO string format
  dimensions: Dimension[];
  overallScore: number;
}
