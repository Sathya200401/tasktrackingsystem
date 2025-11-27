import { Employee } from '../app/models/Employee';
import { Task } from '../app/models/Task';

export const getDashboardSummary = async () => {
  const [totalTasks, completedTasks, overdueTasks, tasksByStatusRaw, tasksByPriorityRaw, totalEmployees, activeEmployees, recentActivities] =
    await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'done' }),
      Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'done' } }),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Employee.countDocuments(),
      Task.distinct('assignedTo').then((ids) => ids.length),
      Task.find().populate('assignedTo').sort({ updatedAt: -1 }).limit(8),
    ]);

  const tasksByStatus = tasksByStatusRaw.reduce<Record<string, number>>((acc, item) => {
    acc[item._id as string] = item.count;
    return acc;
  }, {});

  const tasksByPriority = tasksByPriorityRaw.reduce<Record<string, number>>((acc, item) => {
    acc[item._id as string] = item.count;
    return acc;
  }, {});

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return {
    totals: {
      totalTasks,
      completedTasks,
      completionRate,
      totalEmployees,
      activeEmployees,
      overdueTasks,
    },
    distribution: {
      status: tasksByStatus,
      priority: tasksByPriority,
    },
    recentActivities: recentActivities.map((task) => task.toJSON()),
  };
};

