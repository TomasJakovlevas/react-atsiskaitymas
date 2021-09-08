import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

import './styles/Login.css';

import { UserContext } from '../App';

const LoginPage = () => {
  // Hooks
  // -- state
  // ---- local
  // ------ login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  // ------ signup form
  const [signupName, setSignupName] = useState('');
  const [signupSurname, setSignupSurname] = useState('');
  const [signupTeamName, setSignupTeamName] = useState('');
  const [signupTeamLogoUrl, setSignupTeamLogoUrl] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupErrorMessage, setSignupErrorMessage] = useState('');

  //   ---- global
  const { dispatch } = useContext(UserContext);

  // Redirects
  const history = useHistory();

  //   Custom Functions
  const loginUser = (e) => {
    e.preventDefault();

    let user = {
      email: loginEmail,
      password: loginPassword,
    };

    axios
      .post('http://localhost:5000/api/users/login', user)
      .then((response) => {
        const userID = response.data.userID;

        localStorage.setItem('user', userID);

        dispatch({ type: 'LOGIN', payload: userID });

        history.push('/account');
      })
      .catch((err) => {
        setLoginEmail('');
        setLoginPassword('');
        setLoginErrorMessage(err.response.data.message);
      });
  };

  const signupUser = (e) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupErrorMessage('passwords do not match');

      return;
    }

    const user = {
      name: signupName,
      surname: signupSurname,
      teamName: signupTeamName,
      teamLogoUrl: signupTeamLogoUrl,
      email: signupEmail,
      password: signupPassword,
    };

    axios
      .post('http://localhost:5000/api/users/signup/', user)
      .then((response) => {
        if (response.data.status === 'Failed') {
          setSignupErrorMessage(response.data.message);

          setSignupEmail('');
          setSignupPassword('');
          setSignupConfirmPassword('');
        } else if (response.data.status === 'Success') {
          localStorage.setItem('user', response.data.userID);

          dispatch({
            type: 'SIGNUP',
            payload: response.data.userID,
            teams: response.data.teams,
          });

          history.push('/account');
        }
      });
  };

  return (
    <main>
      <div className='container'>
        <h2>Welcome</h2>
        <h3>Got a Football Club? Join us!</h3>
        <div className='section_container'>
          <section id='login'>
            <h4>Already a member? Log in!</h4>
            <form id='loginForm' onSubmit={loginUser}>
              <label htmlFor='userEmail'>Email</label>
              <input
                type='text'
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <label htmlFor='userPassword'>Password</label>
              <input
                type='password'
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              <input type='submit' value='LOG IN' />
            </form>

            <p className='loginError'>{loginErrorMessage}</p>
          </section>
          <section id='signup'>
            <h4>You new? Create your Team</h4>
            <form id='signupForm' onSubmit={signupUser}>
              <label htmlFor='signupName'>Name</label>
              <input
                type='text'
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
              />

              <label htmlFor='signupSurname'>Surname</label>
              <input
                type='text'
                required
                value={signupSurname}
                onChange={(e) => setSignupSurname(e.target.value)}
              />

              <label htmlFor='signupTeamName'>Team Name</label>
              <input
                type='text'
                required
                value={signupTeamName}
                onChange={(e) => setSignupTeamName(e.target.value)}
              />

              <label htmlFor='signupTeamName'>Team Logo URL</label>
              <input
                type='text'
                required
                value={signupTeamLogoUrl}
                onChange={(e) => setSignupTeamLogoUrl(e.target.value)}
              />

              <label htmlFor='signupEmail'>Email</label>
              <input
                type='email'
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />

              <label htmlFor='signupPassword'>Password</label>
              <input
                type='password'
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />

              <label htmlFor='signupConfirmPassword'>Repeat Password</label>
              <input
                type='password'
                required
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
              />

              <input type='submit' value='SIGNUP' />
            </form>
            <p className='signupError'>{signupErrorMessage}</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
