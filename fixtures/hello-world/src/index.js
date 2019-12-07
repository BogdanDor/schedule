import App from '/dist/App.js';
import React from '/node_modules/schedule/src/React.js';
import Schedule from '/node_modules/schedule/src/index.js';

Schedule.render(<App></App>, document.getElementById('app'));
