import { PRIORITY_LABELS, PRIORITIES } from '../../constants/priorities';

const priorityClass = {
  [PRIORITIES.LOW]: 'priority-indicator__dot--low',
  [PRIORITIES.MEDIUM]: 'priority-indicator__dot--medium',
  [PRIORITIES.HIGH]: 'priority-indicator__dot--high',
  [PRIORITIES.CRITICAL]: 'priority-indicator__dot--critical',
};

function PriorityIndicator({ priority }) {
  const label = PRIORITY_LABELS[priority] || priority;
  const dotClass = priorityClass[priority] || 'priority-indicator__dot--muted';

  return (
    <span className="priority-indicator">
      <span className={`priority-indicator__dot ${dotClass}`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default PriorityIndicator;
