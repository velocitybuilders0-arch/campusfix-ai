import { Link } from 'react-router-dom';
import IssueStatusBadge from './IssueStatusBadge';
import PriorityIndicator from './PriorityIndicator';
import CategoryTag from './CategoryTag';

function IssueCard({ issue, basePath = '/student' }) {
  return (
    <article className="card issue-card">
      <div className="issue-card__header">
        <h3 className="issue-card__title">{issue.title}</h3>
        <IssueStatusBadge status={issue.status} />
      </div>

      <div className="issue-card__meta">
        <span>{issue.id}</span>
        <CategoryTag category={issue.category} />
        <PriorityIndicator priority={issue.priority} />
      </div>

      <p className="issue-card__description">{issue.description}</p>

      <div className="issue-card__meta">
        <span>{issue.updatedAt ? `Updated ${new Date(issue.updatedAt).toLocaleDateString()}` : 'Recently reported'}</span>
        <Link to={`${basePath}/issues/${issue.id}`}>View details</Link>
      </div>
    </article>
  );
}

export default IssueCard;
