import React, { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import axios from 'axios';
import TeamCard from '../components/TeamCard';

import './styles/Account.css';

// Components

const AccountPage = () => {
  // Hooks
  // -- state
  // ---- global
  const { state, dispatch } = useContext(UserContext);

  // side effect
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users/' + localStorage.getItem('user'))
      .then((response) => {
        dispatch({ type: 'DATA', payload: response.data });
      });
  }, [dispatch]);

  return (
    <>
      {state.userData ? (
        <div className='container'>
          <h2>Welcome, to {state.userData.teamName}</h2>
          <section className='teams_container'>
            <TeamCard />
          </section>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default AccountPage;
