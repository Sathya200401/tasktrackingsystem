export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'testing' | 'need_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Employee {
  id: string;
  name: string;
  title?: string;
  department?: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  phone?: string;
  skills?: string[];
  allocation?: number;
  startDate?: string;
  role?: 'admin' | 'member';
  totalTasks?: number;
  completedTasks?: number;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  milestone?: string;
  estimatedHours?: number;
  linkedDocs?: string[];
  assignedTo: Employee;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardSummary {
  totals: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    totalEmployees: number;
    activeEmployees: number;
    overdueTasks: number;
  };
  distribution: {
    status: Record<TaskStatus, number>;
    priority: Record<TaskPriority, number>;
  };
  recentActivities: Task[];
}

