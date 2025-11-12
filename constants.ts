
import type { Dimension } from './types';

export const DEFAULT_FRAMEWORK: Dimension[] = [
  {
    id: 'dim-1',
    name: 'Digital Services',
    weight: 25,
    elements: [
      { id: 'el-1-1', name: 'Service Availability (Online)', weight: 40, score: 0 },
      { id: 'el-1-2', name: 'Mobile Accessibility', weight: 30, score: 0 },
      { id: 'el-1-3', name: 'User-Centric Design', weight: 30, score: 0 },
    ],
  },
  {
    id: 'dim-2',
    name: 'Interoperability',
    weight: 20,
    elements: [
      { id: 'el-2-1', name: 'Cross-Agency Data Sharing', weight: 50, score: 0 },
      { id: 'el-2-2', name: 'Standardized APIs', weight: 50, score: 0 },
    ],
  },
  {
    id: 'dim-3',
    name: 'E-Participation',
    weight: 15,
    elements: [
      { id: 'el-3-1', name: 'Online Consultation Platforms', weight: 60, score: 0 },
      { id: 'el-3-2', name: 'Digital Voting Mechanisms', weight: 40, score: 0 },
    ],
  },
  {
    id: 'dim-4',
    name: 'Organizational Readiness',
    weight: 20,
    elements: [
      { id: 'el-4-1', name: 'Digital Skills & Training', weight: 40, score: 0 },
      { id: 'el-4-2', name: 'Change Management Strategy', weight: 30, score: 0 },
      { id: 'el-4-3', name: 'IT Governance', weight: 30, score: 0 },
    ],
  },
  {
    id: 'dim-5',
    name: 'Emerging Technologies',
    weight: 20,
    elements: [
      { id: 'el-5-1', name: 'AI & ML Adoption', weight: 50, score: 0 },
      { id: 'el-5-2', name: 'IoT for Smart City Initiatives', weight: 50, score: 0 },
    ],
  },
];
