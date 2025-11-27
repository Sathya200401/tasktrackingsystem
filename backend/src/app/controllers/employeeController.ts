import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Employee } from '../models/Employee';
import { Task } from '../models/Task';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';

export const getEmployees = asyncHandler(async (_req: Request, res: Response) => {
  const employees = await Employee.aggregate([
    {
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: 'assignedTo',
        as: 'tasks',
      },
    },
    {
      $addFields: {
        totalTasks: { $size: '$tasks' },
        completedTasks: {
          $size: {
            $filter: {
              input: '$tasks',
              as: 'task',
              cond: { $eq: ['$$task.status', 'done'] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        id: { $toString: '$_id' },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        title: 1,
        department: 1,
        email: 1,
        avatarUrl: 1,
        location: 1,
        phone: 1,
        skills: 1,
        allocation: 1,
        startDate: 1,
        role: 1,
        totalTasks: 1,
        completedTasks: 1,
        createdAt: 1,
        updatedAt: 1,
        id: 1,
      },
    },
    { $sort: { name: 1 } },
  ]);

  res.json({ success: true, data: employees });
});

export const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid employee id');
  }

  const employee = await Employee.findById(id).lean();
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  const tasks = await Task.find({ assignedTo: id }).lean();
  res.json({
    success: true,
    data: {
      ...employee,
      id: (employee._id as Types.ObjectId).toString(),
      tasks: tasks.map((task) => ({
        ...task,
        id: (task._id as Types.ObjectId).toString(),
      })),
    },
  });
});

export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { name, title, department, email, avatarUrl, location, role, phone, skills = [], allocation, startDate } = req.body;
  const existing = await Employee.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Employee with this email already exists');
  }

  const employee = await Employee.create({
    name,
    title,
    department,
    email,
    avatarUrl,
    location,
    role,
    phone,
    skills,
    allocation,
    startDate,
  });
  res.status(201).json({ success: true, data: employee });
});

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid employee id');
  }

  const updates = req.body;
  const employee = await Employee.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  res.json({ success: true, data: employee });
});

export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid employee id');
  }

  const hasTasks = await Task.exists({ assignedTo: id });
  if (hasTasks) {
    throw new ApiError(400, 'Cannot delete employee with assigned tasks');
  }

  await Employee.findByIdAndDelete(id);
  res.status(204).send();
});

