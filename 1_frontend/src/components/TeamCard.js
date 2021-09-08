import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from '../App';

// Styling
import './styles/TeamCard.css';

const TeamCard = () => {
  // Hooks
  // -- state
  // ---- local
  const [errorMessage, setErrorMessage] = useState('');

  // ---- global
  const { state, dispatch } = useContext(UserContext);

  // Custom Functions
  const handleVote = (id, e) => {
    axios
      .post(
        `http://localhost:5000/api/users/vote/${localStorage.getItem(
          'user'
        )}/${id}`
      )
      .then((response) => {
        if (response.data.status === 'failed') {
          axios
            .delete(
              `http://localhost:5000/api/users/downvote/${localStorage.getItem(
                'user'
              )}/${id}`
            )
            .then((response) => {
              if (response.data.status === 'failed') {
                setErrorMessage(response.data.message);
                setTimeout(() => {
                  setErrorMessage('');
                }, 3000);
              } else if (response.data.status === 'success') {
                dispatch({ type: 'TEAMS', payload: response.data.users });
                e.target.innerText = '👍';
              }
            });
        } else if (response.data.status === 'success') {
          dispatch({ type: 'TEAMS', payload: response.data.users });

          e.target.innerText = '👎';
        }
      });
  };

  state.teams.sort((a, b) => {
    return b.votes - a.votes;
  });

  return (
    <>
      <p className='errorMessage'>{errorMessage}</p>

      {state.teams ? (
        state.teams.map((item) => (
          <div key={item._id} className='teamCard'>
            <div className='teamLogo'>
              <img src={item.teamLogoUrl} alt='logo' />
            </div>
            <div className='teamInfo'>
              <h4>{item.teamName}</h4>
              <p>Score: {item.votes}</p>
              <button onClick={(e) => handleVote(item._id, e)}>👍 </button>
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default TeamCard;
