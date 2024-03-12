import React from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/router';
import Messages from './Messages';

const App = () => {
  const router = useRouter();

  return (
    <Messages router={router} />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
