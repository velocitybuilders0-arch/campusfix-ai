import Badge from '../ui/Badge';
import CategoryTag from './CategoryTag';
import IssueStatusBadge from './IssueStatusBadge';
import PriorityIndicator from './PriorityIndicator';

function IssueDetailLayout({ issue }) {
  if (!issue) {
    return null;
  }

  return (
    <div className="layout-grid">
      <section className="card issue-card">
        <div className="issue-card__header">
          <h2 className="issue-card__title">{issue.title}</h2>
          <IssueStatusBadge status={issue.status} />
        </div>

        <div className="issue-card__meta">
          <span>{issue.id}</span>
          <CategoryTag category={issue.category} />
          <PriorityIndicator priority={issue.priority} />
          <span>{issue.location}</span>
        </div>

        <p className="issue-card__description">{issue.description}</p>
      </section>

      <aside className="card issue-card">
        <h3>Issue summary</h3>
        <div className="issue-card__meta">
          <Badge variant="muted">{issue.department}</Badge>
          <Badge variant="muted">{issue.studentName}</Badge>
        </div>
        <p><strong>Priority:</strong> {issue.priority}</p>
        <p><strong>Status:</strong> {issue.status}</p>
        <p><strong>Updated:</strong> {new Date(issue.updatedAt).toLocaleString()}</p>
      </aside>
    </div>
  );
}

export default IssueDetailLayout;
