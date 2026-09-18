// TEMPORARY fixture data for Phase 1. This file is intentionally isolated from components.

export const issuesFixture = [
  {
    id: 'FIX-001',
    title: 'Ceiling fan not working',
    description: 'The classroom ceiling fan is not spinning and the room is very hot.',
    category: 'Electrical',
    priority: 'HIGH',
    status: 'OPEN',
    department: 'Electrical Maintenance',
    createdAt: '2026-09-18T09:00:00.000Z',
    updatedAt: '2026-09-18T09:15:00.000Z',
    studentName: 'Aarav Sharma',
    location: 'Room 204',
    updates: [
      {
        id: 'UPD-01',
        message: 'Issue filed and awaiting assignment.',
        createdAt: '2026-09-18T09:15:00.000Z',
      },
    ],
  },
  {
    id: 'FIX-002',
    title: 'Water leakage in washroom',
    description: 'There is continuous leakage near the sink and the floor is wet.',
    category: 'Plumbing',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    department: 'Plumbing Maintenance',
    createdAt: '2026-09-17T11:10:00.000Z',
    updatedAt: '2026-09-17T12:30:00.000Z',
    studentName: 'Neha Gupta',
    location: 'Hostel Block B',
    updates: [
      {
        id: 'UPD-02',
        message: 'Assigned to plumbing team.',
        createdAt: '2026-09-17T12:30:00.000Z',
      },
    ],
  },
];

export default issuesFixture;
