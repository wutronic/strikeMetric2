export interface PunchAnalysis {
  id: number;
  user_id: number;
  punch_type: string;
  speed?: number;
  force?: number;
  accuracy?: number;
  timestamp: string;
  notes?: string;
} 