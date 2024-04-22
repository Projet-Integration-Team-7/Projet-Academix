import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Chatbot from './Chatbot';

const App = () => {
  return (
    <Router>
      <Route path="/chatbot" component={Chatbot} />
    </Router>
  );
};

export default App;
