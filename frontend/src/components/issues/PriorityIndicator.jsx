import { PRIORITY_LABELS } from '../../constants/priorities';

const dotColors = {
  LOW: '#16a34a',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#dc2626',
};

function PriorityIndicator({ priority }) {
  const label = PRIORITY_LABELS[priority] || priority;

  return (
    <span className="priority-indicator">
      <span
        className="priority-indicator__dot"
        style={{ backgroundColor: dotColors[priority] || '#64748b' }}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}

export default PriorityIndicator;
