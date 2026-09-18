import Badge from '../ui/Badge';
import { STATUS_LABELS } from '../../constants/statuses';

function IssueStatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;

  const toneMap = {
    OPEN: 'warning',
    ASSIGNED: 'muted',
    IN_PROGRESS: 'warning',
    RESOLVED: 'success',
    CLOSED: 'success',
    REJECTED: 'danger',
  };

  return <Badge variant={toneMap[status] || 'muted'}>{label}</Badge>;
}

export default IssueStatusBadge;
