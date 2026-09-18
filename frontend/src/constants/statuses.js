export const STATUSES = Object.freeze({
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
});

export const STATUS_OPTIONS = Object.values(STATUSES);
export const STATUS_LABELS = {
  [STATUSES.OPEN]: 'Open',
  [STATUSES.ASSIGNED]: 'Assigned',
  [STATUSES.IN_PROGRESS]: 'In Progress',
  [STATUSES.RESOLVED]: 'Resolved',
  [STATUSES.CLOSED]: 'Closed',
  [STATUSES.REJECTED]: 'Rejected',
};
