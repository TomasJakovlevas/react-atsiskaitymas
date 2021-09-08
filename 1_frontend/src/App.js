import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

// Styling
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';

// Components
import Header from './components/Header';

// Context
export const UserContext = React.createContext();

// State Managment
const initialState = { user: '', userData: {}, teams: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'SIGNUP':
      return { ...state, user: action.payload, teams: action.teams };
    case 'LOGOUT':
      return { ...state, user: '', userData: {} };
    case 'DATA':
      return { ...state, userData: action.payload };
    case 'TEAMS':
      return { ...state, teams: action.payload };
    default:
      return state;
  }
};

function App() {
  // Hooks
  // -- state
  const [state, dispatch] = useReducer(reducer, initialState);

  // -- side Effect
  useEffect(() => {
    // Getting ALL Teams with votes
    axios.get('http://localhost:5000/api/users/').then((response) => {
      dispatch({ type: 'TEAMS', payload: response.data });
    });
  }, []);

  // console.log(state.teams);

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Router>
          <Header />
          <Switch>
            <Route exact path='/' component={LoginPage} />
            <Route path='/account' component={ProtectedRoute} />
          </Switch>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
