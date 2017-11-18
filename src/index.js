import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Quiz from './components/Quiz';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Quiz id="gfquiz"/>, document.getElementById('root'));
registerServiceWorker();
