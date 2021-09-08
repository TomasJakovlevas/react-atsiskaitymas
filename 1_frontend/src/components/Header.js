import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { UserContext } from '../App';

// Styling
import './styles/Header.css';

const Header = () => {
  // Hooks
  // --state
  // ----global
  const { dispatch } = useContext(UserContext);

  // -- redirects
  const history = useHistory();

  // Custom Functions
  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    history.push('/');
  };

  return (
    <header>
      <div className='container'>
        <div>Football CF</div>
        <nav>
          <ul>
            {localStorage.getItem('user') ? (
              <>
                <li>
                  <span onClick={handleLogout}>Logout</span>
                </li>
              </>
            ) : (
              <li>
                <Link to='/'>Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
