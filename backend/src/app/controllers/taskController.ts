import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Task } from '../models/Task';
import { Employee } from '../models/Employee';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';
import { getIO } from '../../lib/socket';

const formatTask = (task: any) => ({
  ...task,
  id: (task.id ?? task._id)?.toString(),
  assignedTo:
    task.assignedTo && typeof task.assignedTo === 'object'
      ? {
          ...task.assignedTo,
          id: (task.assignedTo.id ?? task.assignedTo._id)?.toString(),
        }
      : task.assignedTo,
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { status, employeeId, priority, search } = req.query;
  const filters: Record<string, unknown> = {};

  if (status) {
    filters.status = status as string;
  }
  if (priority) {
    filters.priority = priority as string;
  }
  if (employeeId && Types.ObjectId.isValid(String(employeeId))) {
    filters.assignedTo = new Types.ObjectId(String(employeeId));
  }
  if (search) {
    const regex = { $regex: search as string, $options: 'i' };
    filters.$or = [{ title: regex }, { description: regex }, { tags: regex }];
  }

  const tasks = await Task.find(filters).populate('assignedTo').sort({ updatedAt: -1 }).lean();
  res.json({ success: true, data: tasks.map(formatTask) });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid task id', undefined, 'INVALID_TASK_ID');
  }
  const task = await Task.findById(id).populate('assignedTo').lean();
  if (!task) {
    throw new ApiError(404, 'Task not found', undefined, 'TASK_NOT_FOUND');
  }
  res.json({ success: true, data: formatTask(task) });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, status, priority, dueDate, tags = [], milestone, estimatedHours, linkedDocs = [], assignedTo } = req.body;
  if (!Types.ObjectId.isValid(assignedTo)) {
    throw new ApiError(400, 'Invalid employee id');
  }
  const employeeExists = await Employee.exists({ _id: assignedTo });
  if (!employeeExists) {
    throw new ApiError(404, 'Assigned employee not found');
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    tags,
    milestone,
    estimatedHours,
    linkedDocs,
    assignedTo,
  });

  const populatedTask = await task.populate('assignedTo');
  res.status(201).json({ success: true, data: populatedTask.toJSON() });
  try {
    getIO().emit('task:created', formatTask(populatedTask.toJSON()));
  } catch (e) {
    // ignore if socket not initialized
  }
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid task id');
  }

  if (req.body.assignedTo && !Types.ObjectId.isValid(req.body.assignedTo)) {
    throw new ApiError(400, 'Invalid employee id');
  }

  const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('assignedTo');
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  res.json({ success: true, data: task.toJSON() });
  try {
    getIO().emit('task:updated', formatTask(task.toJSON()));
  } catch (e) {
    // ignore
  }
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid task id');
  }

  await Task.findByIdAndDelete(id);
  res.status(204).send();
  try {
    getIO().emit('task:deleted', { id });
  } catch (e) {
    // ignore
  }
});

