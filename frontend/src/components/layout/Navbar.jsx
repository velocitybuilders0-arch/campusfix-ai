import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

function Navbar() {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      await supabase.auth.signOut();
    } finally {
      navigate('/login', { replace: true });
      setIsSigningOut(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">CampusFix AI</div>
      <Button variant="secondary" onClick={handleLogout} disabled={isSigningOut}>
        {isSigningOut ? 'Signing out...' : 'Logout'}
      </Button>
    </header>
  );
}

export default Navbar;
