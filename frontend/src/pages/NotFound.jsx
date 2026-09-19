import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

function NotFound() {
  return (
    <div className="empty-state" role="status">
      <h1>Page not found</h1>
      <p>The route you requested does not exist.</p>
      <Link to="/student">
        <Button type="button">Back home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
