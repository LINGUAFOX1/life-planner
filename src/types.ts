export interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  milestones: Milestone[];
}

export interface HealthStats {
  water: number; // glasses
  calories: number;
  workoutProgress: number; // percentage
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  status?: string;
}
