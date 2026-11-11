export type ModuleStatus = 'available' | 'soon' | 'dev';

export interface ModuleInfo {
  id: string;
  title: string;
  discipline: string;
  iconName: string;
  status: ModuleStatus;
  statusLabel: string;
  tagline: string;
  description: string;
  url?: string;
  highlights: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface TechPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badge: string;
  technicalDetails: string[];
}
