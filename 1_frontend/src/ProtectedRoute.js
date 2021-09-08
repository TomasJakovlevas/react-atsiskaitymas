import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

// Pages
import AccountPage from './pages/AccountPage';

const ProtectedRoute = () => {
  // Hooks
  // --redirect
  const history = useHistory();

  // ---- side effects
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      history.push('/');
    }
  }, [history]);

  return <AccountPage />;
};

export default ProtectedRoute;
