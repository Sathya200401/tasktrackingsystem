import { connectDB } from '../config/db';
import { Employee } from '../app/models/Employee';
import { Task } from '../app/models/Task';

const employees = [
  {
    name: 'Ava Patel',
    title: 'Engineering Manager',
    department: 'Engineering',
    email: 'ava.patel@example.com',
    location: 'New York',
    role: 'admin',
    phone: '+1 212 555 0111',
    skills: ['Leadership', 'Node.js', 'Agile'],
    allocation: 90,
    startDate: new Date('2020-04-10'),
  },
  {
    name: 'Noah Ramirez',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    email: 'noah.ramirez@example.com',
    location: 'Remote',
    phone: '+1 415 555 0145',
    skills: ['React', 'TypeScript', 'UX'],
    allocation: 80,
    startDate: new Date('2021-07-15'),
  },
  {
    name: 'Lena Brooks',
    title: 'Product Designer',
    department: 'Design',
    email: 'lena.brooks@example.com',
    location: 'Austin',
    phone: '+1 737 555 0190',
    skills: ['Design Systems', 'Figma'],
    allocation: 70,
    startDate: new Date('2022-02-01'),
  },
  {
    name: 'Marcus Chen',
    title: 'Product Manager',
    department: 'Product',
    email: 'marcus.chen@example.com',
    location: 'Seattle',
    phone: '+1 206 555 0172',
    skills: ['Roadmapping', 'Stakeholder Mgmt'],
    allocation: 95,
    startDate: new Date('2019-11-20'),
  },
];

const seed = async () => {
  await connectDB();
  await Promise.all([Task.deleteMany(), Employee.deleteMany()]);

  const createdEmployees = await Employee.insertMany(employees);

  const sampleTasks = [
    {
      title: 'Implement authentication flow',
      description: 'Add JWT authentication and role-based access control.',
      status: 'in_progress',
      priority: 'critical',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['backend', 'security'],
      milestone: 'MVP readiness',
      estimatedHours: 24,
      linkedDocs: ['https://company.notion.site/auth-spec'],
      assignedTo: createdEmployees[1]._id,
    },
    {
      title: 'Redesign dashboard cards',
      description: 'Align visual language with new design system tokens.',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tags: ['design'],
      milestone: 'UI polish',
      estimatedHours: 16,
      assignedTo: createdEmployees[2]._id,
    },
    {
      title: 'Finalize Q4 roadmap',
      description: 'Consolidate inputs from stakeholders and share with exec team.',
      status: 'blocked',
      priority: 'high',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      tags: ['planning'],
      milestone: 'Board review',
      linkedDocs: ['https://company.sharepoint.com/q4-roadmap'],
      assignedTo: createdEmployees[3]._id,
    },
    {
      title: 'Upgrade CI pipeline',
      description: 'Move to multi-stage builds and tighten caching strategy.',
      status: 'done',
      priority: 'high',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['devops'],
      estimatedHours: 12,
      assignedTo: createdEmployees[0]._id,
    },
  ];

  await Task.insertMany(sampleTasks);
  console.log('Database seeded with employees and tasks'); // eslint-disable-line no-console
  process.exit(0);
};

seed().catch((error) => {
  console.error(error); // eslint-disable-line no-console
  process.exit(1);
});

